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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAllUsers(
    @Req()
    req,
  ) {
    const userId = await req.user.id;
    const userRole = await req.user.role;

    return this.userService.findAllUsers(userRole);
  }

  @Get(':lookUpId')
  @UseGuards(JwtAuthGuard)
  async findOneById(
    @Param('lookUpId', ParseUUIDPipe) lookUpId: string,
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

  @Patch(':lookUpId')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Param('lookUpId', ParseUUIDPipe) lookUpId: string,
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

  @Delete(':lookUpId')
  @UseGuards(JwtAuthGuard)
  async deleteUser(
    @Param('lookUpId', ParseUUIDPipe) lookUpId: string,
    @Req() req,
  ) {
    const userId = await req.user.id.toString(); //  we have to change this covertion to string in future tickets with uuid

    return await this.userService.deleteUser(lookUpId, userId);
  }
}
