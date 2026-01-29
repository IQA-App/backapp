import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import {
  Trim,
  TrimJsonString,
} from 'src/custom-decorators/custom-decorators.decorator';
import { Type } from 'class-transformer';
import { Optional } from '@nestjs/common';

export class CreatePartnerDto {
  @ApiProperty({ example: 'All Stars llc' })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  @Matches(/^(?!.*[^\P{Alphabetic}a-zA-Z])/u, {
    message: 'Only Latin letters are allowed in the PartnerName',
  })
  @Trim()
  partnerName: string;

  @ApiProperty({ example: 'allstars@email.com' })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(50)
  @Matches(/^(?!.*[^\P{Alphabetic}a-zA-Z])/u, {
    message: 'Only Latin letters are allowed in the email',
  })
  @Trim()
  email: string;

  @ApiProperty({ example: 'customFields can be literally anything' })
  // @Optional()
  @IsNotEmpty()
  @TrimJsonString()
  customFields?: any;
}
