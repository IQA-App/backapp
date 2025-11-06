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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import {CreateUserDto} from

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAllUsers() {
    return this.userService.findAllUsers();
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

  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @Body(ValidationPipe)
    updateUserDto: UpdateUserDto,
  ) {
    const requestId = req.params.id;
    const body = req.body;

    if (isNaN(requestId)) {
      throw new BadRequestException('id must be a number');
    }
    if (!body) {
      throw new BadRequestException('body can not be empty');
    }
    if (!body.email || !body.email.length) {
      throw new BadRequestException('email can not be empty');
    }
    if (!body.password || !body.password.length) {
      throw new BadRequestException('password can not be empty');
    }

    return this.userService.updateUser(+id, updateUserDto);
  }

  @Delete()
  deleteUser() {
    return 'User was deleted !';
  }
}
