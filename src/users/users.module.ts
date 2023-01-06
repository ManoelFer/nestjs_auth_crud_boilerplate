import { Module } from '@nestjs/common';

import { UsersService } from './users.service';

import { UsersController } from './users.controller';

import { PrismaService } from '../prisma/prisma.service';
import { UsersRepository } from './users.repository';
import { RolesRepository } from 'src/roles/roles.repository';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, UsersRepository, RolesRepository],
})
export class UsersModule {}
