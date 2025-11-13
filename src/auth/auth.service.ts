import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { IUser } from 'src/types/types';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.userService.findUserByUserName(email);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // const accessToken = this.jwtService.signAsync({ id: user.id });

    return user;

    // const payload = { sub: user.userId, username: user.username };
    // return {
    //   access_token: await this.jwtService.signAsync(payload),
    // };
  }

  async login(user: IUser) {
    const dateMap = Date.now();
    const { id, email } = user;
    return {
      id,
      email,
      access_token: this.jwtService.sign({
        id: user.id,
        email: user.email,
        role: user.role,
        userMapId: dateMap,
      }),
    };
  }
}
