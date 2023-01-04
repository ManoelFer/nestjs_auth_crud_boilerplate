import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Query, Request } from '@nestjs/common/decorators';
import { HttpException } from '@nestjs/common/exceptions';
import { Prisma } from '@prisma/client';

import RolesGuard from 'src/roles/roles.guard';
import { Role } from 'src/shared/constants/role.enum';

import { exclude } from 'src/shared/helpers/exclude_fields';
import { CreateUserDto } from './dto/create-user.dto';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() data: CreateUserDto) {
    return this.usersService.create(data);
  }

  @UseGuards(RolesGuard(Role.Admin))
  @Get()
  async findAll(
    @Query()
    queryString: {
      skip?: number;
      take?: number;
      cursor?: Prisma.UserWhereUniqueInput;
      where?: Prisma.UserWhereInput;
      orderBy?: Prisma.UserOrderByWithRelationInput;
    },
    @Request() req: any,
  ) {
    let { skip, take, cursor, where, orderBy } = queryString;

    if (skip && isNaN(Number(skip)))
      throw new HttpException('skip needs to be a valid number', 400);
    if (take && isNaN(Number(take)))
      throw new HttpException('take needs to be a valid number', 400);

    queryString.skip = Number(skip) || undefined;
    queryString.take = Number(take) || undefined;

    queryString.cursor = cursor ? JSON.parse(cursor as string) : undefined;
    queryString.where = where ? JSON.parse(where as string) : undefined;
    queryString.orderBy = orderBy ? JSON.parse(orderBy as string) : undefined;

    const users = await this.usersService.findAll(queryString);

    const usersWithoutPassword = [];

    //TODO: how to delete fields in PRISMA according to the documentation: https://www.prisma.io/docs/concepts/components/prisma-client/excluding-fields
    users.forEach((user) => {
      const userWithoutPassword = exclude(user, ['password']);

      usersWithoutPassword.push(userWithoutPassword);
    });

    return usersWithoutPassword;
  }

  @Get(':where')
  async findOne(@Param('where') where: Prisma.UserWhereUniqueInput) {
    where = where ? JSON.parse(where as string) : undefined;

    const user = await this.usersService.findOne(where);

    //TODO: how to delete fields in PRISMA according to the documentation: https://www.prisma.io/docs/concepts/components/prisma-client/excluding-fields
    const userWithoutPassword = exclude(user, ['password']);

    return userWithoutPassword;
  }

  @Patch(':where')
  update(
    @Param('where') where: Prisma.UserWhereUniqueInput,
    @Body() data: Prisma.UserUpdateInput,
  ) {
    where = where ? JSON.parse(where as string) : undefined;

    return this.usersService.update({
      where: where,
      data: data,
    });
  }

  @Delete(':where')
  remove(@Param('where') where: Prisma.UserWhereUniqueInput) {
    where = where ? JSON.parse(where as string) : undefined;

    return this.usersService.remove(where);
  }
}
