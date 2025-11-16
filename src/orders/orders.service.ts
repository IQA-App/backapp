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

  async findAllorders(userRole: string, userId: string) {
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

  async findOneOrderById(lookUpId: string, userId: string, userRole: string) {
    if (userRole === 'admin') {
      const order = await this.orderRepository.findOne({
        where: { id: lookUpId },
      });
      if (!order) {
        throw new NotFoundException();
      }
      return order;
    } else {
      //  this returns 200 [] for now its ok bc we dont have to tell customer
      //  if specific(not created by this customer) order exists or no
      const order = await this.orderRepository.find({
        where: {
          id: lookUpId,
          user: { id: userId },
        },
      });
      return order;
    }
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
