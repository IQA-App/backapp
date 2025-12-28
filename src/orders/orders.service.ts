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
import { CreateAddressDto } from './dto/create-address.dto';
import { Order } from './entities/order.entity';
import { generateOrderNumber } from './generate-order-number';
import { parseMaybeJson } from 'src/utils/parse.json';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  // private readonly jwtService: JwtService,
  async createOrder(
    createOrderDto: CreateOrderDto,
    createAddressDto: CreateAddressDto,
  ) {
    // const existOrder = await this.orderRepository.findOne({
    //   where: {
    //     email: createOrderDto.email,
    //     title: createOrderDto.customerName,
    //   },
    // });

    const order = await this.orderRepository.create({
      customerName: createOrderDto.customerName,
      email: createOrderDto.email,
      orderNumber: generateOrderNumber(),
      customFields: createOrderDto.customFields,
      address: {
        buildingType: createOrderDto.address.buildingType,
        houseNumber: createOrderDto.address.houseNumber,
        apartmentNumber: createOrderDto.address.apartmentNumber,
        street: createOrderDto.address.street,
        city: createOrderDto.address.city,
        zipCode: createOrderDto.address.zipCode,
        state: createOrderDto.address.state,
      },
    });

    const savedOrder = await this.orderRepository.save(order);

    return {
      order: {
        createdAt: savedOrder.createdAt,
        orderNumber: savedOrder.orderNumber,
        orderStatus: savedOrder.status,
        customerName: savedOrder.customerName,
        email: savedOrder.email,
        assignedTo: savedOrder.assignedTo,
        orderId: savedOrder.id,
      },
      customFields: parseMaybeJson(order.customFields),
      address: {
        buildingType: savedOrder.address.buildingType,
        houseNumber: savedOrder.address.houseNumber,
        apartmentNumber: savedOrder.address.apartmentNumber,
        street: savedOrder.address.street,
        city: savedOrder.address.city,
        zipCode: savedOrder.address.zipCode,
        state: savedOrder.address.state,
      },
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
          customerName: order.customerName,
          email: order.email,
          assignedTo: order.assignedTo,
          orderId: order.id,
        },
        customFields: parseMaybeJson(order.customFields),
        //  bc mssql does not support objects
        address: {
          buildingType: order.address.buildingType,
          houseNumber: order.address.houseNumber,
          apartmentNumber: order.address.apartmentNumber,
          street: order.address.street,
          city: order.address.city,
          zipCode: order.address.zipCode,
          state: order.address.state,
        },
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
        customerName: order.customerName,
        email: order.email,
        assignedTo: order.assignedTo,
        orderId: order.id,
      },
      customFields: parseMaybeJson(order.customFields),
      address: {
        buildingType: order.address.buildingType,
        houseNumber: order.address.houseNumber,
        apartmentNumber: order.address.apartmentNumber,
        street: order.address.street,
        city: order.address.city,
        zipCode: order.address.zipCode,
        state: order.address.state,
      },
    };
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
      await arr.push({
        order: {
          createdAt: order.createdAt,
          orderNumber: order.orderNumber,
          orderStatus: order.status,
          customerName: order.customerName,
          email: order.email,
          assignedTo: order.assignedTo,
          orderId: order.id,
        },
        customFields: parseMaybeJson(order.customFields), //  bc mssql does not support objects
        address: {
          buildingType: order.address.buildingType,
          houseNumber: order.address.houseNumber,
          apartmentNumber: order.address.apartmentNumber,
          street: order.address.street,
          city: order.address.city,
          zipCode: order.address.zipCode,
          state: order.address.state,
        },
      });
    });

    return arr;
  }

  async findOrderByOrderNumber(orderNumber: string): Promise<Order[]> {
    const order = await this.orderRepository.find({
      where: { orderNumber: orderNumber },
    });
    if (!order) {
      throw new NotFoundException('order not found');
    }

    let arr = [];
    order.forEach(async (order) => {
      await arr.push({
        order: {
          createdAt: order.createdAt,
          orderNumber: order.orderNumber,
          orderStatus: order.status,
          customerName: order.customerName,
          email: order.email,
          assignedTo: order.assignedTo,
          orderId: order.id,
        },
        customFields: parseMaybeJson(order.customFields),
        address: {
          buildingType: order.address.buildingType,
          houseNumber: order.address.houseNumber,
          apartmentNumber: order.address.apartmentNumber,
          street: order.address.street,
          city: order.address.city,
          zipCode: order.address.zipCode,
          state: order.address.state,
        }, //  bc mssql does not support objects
      });
    });

    return arr;
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

  async updateOrder(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderRepository.findOne({
      where: { id: id },
    });
    if (!order) {
      throw new NotFoundException();
    }

    if (updateOrderDto.customFields !== undefined) {
      order.customFields =
        typeof updateOrderDto.customFields !== 'string'
          ? JSON.stringify(updateOrderDto.customFields)
          : updateOrderDto.customFields;
    }
    if (updateOrderDto.email) {
      order.email = updateOrderDto.email;
    }
    if (updateOrderDto.address) {
      console.log('--- Trying to update address ---');
      const addr = order.address;

      console.log('--- Addr ---', addr);

      if (updateOrderDto.address.houseNumber !== undefined) {
        addr.houseNumber = updateOrderDto.address.houseNumber;
      }

      if (updateOrderDto.address.street !== undefined) {
        addr.street = updateOrderDto.address.street;
      }

      if (updateOrderDto.address.city !== undefined) {
        addr.city = updateOrderDto.address.city;
      }

      if (updateOrderDto.address.state !== undefined) {
        addr.state = updateOrderDto.address.state;
      }

      if (updateOrderDto.address.zipCode !== undefined) {
        addr.zipCode = updateOrderDto.address.zipCode;
      }

      if (updateOrderDto.address.apartmentNumber !== undefined) {
        addr.apartmentNumber = updateOrderDto.address.apartmentNumber;
      }
    }

    // if (updateOrderDto.address) {
    //   console.log('-- updateOrderDto --', updateOrderDto);
    //   Object.assign(order.address, updateOrderDto.address);
    // }
    // if (updateOrderDto.address !== undefined) {
    //   console.log('-- updateOrderDto --', updateOrderDto);
    //   Object.assign(order.address, updateOrderDto.address);
    // }

    await this.orderRepository.save(order);

    return {
      order: {
        createdAt: order.createdAt,
        orderNumber: order.orderNumber,
        orderStatus: order.status,
        customerName: order.customerName,
        email: order.email,
        assignedTo: order.assignedTo,
        orderId: order.id,
      },
      customFields: parseMaybeJson(order.customFields),
      address: {
        buildingType: order.address.buildingType,
        houseNumber: order.address.houseNumber,
        apartmentNumber: order.address.apartmentNumber,
        street: order.address.street,
        city: order.address.city,
        zipCode: order.address.zipCode,
        state: order.address.state,
      },
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
