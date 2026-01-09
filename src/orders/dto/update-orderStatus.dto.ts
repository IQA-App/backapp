import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Trim } from 'src/custom-decorators/custom-decorators.decorator';
import { OrderStatus } from '../order-status.enum';

export class UpdateOrderStatusDto {
  @ApiProperty({ example: 'ORD-20260108-00GP' })
  @IsNotEmpty()
  @Trim()
  orderNumber: string;

  @ApiProperty({ example: 'pending | in-progress | completed' })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(OrderStatus, {
    message: 'orderStatus must be one of the: ' + Object.values(OrderStatus),
    each: true,
  })
  @Trim()
  orderStatus?: OrderStatus;
}
