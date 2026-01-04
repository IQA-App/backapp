import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Request,
  UseGuards,
  Get,
  ValidationPipe,
  Patch,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'login',
    description:
      'login. returns jwt token to access specific resources, update/delete user, orders',
  })
  @ApiResponse({
    status: 201,
    description: 'returns jwt token',
  })
  @ApiResponse({
    status: 400,
    description: 'if something wrong, eg body, etc',
  })
  @ApiResponse({
    status: 404,
    description: 'if the user not found',
  })
  @ApiResponse({
    status: 401,
    description: 'if invalid credentials',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
      required: ['email', 'pasword'],
    },
  })
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    // add logic here like in POST user to check payload

    return this.authService.login(req.user);
  }

  @Get('profile')
  @ApiOperation({
    summary: 'get profile',
    description: 'this endpoint is not ready yet',
  })
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('forgot-password')
  @ApiOperation({
    summary: 'forgot-password',
    description: 'sends confirmation code to reset password to users email',
  })
  @ApiResponse({
    status: 201,
    description: 'sends confirmation code to reset password to users email',
  })
  @ApiResponse({
    status: 400,
    description: 'if something wrong, eg body, etc',
  })
  @ApiResponse({
    status: 404,
    description: 'if the user not found',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
      },
      required: ['email'],
    },
  })
  async forgotPassword(@Req() req, @Body() any) {
    const body = await req.body;
    const requestBodyKeys = await Object.keys(req.body);

    if (!body || body === undefined || Object.keys(body).length === 0) {
      throw new BadRequestException('body can not be empty');
    }
    if (
      requestBodyKeys &&
      JSON.stringify(requestBodyKeys) !== JSON.stringify(['email'])
    ) {
      throw new BadRequestException('use only allowed body parameters');
    }

    const forgotPasswordDto = body as ForgotPasswordDto;
    return await this.authService.forgotPassword(forgotPasswordDto);
  }

  @Patch('reset-password')
  @ApiOperation({
    summary: 'reset-password',
    description:
      'reset password, provide: email, confirmationCode, newPassword, confirmPassword',
  })
  @ApiResponse({
    status: 200,
    description: 'Password has been reset successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'if something wrong, eg body, etc',
  })
  @ApiResponse({
    status: 404,
    description: 'if the confirmation code not found',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        confirmationCode: { type: 'string' },
        newPassword: { type: 'string' },
        confirmPassword: { type: 'string' },
      },
      required: ['email', 'confirmationCode', 'newPassword', 'confirmPassword'],
    },
  })
  async resetPassword(@Req() req, @Body() any) {
    const body = await req.body;
    const requestBodyKeys = await Object.keys(req.body);

    if (!body || body === undefined || Object.keys(body).length === 0) {
      throw new BadRequestException('body can not be empty');
    }
    if (
      requestBodyKeys &&
      JSON.stringify(requestBodyKeys) !==
        JSON.stringify([
          'email',
          'confirmationCode',
          'newPassword',
          'confirmPassword',
        ])
    ) {
      throw new BadRequestException('use only allowed body parameters');
    }

    const resetPasswordDto = body as ResetPasswordDto;

    return await this.authService.resetPassword(resetPasswordDto);
  }

  @Get('all-codes')
  @ApiOperation({
    summary: 'get all confirmation codes',
    description: 'this endpoint is not ready yet',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    schema: null,
  })
  @UseGuards(JwtAuthGuard)
  async getAllCodes(
    @Req()
    req,
  ) {
    const userId = await req.user.id;
    const userRole = await req.user.role;

    return await this.authService.getAllCodes(userId, userRole);
  }
}
