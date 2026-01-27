import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ValidationPipe,
  ParseUUIDPipe,
  Query,
  HttpCode,
  UseGuards,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  AdminGuard,
  ApiCommonErrorResponses,
} from 'src/custom-decorators/custom-decorators.decorator';
import { PartnerService } from './partners.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { Partners } from './entities/partners.entity';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { UpdatePartnerStatusDto } from './dto/update-partnerStatus.dto';

@Controller('partners')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiTags('partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnerService) {}

  @Post()
  @ApiOperation({
    summary: 'creates partner',
    description:
      'creates partner. partnerName and email by default, customFields is optional',
  })
  @ApiResponse({
    status: 201,
    type: CreatePartnerDto,
  })
  @ApiResponse({
    status: 400,
    description: 'if something wrong, eg body, etc',
  })
  @ApiResponse({
    status: 404,
    description: 'if the order not found',
  })
  @ApiBody({ type: CreatePartnerDto })
  async create(
    @Req() req,
    @Body(ValidationPipe) createPartnerDto: CreatePartnerDto,
  ): Promise<Partners> {
    return await this.partnersService.createPartner(createPartnerDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'get partner by partnerId',
    description: 'get partner by partnerId',
  })
  @ApiResponse({
    status: 200,
    type: CreatePartnerDto,
  })
  @ApiResponse({
    status: 404,
    description: 'if the partner not found',
  })
  async findOne(
    @Req()
    req,
    @Param('id', ParseUUIDPipe)
    id: string,
  ): Promise<Partners> {
    return await this.partnersService.findPartnerById(id);
  }

  @Get()
  @ApiOperation({
    summary: 'get partner by partnerId',
    description: 'get partner by partnerId',
  })
  @ApiResponse({
    status: 200,
    type: CreatePartnerDto,
  })
  @ApiResponse({
    status: 404,
    description: 'if the partner not found',
  })
  async getAllPartners(
    @Req()
    req,
  ): Promise<Partners[]> {
    return await this.partnersService.findAllPartners();
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'update partner by partnerId',
    description: 'update partner by partnerId',
  })
  @ApiResponse({
    status: 200,
    type: UpdatePartnerDto,
  })
  @ApiResponse({
    status: 404,
    description: 'if the partner not found',
  })
  async updatePartnerById(
    @Param('id', ParseUUIDPipe) id: string,
    @Req()
    req,
    @Body(ValidationPipe)
    updatePartnerDto: UpdatePartnerDto,
  ): Promise<any> {
    return await this.partnersService.updatePartnerById(id, updatePartnerDto);
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'update partner by partnerId',
    description: 'update partner by partnerId',
  })
  @ApiResponse({
    status: 200,
    type: UpdatePartnerDto,
  })
  @ApiResponse({
    status: 404,
    description: 'if the partner not found',
  })
  async updatePartnerStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Req()
    req,
    @Body(ValidationPipe)
    updatePartnerStatusDto: UpdatePartnerStatusDto,
  ): Promise<any> {
    return await this.partnersService.updatePartnerStatus(
      id,
      updatePartnerStatusDto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'delete partner',
    description: 'delete partner by partnerId. only admin can delete partners',
  })
  @ApiResponse({
    status: 200,
    description: 'returns only success message',
  })
  @ApiCommonErrorResponses()
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req()
    req,
  ): Promise<any> {
    return await this.partnersService.deletePartner(id);
  }
}
