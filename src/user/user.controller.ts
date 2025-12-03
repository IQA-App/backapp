import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  HttpCode,
  Param,
  ParseIntPipe,
  ValidationPipe,
  Body,
  NotFoundException,
  Patch,
  Req,
  BadRequestException,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiBearerAuth()
  @ApiResponse({ status: 200, schema: { example: null } })
  @UseGuards(JwtAuthGuard)
  async findAllUsers(
    @Req()
    req,
  ) {
    const userId = await req.user.id;
    const userRole = await req.user.role;

    return this.userService.findAllUsers(userRole);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, schema: { example: null } })
  @UseGuards(JwtAuthGuard)
  async findOneById(
    @Param('id', ParseUUIDPipe) lookUpId: string,
    @Req()
    req,
  ) {
    const userId = await req.user.id;
    const userRole = await req.user.role;

    return await this.userService.findOneById(lookUpId, userId, userRole);
  }

  @Post()
  async createUser(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Param('id', ParseUUIDPipe) lookUpId: string,
    @Req() req,
    @Body(ValidationPipe)
    updateUserDto: UpdateUserDto,
  ) {
    const userId = await req.user.id;
    const body = await req.body;

    if (!body) {
      throw new BadRequestException('body can not be empty');
    }
    if (!body.email || !body.email.length) {
      throw new BadRequestException('email can not be empty');
    }
    if (!body.password || !body.password.length) {
      throw new BadRequestException('password can not be empty');
    }

    return this.userService.updateUser(lookUpId, userId, updateUserDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async deleteUser(
    @Param('id', ParseUUIDPipe) lookUpId: string,
    @Req() req,
  ) {
    const userId = await req.user.id.toString(); //  we have to change this covertion to string in future tickets with uuid

    return await this.userService.deleteUser(lookUpId, userId);
  }
}
