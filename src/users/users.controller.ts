import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Query } from '@nestjs/common/decorators';
import { HttpException } from '@nestjs/common/exceptions';

import { Prisma } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() data: CreateUserDto) {
    return this.usersService.create(data);
  }

  @Get()
  findAll(
    @Query()
    queryString: {
      skip?: number;
      take?: number;
      cursor?: Prisma.UserWhereUniqueInput;
      where?: Prisma.UserWhereInput;
      orderBy?: Prisma.UserOrderByWithRelationInput;
    },
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

    return this.usersService.findAll(queryString);
  }

  @Get(':where')
  findOne(@Param('where') where: Prisma.UserWhereUniqueInput) {
    where = where ? JSON.parse(where as string) : undefined;

    return this.usersService.findOne(where);
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
