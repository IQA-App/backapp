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
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Order } from './entities/order.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { BuildingType } from './building-type.enum';

@Controller('orders')
@ApiTags('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiResponse({
    status: 201,
    schema: {
      example: {
        title: 'Fix air conditioner',
        description: 'The AC in my ranch home needs repair',
        email: 'email@email.com',
        orderNumber: 'ORD-202512051521-61206',
        id: '1E0FDF66-20D2-F011-8193-7CED8DD0B18E',
        createdAt: '2025-12-06T03:21:46.516Z',
        status: 'pending',
        technician: 'pending',
      },
    },
  })
  async create(
    @Req() req,
    @Body(new ValidationPipe()) createOrderDto: CreateOrderDto,
    createAddressDto: CreateAddressDto,
  ) {
    const buildingType = req.body.address.buildingType;

    if (!Object.values(BuildingType).includes(buildingType)) {
      throw new BadRequestException(
        `buildingType must be one of the:` + Object.values(BuildingType),
      );
    }

    return await this.ordersService.createOrder(
      createOrderDto,
      createAddressDto,
    );
  }

  @Get()
  @ApiResponse({
    status: 200,
    schema: {
      example: [
        {
          id: '558ABFAE-38C7-F011-8195-000D3AC3A78B',
          title: 'test order',
          createdAt: '2025-11-22T00:17:52.236Z',
          description: 'fix toilet test',
        },
        {
          id: '2893CD00-39C7-F011-8195-000D3AC3A78B',
          title: 'admin order',
          createdAt: '2025-11-22T00:20:09.890Z',
          description: 'fix toilet admin',
        },
      ],
    },
  })
  async findAll(@Req() req) {
    return await this.ordersService.findAllOrders();
  }

  @Get('by-email')
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        id: '04036D43-F7CF-F011-8195-000D3AC5B414',
        title: 'test2 order',
        createdAt: '2025-12-03T03:22:15.356Z',
        description: 'fix toilet test1',
      },
    },
  })
  async findOrderByEmail(
    @Query('email')
    email: string,
  ): Promise<Order[]> {
    return this.ordersService.findOrdersByEmail(email);
  }

  @Get('by-ordernumber')
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        id: '04036D43-F7CF-F011-8195-000D3AC5B414',
        title: 'test2 order',
        createdAt: '2025-12-03T03:22:15.356Z',
        description: 'fix toilet test1',
      },
    },
  })
  async findOrderByOrderNumber(
    @Query('orderNumber')
    orderNumber: string,
  ): Promise<Order[]> {
    return this.ordersService.findOrderByOrderNumber(orderNumber);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        id: '04036D43-F7CF-F011-8195-000D3AC5B414',
        title: 'test2 order',
        createdAt: '2025-12-03T03:22:15.356Z',
        description: 'fix toilet test1',
      },
    },
  })
  async findOne(
    @Req()
    req,
    @Param('id', ParseUUIDPipe)
    id: string,
  ) {
    return this.ordersService.findOneOrderById(id);
  }

  @Patch(':id')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        description: { type: 'string' },
      },
      required: ['description'],
    },
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        id: '04036D43-F7CF-F011-8195-000D3AC5B414',
        title: 'test2 order',
        createdAt: '2025-12-03T03:22:15.356Z',
        description: 'fix toilet test1',
      },
    },
  })
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
