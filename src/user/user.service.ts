import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async findAllUsers(userRole: string) {
    if (userRole !== 'admin') {
      throw new ForbiddenException();
    }
    const users = await this.userRepository.find({
      select: ['id', 'email', 'role'],
    });
    return users;
  }

  async findOneById(
    lookUpId: string,
    userId: string,
    userRole: string,
  ): Promise<User> {
    if (userRole !== 'admin' && lookUpId !== userId) {
      throw new ForbiddenException();
    }

    const user = await this.userRepository.findOne({
      select: ['id', 'email'],
      where: { id: lookUpId },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${lookUpId} not found`);
    }

    return user;
  }

  async findUserByUserName(email: string): Promise<User | undefined> {
    const requestedEmail = await this.userRepository.findOneBy({
      email: email,
    });
    if (!requestedEmail) {
      throw new NotFoundException('This username not found');
    }

    return requestedEmail;
  }

  async createUser(createUserDto: CreateUserDto) {
    const existUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    if (existUser) throw new BadRequestException('This email already exists!');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    const user = await this.userRepository.save({
      email: createUserDto.email,
      password: hashedPassword,
    });
    const dateMap = new Date('1983-01-01');
    const token = this.jwtService.sign({
      email: createUserDto.email,
      id: user.id,
      role: user.role,
      userMapId: dateMap,
    });

    return { user: { id: user.id, email: user.email }, token };
  }

  async updateUser(
    lookUpId: string,
    userId: string,
    updateUserDto: UpdateUserDto,
  ) {
    if (lookUpId !== userId) {
      throw new ForbiddenException();
    }

    const user = await this.userRepository.findOne({
      select: ['id', 'email'],
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('This user was not found');
    }

    // check if the email exists
    if (updateUserDto.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });

      // check if a new email already taken
      if (existingUser && existingUser.id !== userId) {
        throw new BadRequestException('Email is already in use');
      }

      user.email = updateUserDto.email;
    }

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(updateUserDto.password, salt);

      user.password = hashedPassword;
    }
    await this.userRepository.save(user);

    return {
      message: 'The user succcefully updated',
      userInfo: { id: user.id, email: user.email },
    };
  }

  async deleteUser(lookUpId: string, userId: string) {
    console.log('=== REQ lookup and userId ===', lookUpId, userId);
    console.log(
      '=== REQ lookup and userId2 ===',
      typeof lookUpId,
      typeof userId,
    );
    if (lookUpId !== userId) {
      throw new ForbiddenException();
    }

    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('This user was not found');
    }
    await this.userRepository.delete(userId);
    return { message: 'the user was succesfully deleted' };
  }
}
