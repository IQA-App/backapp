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

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    // private readonly jwtService: JwtService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, userId: string) {
    const existOrder = await this.orderRepository.findOne({
      where: {
        title: createOrderDto.title,
        user: { id: userId }, // bcz entity order.entity  user: User;
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
      user: { id: userId },
    });

    return await this.orderRepository.save(order);
  }

  async findAllOrders(userRole: string, userId: string) {
    if (userRole === 'admin') {
      const orders = await this.orderRepository.find();
      return orders;
    } else {
      const orders = await this.orderRepository.find({
        where: {
          user: { id: userId }, // bcz entity order.entity  user: User;
        },
      });
      return orders;
    }
  }

  async findOneOrderById(orderId: string, userId: string, userRole: string) {
    const order = await this.orderRepository.findOne({
      where:
        userRole === 'admin'
          ? { id: orderId } //  admin can see all orders
          : { id: orderId, user: { id: userId } }, //  customer can see only own orders
    });
    if (!order) {
      throw new NotFoundException();
    }

    return order;
  }

  async updateOrder(
    lookUpId: string,
    userId: string,
    userRole: string,
    updateOrderDto: UpdateOrderDto,
  ) {
    const order = await this.orderRepository.findOne({
      where:
        userRole === 'admin'
          ? { id: lookUpId }
          : { id: lookUpId, user: { id: userId } },
    });
    if (!order) {
      throw new NotFoundException();
    }

    if (updateOrderDto.description !== undefined) {
      order.description = updateOrderDto.description;
    }

    return await this.orderRepository.save(order);
  }

  async deleteOrder(lookUpId: string, userId: string, userRole: string) {
    const order = await this.orderRepository.findOne({
      where:
        userRole === 'admin'
          ? { id: lookUpId }
          : { id: lookUpId, user: { id: userId } },
    });
    if (!order) {
      throw new NotFoundException();
    }

    await this.orderRepository.delete(lookUpId);
    return { message: 'the user was succesfully deleted' };
  }
}
