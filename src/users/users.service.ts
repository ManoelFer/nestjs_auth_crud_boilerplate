import { HttpException, Injectable, OnModuleInit } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';

import { User, Prisma } from '@prisma/client';

import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit(): Promise<void> {
    //TODO: run only once when building the module
    await this.prisma.$connect();

    this.prisma.$use(async (params, next) => {
      //TODO: execute always before any database request

      if (params.action == 'create' && params.model == 'User') {
        //TODO: execute on create method prisma to user Model
        const user = params.args.data;
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(user.password, salt);
        user.password = hash;
        params.args.data = user;
      }
      return next(params);
    });
  }

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
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
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
