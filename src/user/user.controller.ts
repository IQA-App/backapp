import { Controller, Post, Get, Put, Delete, HttpCode } from '@nestjs/common';
// import {CreateUserDto} from 

@Controller('user')
export class UserController {
  constructor() {}

  @Get()
  findAll() {
    return 'Hello all users!';
  }

  @Get(':id')
  findOneById() {
    return 'Hello single user!';
  }

  @Post()
  @HttpCode(201)
  create() {
    return 'User created!';
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
