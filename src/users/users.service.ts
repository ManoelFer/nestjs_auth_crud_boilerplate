import { Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';

import { User, Prisma } from '@prisma/client';
import { exclude } from 'src/shared/helpers/exclude_fields';

import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private repo: UsersRepository) {}

  @ApiCreatedResponse({ description: 'Create user' })
  async create(data: Prisma.UserCreateInput): Promise<User> {
    try {
      const userCreated = await this.repo.create(data);

      return userCreated;
    } catch (error) {
      throw new Error(error);
    }
  }

  @ApiOkResponse({ description: 'List users' })
  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;

    if (skip && isNaN(Number(skip)))
      throw new HttpException('skip needs to be a valid number', 400);
    if (take && isNaN(Number(take)))
      throw new HttpException('take needs to be a valid number', 400);

    params.skip = Number(skip) || undefined;
    params.take = Number(take) || undefined;

    params.cursor = cursor ? JSON.parse(cursor as string) : undefined;
    params.where = where ? JSON.parse(where as string) : undefined;
    params.orderBy = orderBy ? JSON.parse(orderBy as string) : undefined;

    const users = await this.repo.findAll(params);

    const usersWithoutPassword = [];

    //TODO: how to delete fields in PRISMA according to the documentation: https://www.prisma.io/docs/concepts/components/prisma-client/excluding-fields
    users.forEach((user) => {
      const userWithoutPassword = exclude(user, ['password']);

      usersWithoutPassword.push(userWithoutPassword);
    });

    return usersWithoutPassword;
  }

  @ApiOkResponse({ description: 'Find user by unique key' })
  findOne(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    console.log('where', where);
    return this.repo.findOne(where);
  }

  @ApiOkResponse({ description: 'Update user by unique key' })
  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.repo.update({
      data,
      where,
    });
  }

  @ApiOkResponse({ description: 'Delete user by unique key' })
  remove(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.repo.remove(where);
  }
}
