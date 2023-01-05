import { Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';

import { User, Prisma } from '@prisma/client';
import { validate_and_transform_params } from 'src/shared/helpers';
import { exclude } from 'src/shared/helpers/exclude_fields';

import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private repo: UsersRepository) {}

  @ApiCreatedResponse({ description: 'Create user' })
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.repo.createUser(data);
  }

  @ApiOkResponse({ description: 'List users' })
  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const paramsTransformed = validate_and_transform_params(params);

    const users = await this.repo.users(paramsTransformed);

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
    return this.repo.user(where);
  }

  @ApiOkResponse({ description: 'Update user by unique key' })
  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where } = params;

    await this.repo.user(where);

    return this.repo.updateUser(params);
  }

  @ApiOkResponse({ description: 'Delete user by unique key' })
  async remove(where: Prisma.UserWhereUniqueInput): Promise<User> {
    await this.repo.user(where);

    return this.repo.deleteUser(where);
  }
}
