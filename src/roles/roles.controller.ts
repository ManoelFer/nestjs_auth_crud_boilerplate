import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import RolesGuard from './roles.guard';
import { Role } from 'src/shared/constants/role.enum';
import { Prisma } from '@prisma/client';

//TODO: Only admins can manipulate roles

@Controller('roles')
@UseGuards(RolesGuard(Role.Admin))
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
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
    return this.rolesService.findAll(queryString);
  }

  @Get(':where')
  findOne(@Param('where') where: Prisma.RoleWhereUniqueInput) {
    where = where ? JSON.parse(where as string) : undefined;

    return this.rolesService.findOne(where);
  }

  @Patch(':where')
  update(
    @Param('where') where: Prisma.RoleWhereUniqueInput,
    @Body() data: UpdateRoleDto,
  ) {
    where = where ? JSON.parse(where as string) : undefined;
    return this.rolesService.updateRole({ where, data });
  }

  @Delete(':where')
  remove(@Param('where') where: Prisma.RoleWhereUniqueInput) {
    where = where ? JSON.parse(where as string) : undefined;

    return this.rolesService.remove(where);
  }
}
