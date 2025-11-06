import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Matches,
  maxLength,
  MaxLength,
  MinLength,
} from 'class-validator';

import { PartialType } from '@nestjs/mapped-types';
import { Role } from '../role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Matches(/^(?!.*[^\P{Alphabetic}a-zA-Z])/u, {
    message: 'Only Latin latters in email',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(18)
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  @Matches(/^(?!.*[^\P{Alphabetic}a-zA-Z])/u, {
    message: 'Only Latin latters in password',
  })
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])((?=.*\W)|(?=.*_))^[^ ]+$/, {
    message:
      'Password must have at least one uppercase letter, one lowercase letter, one number, one special character, and no spaces.',
  })
  password: string;
}
