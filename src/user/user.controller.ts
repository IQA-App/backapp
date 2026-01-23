import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  ValidationPipe,
  Body,
  Patch,
  Req,
  BadRequestException,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiCommonErrorResponses } from 'src/custom-decorators/custom-decorators.decorator';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({
    summary: 'get all users',
    description: 'get all users. requires admin role to having this access',
  })
  @ApiResponse({
    status: 200,
    type: CreateUserDto,
  })
  @ApiCommonErrorResponses()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async findAllUsers(
    @Req()
    req,
  ) {
    const userId = await req.user.id;
    const userRole = await req.user.role;

    return this.userService.findAllUsers(userRole);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'get specific user by user_id',
    description:
      'get specific user by user_id. only owner of this account can have this access',
  })
  @ApiResponse({
    status: 200,
    type: CreateUserDto,
  })
  @ApiCommonErrorResponses()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async findOneById(
    @Param('id', ParseUUIDPipe) lookUpId: string,
    @Req()
    req,
  ) {
    const userId = await req.user.id;
    const userRole = await req.user.role;

    return await this.userService.findOneById(lookUpId, userId, userRole);
  }

  @Post()
  @ApiOperation({
    summary: 'creates user',
    description: 'creates user. requires email and password in the body',
  })
  @ApiResponse({
    status: 201,
    type: CreateUserDto,
  })
  @ApiResponse({
    status: 400,
    description: 'if something wrong, eg body, etc',
  })
  async createUser(
    @Req() req,
    @Body()
    any,
  ) {
    const body = await req.body;
    const requestBodyKeys = await Object.keys(req.body);

    if (!body || body === undefined || Object.keys(body).length === 0) {
      throw new BadRequestException('body can not be empty');
    }
    if (
      requestBodyKeys &&
      JSON.stringify(requestBodyKeys) !== JSON.stringify(['email', 'password'])
    ) {
      throw new BadRequestException('use only allowed body parameters');
    }
    const createUserDto = body as CreateUserDto;

    return await this.userService.createUser(createUserDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'update specific user by user_id',
    description:
      'update specific user by user_id. only owner of this account can have this access',
  })
  @ApiResponse({
    status: 200,
    type: CreateUserDto,
  })
  @ApiCommonErrorResponses()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Param('id', ParseUUIDPipe) lookUpId: string,
    @Req() req,
    @Body(ValidationPipe)
    updateUserDto: UpdateUserDto,
  ) {
    const userId = await req.user.id;
    const body = await req.body;
    const requestBodyKeys = await Object.keys(req.body);

    if (!body || body === undefined || Object.keys(body).length === 0) {
      throw new BadRequestException('body can not be empty');
    }
    if (
      requestBodyKeys &&
      JSON.stringify(requestBodyKeys) !== JSON.stringify(['email', 'password'])
    ) {
      throw new BadRequestException('use only allowed body parameters');
    }

    return this.userService.updateUser(lookUpId, userId, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'deletes specific user by user_id',
    description:
      'deletes specific user by user_id. only owner of this account can have this access',
  })
  @ApiResponse({
    status: 200,
    description: 'returns nothing',
  })
  @ApiCommonErrorResponses()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Param('id', ParseUUIDPipe) lookUpId: string, @Req() req) {
    const userId = await req.user.id;

    return await this.userService.deleteUser(lookUpId, userId);
  }
}
