import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { BuildingType } from '../building-type.enum';
import { Trim } from 'src/custom-decorators/custom-decorators.decorator';

export class CreateAddressDto {
  @ApiProperty({ example: 'buildingType' })
  @IsNotEmpty()
  @IsEnum(BuildingType, {
    message: 'buildingType must be one of the',
    each: true,
  })
  buildingType: BuildingType;

  @ApiProperty({ example: '1500' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @Matches(/^(?!.*[^\P{Alphabetic}a-zA-Z])/u, {
    message: 'Only Latin letters are allowed in the houseNumber',
  })
  @Trim()
  houseNumber: string;

  @ApiProperty({ example: 'Apt 100' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(1)
  @MaxLength(10)
  @Matches(/^(?!.*[^\P{Alphabetic}a-zA-Z])/u, {
    message: 'Only Latin letters are allowed in the apartmentNumber',
  })
  @Trim()
  apartmentNumber: string;

  @ApiProperty({ example: 'Lenin St' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @Matches(/^(?!.*[^\P{Alphabetic}a-zA-Z])/u, {
    message: 'Only Latin letters are allowed in the street',
  })
  @Trim()
  street: string;

  @ApiProperty({ example: 'Leninsk' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @Matches(/^(?!.*[^\P{Alphabetic}a-zA-Z])/u, {
    message: 'Only Latin letters are allowed in the city',
  })
  @Trim()
  city: string;

  @ApiProperty({ example: '21034' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  @Matches(/^(?!.*[^\P{Alphabetic}a-zA-Z])/u, {
    message: 'Only Latin letters are allowed in the zipCode',
  })
  @Trim()
  zipCode: string;

  @ApiProperty({ example: 'Warshington' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @Trim()
  state: string;
}
