import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Trim } from 'src/custom-decorators/custom-decorators.decorator';

export class UpdateOrderAssigneeDto {
  @ApiProperty({ example: 'ORD-20260108-00GP' })
  @IsNotEmpty()
  @IsString()
  @Trim()
  orderNumber: string;

  @ApiProperty({
    example: 'John Doe | Area57 Department | Dharma Initiative LLC',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @Trim()
  assignedTo?: string;
}
