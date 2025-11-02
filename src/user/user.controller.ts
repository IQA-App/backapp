import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  HttpCode,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
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
    return this.userService.findOneById();
    // return { id };
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
