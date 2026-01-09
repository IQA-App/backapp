import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Trim } from 'src/custom-decorators/custom-decorators.decorator';
import { UpdateAddressDto } from './update-address.dto';
import { Type } from 'class-transformer';
import { OrderStatus } from '../order-status.enum';

export class UpdateOrderDto {
  @ApiProperty({ example: 'Elon Musk or All Stars LLC' })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  @Matches(/^(?!.*[^\P{Alphabetic}a-zA-Z])/u, {
    message: 'Only Latin letters are allowed in the customerName',
  })
  @Trim()
  customerName?: string;

  //  email is changebale by customer support only. we need email unchangebale by user
  //  bc we use email as identity to update/delete orders
  // @ApiProperty({ example: 'test@test.com' })
  // @IsOptional()
  // @IsString()
  // @IsEmail()
  // @Matches(/^(?!.*[^\P{Alphabetic}a-zA-Z])/u, {
  //   message: 'Only Latin letters are allowed in the email',
  // })
  // @Trim()
  // email?: string;

  @ValidateIf((o) => o.customerEmail !== undefined)
  @IsDefined({
    message:
      'users can not change the email, ask customer service to change the email',
  })
  email: string;

  // @ApiProperty({ example: 'pending, in-progress, completed' })
  // @IsOptional()
  // @IsNotEmpty()
  // @IsEnum(OrderStatus, {
  //   message: 'orderStatus must be one of the: ' + Object.values(OrderStatus),
  //   each: true,
  // })
  // orderStatus?: OrderStatus;

  @ApiProperty({ example: '13 Lenin st, Leninsk, RA23322' })
  @IsNotEmpty()
  @IsEmail()
  @Matches(/^(?!.*[^\P{Alphabetic}a-zA-Z])/u, {
    message: 'Only Latin letters are allowed in the email',
  })
  authEmail: string;

  @IsOptional()
  customFields?: any;

  @ApiProperty({ example: '13 Lenin st, Leninsk, RA23322' })
  @IsOptional()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => UpdateAddressDto)
  address?: UpdateAddressDto;
}
