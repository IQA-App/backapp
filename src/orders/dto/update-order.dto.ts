import { ApiProperty } from '@nestjs/swagger';
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
import { Trim } from 'src/custom-decorators/custom-decorators.decorator';
import { CreateAddressDto } from './create-address.dto';
import { UpdateAddressDto } from './update-address.dto';
import { Type } from 'class-transformer';

export class UpdateOrderDto {
  @ApiProperty({ example: 'Fix air conditioner' })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @Matches(/^(?!.*[^\P{Alphabetic}a-zA-Z])/u, {
    message: 'Only Latin letters are allowed in the title',
  })
  @Trim()
  title: string;

  @ApiProperty({ example: 'The AC in my ranch home needs repair' })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(1000)
  @Matches(/^(?!.*[^\P{Alphabetic}a-zA-Z])/u, {
    message: 'Only Latin letters are allowed in the order description',
  })
  @Trim()
  description: string;

  @ApiProperty({ example: 'test@test.com' })
  @IsOptional()
  @IsString()
  @IsEmail()
  @Matches(/^(?!.*[^\P{Alphabetic}a-zA-Z])/u, {
    message: 'Only Latin letters are allowed in the email',
  })
  @Trim()
  email: string;

  @IsOptional()
  serviceType: any;

  @ApiProperty({ example: '13 Lenin st, Leninsk, RA23322' })
  @IsOptional()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => UpdateAddressDto)
  address?: UpdateAddressDto;
}
