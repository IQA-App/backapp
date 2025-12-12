import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
// import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { generateOrderNumber } from './generate-order-number';
import { parseMaybeJson } from 'src/utils/parse.json';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    // private readonly jwtService: JwtService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    const existOrder = await this.orderRepository.findOne({
      where: {
        email: createOrderDto.email,
        title: createOrderDto.title,
      },
    });

    if (existOrder) {
      throw new BadRequestException('The order with this title already exists');
    }

    // we may use this later
    // const order = new Order();
    // order.title = createOrderDto.title;
    // order.description = createOrderDto.description;
    // order.user = { id: userId }; //using userEmail from request headers

    const order = this.orderRepository.create({
      title: createOrderDto.title,
      description: createOrderDto.description,
      email: createOrderDto.email,
      orderNumber: generateOrderNumber(),
      serviceType: createOrderDto
        ? JSON.stringify(createOrderDto.serviceType)
        : null,
      // address: createOrderDto ? JSON.stringify(createOrderDto.address) : null,
      // user: { id: userId },  // figure out in the future tickets
    });

    const savedOrder = await this.orderRepository.save(order);

    return {
      order: {
        createdAt: savedOrder.createdAt,
        orderNumber: savedOrder.orderNumber,
        orderStatus: savedOrder.status,
        orderTitle: savedOrder.title,
        orderDescription: savedOrder.description,
        // address: JSON.parse(savedOrder.address),
        email: savedOrder.email,
        technician: savedOrder.technician,
        orderId: savedOrder.id,
      },
      serviceType: JSON.parse(savedOrder.serviceType),
    };
  }

  async findAllOrders() {
    const orders = await this.orderRepository.find();
    let arr = [];
    orders.forEach(async (order) => {
      await arr.push({
        order: {
          createdAt: order.createdAt,
          orderNumber: order.orderNumber,
          orderStatus: order.status,
          orderTitle: order.title,
          orderDescription: order.description,
          email: order.email,
          technician: order.technician,
          orderId: order.id,
        },
        serviceType: JSON.parse(order.serviceType), //  bc mssql does not support objects
      });
    });

    return arr;
  }

  async findOneOrderById(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id: id },
    });
    if (!order) {
      throw new NotFoundException('order not found');
    }

    return {
      order: {
        createdAt: order.createdAt,
        orderNumber: order.orderNumber,
        orderStatus: order.status,
        orderTitle: order.title,
        orderDescription: order.description,
        // address: JSON.parse(savedOrder.address),
        email: order.email,
        technician: order.technician,
        orderId: order.id,
      },
      serviceType: parseMaybeJson(order.serviceType),
    };
  }

  async updateOrder(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderRepository.findOne({
      where: { id: id },
    });
    if (!order) {
      throw new NotFoundException();
    }

    if (updateOrderDto.description !== undefined) {
      order.description = updateOrderDto.description;
    }
    if (updateOrderDto.serviceType !== undefined) {
      order.serviceType =
        typeof updateOrderDto.serviceType !== 'string'
          ? JSON.stringify(updateOrderDto.serviceType)
          : updateOrderDto.serviceType;
    }
    if (updateOrderDto.email) {
      order.email = updateOrderDto.email;
    }

    await this.orderRepository.save(order);

    return {
      order: {
        createdAt: order.createdAt,
        orderNumber: order.orderNumber,
        orderStatus: order.status,
        orderTitle: order.title,
        orderDescription: order.description,
        // address: JSON.parse(savedOrder.address),
        email: order.email,
        technician: order.technician,
        orderId: order.id,
      },
      serviceType: updateOrderDto.serviceType,
    };
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
