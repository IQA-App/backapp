import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateAddressDto } from './create-address.dto';
import {
  Trim,
  TrimJsonString,
} from 'src/custom-decorators/custom-decorators.decorator';

export class CreateOrderDto {
  @ApiProperty({ example: 'Elon Musk or All Stars LLC' })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  @Matches(/^(?!.*[^\P{Alphabetic}a-zA-Z])/u, {
    message: 'Only Latin letters are allowed in the title',
  })
  @Trim()
  customerName: string;

  @ApiProperty({ example: 'test@test.com' })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Matches(/^(?!.*[^\P{Alphabetic}a-zA-Z])/u, {
    message: 'Only Latin letters are allowed in the email',
  })
  @Trim()
  email: string;

  @IsNotEmpty()
  @TrimJsonString()
  customFields: any;

  @ApiProperty({ example: '13 Lenin st, Leninsk, RA23322' })
  @IsNotEmpty()
  address: CreateAddressDto;
}
