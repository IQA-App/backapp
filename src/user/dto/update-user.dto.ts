import { Optional } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { PartialType } from '@nestjs/mapped-types';
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

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: 'test@test.com' })
  @IsOptional()
  @IsString()
  @IsEmail()
  @Matches(/^(?!.*[^\P{Alphabetic}a-zA-Z])/u, {
    message: 'Only Latin letters are allowed in the email',
  })
  email: string;

  @ApiProperty({
    example: 'Password123#',
    description:
      'Password must be at least 8 characters long and no more than 18 characters long! Password must contain at least one digit and  at least one lowercase letter and at least one uppercase letter!',
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(18)
  @Matches(/^(?!.*[^\P{Alphabetic}a-zA-Z])/u, {
    message: 'Only Latin letters are allowed in the password',
  })
  @Matches(/(?=.*[a-z])/, {
    message: 'Password must have at least one lowercase letter',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must have at least one uppercase letter',
  })
  @Matches(/(?=.*\d)/, {
    message: 'Password must have at least one digit',
  })
  @Matches(/((?=.*\W)|(?=.*_))^[^ ]+$/, {
    message:
      'Password must have at least, one special character and no spaces.',
  })
  password: string;
}
