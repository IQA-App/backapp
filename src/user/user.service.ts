import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  //   private userRepository: Repository
  private users = [];
  async findAllUsers() {
    // const users = await
  }

  async findOneById(id: number) {
    const user = await this.users.find((u) => u.id === id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    const user = {
      id: Date.now(),
      ...createUserDto,
    };
    this.users.push(user);
    return user;
  }

  async updateUser() {
    //  add logic here
  }

  async deleteUser() {
    //  add logic here
  }
}
