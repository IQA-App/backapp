import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
  BadRequestException,
  ValidationPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Req() req,
    @Body(ValidationPipe) createOrderDto: CreateOrderDto,
  ) {
    const userId = await req.user.id; // getting userId from token
    const userRole = await req.user.role; //  we will use this in future features

    return await this.ordersService.createOrder(createOrderDto, userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() req) {
    const userId = await req.user.id;
    const userRole = await req.user.role;

    return await this.ordersService.findAllOrders(userRole, userId);
  }

  @Get(':orderId')
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Req()
    req,
    @Param('orderId', ParseUUIDPipe)
    orderId: string,
  ) {
    const userId = await req.user.id;
    const userRole = await req.user.role;

    return this.ordersService.findOneOrderById(orderId, userId, userRole);
  }

  @Patch(':lookUpId')
  @UseGuards(JwtAuthGuard)
  async aupdate(
    @Param('lookUpId', ParseUUIDPipe) lookUpId: string,
    @Req()
    req,
    @Body(ValidationPipe)
    updateOrderDto: UpdateOrderDto,
  ) {
    const userId = await req.user.id;
    const userRole = await req.user.role;

    return await this.ordersService.updateOrder(
      lookUpId,
      userId,
      userRole,
      updateOrderDto,
    );
  }

  @Delete(':lookUpId')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('lookUpId', ParseUUIDPipe) lookUpId: string,
    @Req()
    req,
  ) {
    const userId = await req.user.id;
    const userRole = await req.user.role;

    return this.ordersService.deleteOrder(lookUpId, userId, userRole);
  }
}
