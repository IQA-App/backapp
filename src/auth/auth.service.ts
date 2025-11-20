import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { IUser } from 'src/types/types';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Repository } from 'typeorm';
import { EmailSendingService } from 'src/email-service/email-sending.service';
import { Codes } from './entities/confirmation-code.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CodeStatus } from './code-status.enum';

function generateConfirmCode(): number {
  return Math.floor(100000 + Math.random() * 900000);
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Codes)
    private readonly codeRepository: Repository<Codes>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private userService: UserService,
    private jwtService: JwtService,
    private emailSendingService: EmailSendingService,
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

    return user;
  }

  async login(user: IUser) {
    const dateMap = new Date('1983-01-01');
    const { id, email, role } = user;
    return {
      id: String(id),
      email,
      role,
      access_token: this.jwtService.sign({
        id: user.id,
        email: user.email,
        role: user.role,
        userMapId: dateMap,
      }),
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const code = generateConfirmCode().toString();

    const user = await this.userService.findUserByUserName(
      forgotPasswordDto.email,
    );

    if (!user) {
      throw new NotFoundException('Invalid email');
    }

    const codes = await this.codeRepository.find({
      where: {
        email: forgotPasswordDto.email,
        user: { id: user.id },
      },
    });

    // deletes all confirmation codes for this user
    await this.codeRepository.delete({ user: { id: user.id } });

    // save a brand new confirmation code, so only one code in db at this moment
    // with status pending
    await this.codeRepository.save({
      email: forgotPasswordDto.email,
      code: code.toString(),
      user: { id: user.id },
    });

    const resetPassword = await this.emailSendingService.sendResetPassword(
      forgotPasswordDto.email,
      code,
    );

    return { resetPassword };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const code = await this.codeRepository.findOne({
      where: {
        code: resetPasswordDto.confirmationCode,
      },
    });

    const user = await this.userRepository.findOne({
      where: { email: resetPasswordDto.email },
    });

    if (!user) {
      throw new NotFoundException('This user was not found');
    }
    if (!code) {
      throw new NotFoundException('Invalid code');
    }
    if (resetPasswordDto.newPassword !== resetPasswordDto.confirmPassword) {
      throw new BadRequestException('Passwords must be the same');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(
      resetPasswordDto.confirmPassword,
      salt,
    );

    user.password = hashedPassword;
    await this.userRepository.save(user);

    code.status = CodeStatus.Used; //  once password was  updated make codeStatus=used also need delet used code

    // fix later
    // const expiresAt = new Date();
    // expiresAt.setMinutes(expiresAt.getMinutes() + 10);
    // code.expiresAt = expiresAt;

    await this.codeRepository.save(code);

    // deletes confirmation code after changing password since it already used
    await this.codeRepository.delete({
      email: resetPasswordDto.email,
      user: { id: user.id },
    });

    return {
      message: 'Password has been reset successfully',
    };
  }

  async getAllCodes(userId: string, userRole: string) {
    //  not sure if we need this feature
    if (userRole !== 'admin') {
      throw new ForbiddenException();
    }

    const codes = await this.codeRepository.find();

    return codes;
  }
}
