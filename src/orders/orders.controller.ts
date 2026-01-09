import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ValidationPipe,
  ParseUUIDPipe,
  Query,
  HttpCode,
  UseGuards,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Order } from './entities/order.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateOrderStatusDto } from './dto/update-orderStatus.dto';
import { UpdateOrderAssigneeDto } from './dto/update-orderAssignee.dto';
import { ApiCommonErrorResponses } from 'src/custom-decorators/custom-decorators.decorator';

@Controller('orders')
@ApiTags('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({
    summary: 'creates order',
    description:
      'creates order. only email is unique value. customFields and address are optional. if address > use CreateOrderDto as a reference',
  })
  @ApiResponse({
    status: 201,
    type: CreateOrderDto,
  })
  @ApiResponse({
    status: 400,
    description: 'if something wrong, eg body, etc',
  })
  @ApiResponse({
    status: 404,
    description: 'if the order not found',
  })
  @ApiBody({ type: CreateOrderDto })
  async create(
    @Req() req,
    @Body(ValidationPipe) createOrderDto: CreateOrderDto,
    createAddressDto: CreateAddressDto,
  ) {
    return await this.ordersService.createOrder(
      createOrderDto,
      createAddressDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'get all orders',
    description: 'get all orders, returns [ ] of orders',
  })
  @ApiResponse({
    status: 200,
    type: [CreateOrderDto],
    description: 'returns [ ] of orders',
  })
  @ApiResponse({
    status: 404,
    description: 'if the order not found',
  })
  async findAll(@Req() req) {
    return await this.ordersService.findAllOrders();
  }

  @Get('by-email')
  @ApiOperation({
    summary: 'get orders by email',
    description:
      'get orders by email, returns [ ] of orders associated to specific email',
  })
  @ApiResponse({
    status: 200,
    type: [CreateOrderDto],
  })
  @ApiResponse({
    status: 404,
    description: 'if the order not found',
  })
  async findOrderByEmail(
    @Query('email')
    email: string,
  ): Promise<Order[]> {
    return this.ordersService.findOrdersByEmail(email);
  }

  @Get('by-ordernumber')
  @ApiOperation({
    summary: 'get order by ordernumber',
    description: 'get order by ordernumber',
  })
  @ApiResponse({
    status: 200,
    type: CreateOrderDto,
  })
  @ApiResponse({
    status: 404,
    description: 'if the order not found',
  })
  async findOrderByOrderNumber(
    @Query('orderNumber')
    orderNumber: string,
  ): Promise<any> {
    return this.ordersService.findOrderByOrderNumber(orderNumber);
  }

  //  later, requires a lot of efforts
  // @Get('search-by-adress')
  // @ApiResponse({
  //   status: 201,
  //   schema: {
  //     example: {
  //       title: 'Fix air conditioner',
  //       description: 'The AC in my ranch home needs repair',
  //       email: 'email@email.com',
  //       orderNumber: 'ORD-202512051521-61206',
  //       id: '1E0FDF66-20D2-F011-8193-7CED8DD0B18E',
  //       createdAt: '2025-12-06T03:21:46.516Z',
  //       status: 'pending',
  //       technician: 'pending',
  //     },
  //   },
  // })
  // async findByAddress(
  //   @Query('houseNumber') houseNumber: string,
  //   @Query('street') street: string,
  //   @Query('city') city: string,
  //   @Query('zipCode') zipCode: string,
  //   @Query('state') state: string,
  //   @Query('apartmentNumber') apartmentNumber?: string,
  // ) {
  //   // if (!Object.values(BuildingType).includes(buildingType)) {
  //   //   throw new BadRequestException(
  //   //     `buildingType must be one of the:` + Object.values(BuildingType),
  //   //   );
  //   // }

  //   return await this.ordersService.findOrderByAddress(
  //     houseNumber,
  //     apartmentNumber,
  //     street,
  //     city,
  //     zipCode,
  //     state,
  //   );
  // }

  @Get(':id')
  @ApiOperation({
    summary: 'get order by orderId',
    description: 'get order by orderId',
  })
  @ApiResponse({
    status: 200,
    type: CreateOrderDto,
  })
  @ApiResponse({
    status: 404,
    description: 'if the order not found',
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
  @ApiOperation({
    summary: 'update order',
    description:
      'update order by orderId. only authorized users can update orders',
  })
  @ApiBody({
    type: CreateOrderDto,
    description:
      'only email is required param to authorize action, other fields are optional',
  })
  @ApiResponse({
    status: 200,
    type: CreateOrderDto,
  })
  @ApiCommonErrorResponses()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Req()
    req,
    @Body(ValidationPipe)
    updateOrderDto: UpdateOrderDto,
  ) {
    //  right now authorization by email
    const authEmail = await req.body.authEmail;

    return await this.ordersService.updateOrder(id, authEmail, updateOrderDto);
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'update order status',
    description:
      'update order status only by orderId. only admin can update orders',
  })
  @ApiBody({
    type: UpdateOrderStatusDto,
    description: 'requires orderNumber and orderStatus',
  })
  @ApiResponse({
    status: 200,
    type: Order,
  })
  @ApiCommonErrorResponses()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updateOrderStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Req()
    req,
    @Body(ValidationPipe) updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    const userRole = await req.user.role;
    const orderNumber = await req.body.orderNumber;
    const body = await req.body;
    const requestBodyKeys = await Object.keys(req.body);

    if (!body || body === undefined || Object.keys(body).length === 0) {
      throw new BadRequestException('body can not be empty');
    }
    if (
      requestBodyKeys &&
      JSON.stringify(requestBodyKeys) !==
        JSON.stringify(['orderNumber', 'orderStatus'])
    ) {
      throw new BadRequestException('use only allowed body parameters');
    }

    if (userRole !== 'admin') {
      throw new ForbiddenException();
    }

    return await this.ordersService.updateOrderStatus(
      id,
      orderNumber,
      updateOrderStatusDto,
    );
  }

  @Patch(':id/assign')
  @ApiOperation({
    summary: 'update order assignee',
    description:
      'update order assignee only by orderId. only admin can update orders',
  })
  @ApiBody({
    type: UpdateOrderAssigneeDto,
    description: 'requires orderNumber and assignedTo',
  })
  @ApiResponse({
    status: 200,
    type: Order,
  })
  @ApiCommonErrorResponses()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updateOrderAssignee(
    @Param('id', ParseUUIDPipe) id: string,
    @Req()
    req,
    @Body(ValidationPipe) updateOrderAssigneeDto: UpdateOrderAssigneeDto,
  ) {
    const userRole = await req.user.role;
    const orderNumber = await req.body.orderNumber;
    const body = await req.body;
    const requestBodyKeys = await Object.keys(req.body);

    if (!body || body === undefined || Object.keys(body).length === 0) {
      throw new BadRequestException('body can not be empty');
    }
    if (
      requestBodyKeys &&
      JSON.stringify(requestBodyKeys) !==
        JSON.stringify(['orderNumber', 'assignedTo'])
    ) {
      throw new BadRequestException('use only allowed body parameters');
    }

    if (userRole !== 'admin') {
      throw new ForbiddenException();
    }

    return await this.ordersService.updateOrderAssignee(
      id,
      orderNumber,
      updateOrderAssigneeDto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'delete order',
    description:
      'delete order by orderId. only authorized users can delete orders',
  })
  @ApiResponse({
    status: 200,
    description: 'returns only success message',
  })
  @ApiCommonErrorResponses()
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req()
    req,
  ) {
    return this.ordersService.deleteOrder(id);
  }
}
