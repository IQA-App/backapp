import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateAddressDto } from './create-address.dto';
import { Trim, TrimJsonString } from 'src/custom-decorators/custom-decorators.decorator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @ApiProperty({ example: 'Elon Musk or All Stars LLC' })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  @Matches(/^[\p{L}\p{N}\s.,'-]+$/u, {
    message: 'customerName can only contain letters, numbers, spaces, and  . , \' -',
  })
  @Trim()
  customerName: string;

  @ApiProperty({ example: 'test@test.com', required: false })
  @IsOptional()
  @IsString()
  @IsEmail()
  @Trim()
  email?: string;

  @ApiProperty({ example: 'customFields can be literally anything', required: false })
  @IsOptional()
  @TrimJsonString()
  customFields?: any;

  @ApiProperty({
    example:
      'address is optional, eg: address: { buildingType: apartment, houseNumber:13, street:Lenin st, city:Leninsk, zipCode:RA23322, state: IL}',
  })
  @IsOptional()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address?: CreateAddressDto;
}
