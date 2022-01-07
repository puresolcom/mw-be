import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  // inject prisma service
  constructor(private readonly prisma: PrismaService) {}

  // get all users
  async getUsers() {
    return await this.prisma.user.findMany();
  }

  // get user by unique id
  async getUser(
    UserWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User> {
    return await this.prisma.user.findUnique({ where: UserWhereUniqueInput });
  }

  // create new user
  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    // encrypt password before saving
    data.password = await this.encryptPassword(data.password);
    return await this.prisma.user.create({ data });
  }

  // update user
  async updateUser(
    UserWhereUniqueInput: Prisma.UserWhereUniqueInput,
    data: Omit<Prisma.UserUpdateInput, 'password'> & { password?: string },
  ): Promise<User> {
    // encrypt password before saving if it is provided and make sure it is a string value
    if (data.password) {
      data.password = await this.encryptPassword(data.password);
    }

    return await this.prisma.user.update({
      where: UserWhereUniqueInput,
      data,
    });
  }

  // encrypt password
  async encryptPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
