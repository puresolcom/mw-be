import { UserCreateDto } from './dto/user-create.dto';
import { UsersService } from './users.service';
import {
  Body,
  Request,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // get all users
  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getUsers(): Promise<User[]> {
    return await this.usersService.getUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async getProfile(@Request() request) {
    return request.user;
  }

  // get user by unique id
  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getUser(@Param('id') id: string): Promise<User> {
    return await this.usersService.getUser({ id });
  }

  // create new user
  @Post('/')
  async createUser(@Body() data: UserCreateDto): Promise<User> {
    return await this.usersService.createUser(data);
  }

  // update user
  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async updateUser(
    @Param('id') id: string,
    @Body()
    data: Omit<Prisma.UserUpdateInput, 'password'> & { password?: string },
  ): Promise<User> {
    return await this.usersService.updateUser({ id }, data);
  }
}
