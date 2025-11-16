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
  async create(@Req() req, @Body() createOrderDto: CreateOrderDto) {
    const userId = await req.user.id; // getting userId from token
    const userRole = await req.user.role; //  we will use this in future features

    return await this.ordersService.createOrder(createOrderDto, userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() req) {
    const userId = await req.user.id;
    const userRole = await req.user.role;

    return await this.ordersService.findAllorders(userRole, userId);
  }

  @Get(':lookUpId')
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Req()
    req,
    @Param('lookUpId', ParseIntPipe)
    lookUpId: string,
  ) {
    const userId = await req.user.id;
    const userRole = await req.user.role;

    return this.ordersService.findOneOrderById(lookUpId, userId, userRole);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
