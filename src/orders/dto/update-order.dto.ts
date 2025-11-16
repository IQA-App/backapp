import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(1000)
  @Matches(/^(?!.*[^\P{Alphabetic}a-zA-Z])/u, {
    message: 'Only Latin letters are allowed in the order description',
  })
  description: string;
}
