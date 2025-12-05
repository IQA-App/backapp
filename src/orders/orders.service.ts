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
      // user: { id: userId },  // figure out in the future tickets
    });

    return await this.orderRepository.save(order);
  }

  async findAllOrders() {
    const orders = await this.orderRepository.find();
    return orders;
  }

  async findOneOrderById(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id: id },
    });
    if (!order) {
      throw new NotFoundException('order not found');
    }

    return order;
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

    return await this.orderRepository.save(order);
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
