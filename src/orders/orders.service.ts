import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdateOrderStatusDto } from './dto/update-orderStatus.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { Order } from './entities/order.entity';
import { generateOrderNumber } from './generate-order-number';
import { parseMaybeJson } from 'src/utils/parse.json';
import { UpdateAddressDto } from './dto/update-address.dto';
import { OrderMapper } from './order.mapper';
import { Address } from './entities/address.entity';
import { TelegramService } from 'src/telegram/telegram.service';
import { ConfigService } from '@nestjs/config';
import { UpdateOrderAssigneeDto } from './dto/update-orderAssignee.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly telegramService: TelegramService,
  ) {}

  // private readonly jwtService: JwtService,
  async createOrder(
    createOrderDto: CreateOrderDto,
    createAddressDto: CreateAddressDto,
  ) {
    const project2Url = this.configService.get('PROJECT2_URL');
    //  create dto without confirmEmail bc confirmEmail is just to extra validation for users
    const { confirmEmail, ...dtoData } = createOrderDto;

    const order = await this.orderRepository.create({
      customerName: dtoData.customerName,
      email: dtoData.email, // takes email from the new dto
      orderNumber: generateOrderNumber(),
      customFields: dtoData.customFields,
      //  use address from the dto or from createAddressDto
      address: dtoData.address
        ? Object.assign({}, dtoData.address)
        : createAddressDto
          ? Object.assign({}, createAddressDto)
          : null,
    });

    const savedOrder = await this.orderRepository.save(order);

    const adminChatId = this.configService.get('TELEGRAM_CHAT_ID');
    await this.telegramService.sendMessage(
      adminChatId,
      `📦 New order #${order.orderNumber}. 
      check order here: ${project2Url}`,
    );

    return OrderMapper.toResponse(savedOrder);
  }

  async findAllOrders(): Promise<Order[]> {
    const orders = await this.orderRepository.find();
    let arr = [];
    orders.forEach(async (order) => {
      await arr.push(OrderMapper.toResponse(order));
    });

    return arr;
  }

  async findOneOrderById(id: string): Promise<any> {
    const order = await this.orderRepository.findOne({
      where: { id: id },
    });
    if (!order) {
      throw new NotFoundException('order not found');
    }

    return OrderMapper.toResponse(order);
  }

  async findOrdersByEmail(email: string): Promise<Order[]> {
    const orders = await this.orderRepository.find({
      where: { email: email },
    });
    if (!orders) {
      throw new NotFoundException('orders not found');
    }

    let arr = [];
    orders.forEach(async (order) => {
      await arr.push(OrderMapper.toResponse(order));
    });

    return arr;
  }

  async findOrderByOrderNumber(orderNumber: string) {
    const order = await this.orderRepository.find({
      where: { orderNumber: orderNumber },
    });
    if (!order) {
      throw new NotFoundException('order not found');
    }

    return order.map(OrderMapper.toResponse);
  }

  //  later
  // async findOrderByAddress(
  //   houseNumber: string,
  //   apartmentNumber: string,
  //   street: string,
  //   city: string,
  //   zipCode: string,
  //   state: string,
  // ): Promise<Order[]> {
  //   const order = await this.orderRepository.find({
  //     where: { address: searchAddress },
  //   });
  //   if (!order) {
  //     throw new NotFoundException('order not found');
  //   }

  //   let arr = [];
  //   order.forEach(async (order) => {
  //     await arr.push({
  //       order: {
  //         createdAt: order.createdAt,
  //         orderNumber: order.orderNumber,
  //         orderStatus: order.status,
  //         customerName: order.customerName,
  //         orderDescription: order.description,
  //         email: order.email,
  //         assignedTo: order.assignedTo,
  //         orderId: order.id,
  //       },
  //       customFields: parseMaybeJson(order.customFields),
  //       address: {
  //         buildingType: order.address.buildingType,
  //         houseNumber: order.address.houseNumber,
  //         apartmentNumber: order.address.apartmentNumber,
  //         street: order.address.street,
  //         city: order.address.city,
  //         zipCode: order.address.zipCode,
  //         state: order.address.state,
  //       }, //  bc mssql does not support objects
  //     });
  //   });

  //   return arr;
  // }

  //  right now authorization by email
  async updateOrder(
    id: string,
    authEmail: string,
    updateOrderDto: UpdateOrderDto,
  ) {
    const project2Url = this.configService.get('PROJECT2_URL');
    const order = await this.orderRepository.findOne({
      where: { id: id },
      relations: ['address'],
    });

    if (!order) {
      throw new NotFoundException();
    }

    if (order.email !== authEmail) {
      throw new ForbiddenException();
    }

    if (updateOrderDto.customerName) {
      order.customerName = updateOrderDto.customerName;
    }
    if (updateOrderDto.customFields !== undefined) {
      order.customFields =
        typeof updateOrderDto.customFields !== 'string'
          ? JSON.stringify(updateOrderDto.customFields)
          : updateOrderDto.customFields;
    }
    if (updateOrderDto.email !== undefined) {
      throw new BadRequestException(
        'to change the email, ask customer service',
      );
    }

    if (updateOrderDto.address) {
      if (!order.address) {
        order.address = new Address(); //  creates new instance of address if no address before
        Object.assign(order.address, updateOrderDto.address); // inserts this address into the order
      }
      Object.assign(order.address, updateOrderDto.address); // inserts this address into the order
    }

    await this.orderRepository.save(order);

    const adminChatId = this.configService.get('TELEGRAM_CHAT_ID');
    await this.telegramService.sendMessage(
      adminChatId,
      `📦 The order #${order.orderNumber} has been changed. 
      check order here: ${project2Url}`,
    );

    return OrderMapper.toResponse(order);
  }

  async updateOrderStatus(
    id: string,
    orderNumber: string,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    const project2Url = this.configService.get('PROJECT2_URL');

    const order = await this.orderRepository.findOne({
      where: { id: id, orderNumber: orderNumber },
      relations: ['address'],
    });

    if (!order) {
      throw new NotFoundException();
    }

    if (!updateOrderStatusDto.orderStatus) {
      throw new BadRequestException('missing orderStatus');
    }

    if (updateOrderStatusDto.orderStatus !== undefined) {
      order.orderStatus = updateOrderStatusDto.orderStatus;
    }

    await this.orderRepository.save(order);

    const adminChatId = this.configService.get('TELEGRAM_CHAT_ID');
    await this.telegramService.sendMessage(
      adminChatId,
      `📦 The order #${order.orderNumber} status is: ${updateOrderStatusDto.orderStatus} 
      check order here: ${project2Url}`,
    );

    return OrderMapper.toResponse(order);
  }

  async updateOrderAssignee(
    id: string,
    orderNumber: string,
    updateOrderAssigneeDto: UpdateOrderAssigneeDto,
  ) {
    const project2Url = this.configService.get('PROJECT2_URL');

    const order = await this.orderRepository.findOne({
      where: { id: id, orderNumber: orderNumber },
      relations: ['address'],
    });

    if (!order) {
      throw new NotFoundException();
    }

    if (updateOrderAssigneeDto.assignedTo !== undefined) {
      order.assignedTo = updateOrderAssigneeDto.assignedTo;
    }

    await this.orderRepository.save(order);

    const adminChatId = this.configService.get('TELEGRAM_CHAT_ID');
    await this.telegramService.sendMessage(
      adminChatId,
      `📦 The order #${order.orderNumber} assigned to: ${updateOrderAssigneeDto.assignedTo} 
      check order here: ${project2Url}`,
    );

    return OrderMapper.toResponse(order);
  }

  async deleteOrder(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id: id },
    });
    if (!order) {
      throw new NotFoundException();
    }

    await this.orderRepository.delete(id);
    return { message: 'the user was succesfully deleted' };
  }
}
