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
import { Query } from '@nestjs/common/decorators';
import { HttpException } from '@nestjs/common/exceptions';
import { Prisma } from '@prisma/client';

import RolesGuard from 'src/roles/roles.guard';
import { Role } from 'src/shared/constants/role.enum';

import { exclude } from 'src/shared/helpers/exclude_fields';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUserWithoutPassword } from './interfaces/users.custom.interfaces';

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
    return this.usersService.findAll(queryString);
  }

  @Get(':where')
  async findOne(
    @Param('where') where: Prisma.UserWhereUniqueInput,
  ): Promise<IUserWithoutPassword> {
    where = where ? JSON.parse(where as string) : undefined;

    const user = await this.usersService.findOne(where);

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    //TODO: how to delete fields in PRISMA according to the documentation: https://www.prisma.io/docs/concepts/components/prisma-client/excluding-fields
    //Remove password, before returning to client
    const userWithoutPassword = exclude(user, ['password']);

    return userWithoutPassword;
  }

  @Patch(':where')
  update(
    @Param('where') where: Prisma.UserWhereUniqueInput,
    @Body() data: UpdateUserDto,
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
