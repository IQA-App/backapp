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
  async create(
    @Req() req,
    @Body(ValidationPipe) createOrderDto: CreateOrderDto,
  ) {
    return await this.ordersService.createOrder(createOrderDto);
  }

  @Get()
  async findAll(@Req() req) {
    return await this.ordersService.findAllOrders();
  }

  @Get(':id')
  async findOne(
    @Req()
    req,
    @Param('id', ParseUUIDPipe)
    id: string,
  ) {
    return this.ordersService.findOneOrderById(id);
  }

  @Patch(':id')
  async aupdate(
    @Param('id', ParseUUIDPipe) id: string,
    @Req()
    req,
    @Body(ValidationPipe)
    updateOrderDto: UpdateOrderDto,
  ) {
    return await this.ordersService.updateOrder(id, updateOrderDto);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req()
    req,
  ) {
    return this.ordersService.deleteOrder(id);
  }
}
