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
import { PartnerStatus } from '../partner-status.enum';
import { AuthSecretStatus } from '../authCode-status.enum';

export class UpdatePartnerDto {
  @ApiProperty({ example: 'All Stars llc' })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  @Matches(/^(?!.*[^\P{Alphabetic}a-zA-Z])/u, {
    message: 'Only Latin letters are allowed in the houseNumber',
  })
  @Trim()
  partnerName?: string;

  @ApiProperty({ example: 'allstars@email.com' })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(50)
  @Matches(/^(?!.*[^\P{Alphabetic}a-zA-Z])/u, {
    message: 'Only Latin letters are allowed in the houseNumber',
  })
  @Trim()
  email?: string;

  @ApiProperty({ example: 'active' })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(PartnerStatus)
  @IsString()
  @Trim()
  patnerStatus?: string;

  @ApiProperty({ example: 'active' })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(AuthSecretStatus)
  @IsString()
  @Trim()
  authSecretStatus?: string;

  @ApiProperty({ example: 'can be anything' })
  @IsOptional()
  @Trim()
  customFields?: any;
}
