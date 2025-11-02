import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  //   private userRepository: Repository

  async findAllUsers() {
    // const users = await
  }

  async findOneById() {}

  async createUser() {}

  async updateUser() {}

  async deleteUser() {}
}
