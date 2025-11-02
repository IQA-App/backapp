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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
// import {CreateUserDto} from

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAllUsers() {
    return [];
  }

  @Get(':id')
  findOneById(@Param('id', ParseIntPipe) id: number) {
    const user = this.userService.findOneById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  @Post()
  createUser(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Put(':id')
  updateUser() {
    return 'User updated!';
  }

  @Delete()
  deleteUser() {
    return 'User was deleted !';
  }
}
