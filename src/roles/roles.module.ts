import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleRepository } from './roles.repository';

@Module({
  controllers: [RolesController],
  providers: [RolesService, PrismaService, RoleRepository],
})
export class RolesModule {}
