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
  findAllUsers() {
    return this.userService.findAllUsers();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOneById(@Param('id', ParseIntPipe) id: string) {
    const user = await this.userService.findOneById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  @Post()
  async createUser(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Param('id', ParseIntPipe) id: string,
    @Req() req,
    @Body(ValidationPipe)
    updateUserDto: UpdateUserDto,
  ) {
    const requestId = await req.params.id;
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

    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Param('id') id: string) {
    const user = await this.userService.findOneById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return this.userService.deleteUser(id);
  }
}
