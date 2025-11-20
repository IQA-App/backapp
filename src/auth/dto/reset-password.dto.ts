import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
  maxLength,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Matches(/^(?!.*[^\P{Alphabetic}a-zA-Z])/u, {
    message: 'Only Latin letters are allowed in the email',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6)
  @Matches(/^(?!.*[^\P{Alphabetic}a-zA-Z])/u, {
    message: 'Only Latin letters are allowed in the email',
  })
  confirmationCode: string;

  @IsNotEmpty()
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
  newPassword: string;

  @IsNotEmpty()
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
  confirmPassword: string;
}
