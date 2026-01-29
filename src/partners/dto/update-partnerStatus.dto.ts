import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Trim } from 'src/custom-decorators/custom-decorators.decorator';
import { PartnerStatus } from '../partner-status.enum';

export class UpdatePartnerStatusDto {
  @ApiProperty({ example: 'active' })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(PartnerStatus, {
    message:
      'partner status must be one of the : ' + Object.values(PartnerStatus),
    each: true,
  })
  @IsString()
  @Trim()
  patnerStatus?: PartnerStatus;
}
