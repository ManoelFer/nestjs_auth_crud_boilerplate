import { HttpException, Injectable } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';

import { User, Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  @ApiCreatedResponse({ description: 'Create user' })
  async create(data: Prisma.UserCreateInput): Promise<User> {
    try {
      const userCreated = await this.prisma.user.create({
        data,
      });

      return userCreated;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (error.code === 'P2002') {
          const field = error.meta?.target;

          throw new HttpException(
            `The field {{${field || ''}}} already exists`,
            400,
          );
        }
      }
      throw error;
    }
  }

  @ApiOkResponse({ description: 'List users' })
  findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;

    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  @ApiOkResponse({ description: 'Find user by unique key' })
  findOne(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: where,
    });
  }

  @ApiOkResponse({ description: 'Update user by unique key' })
  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  @ApiOkResponse({ description: 'Delete user by unique key' })
  remove(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }
}
