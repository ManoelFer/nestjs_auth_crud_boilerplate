import { Injectable, HttpException } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { Prisma, Role } from '@prisma/client';
import { validate_and_transform_params } from 'src/shared/helpers';

import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleRepository } from './roles.repository';

@Injectable()
export class RolesService {
  constructor(private repo: RoleRepository) {}

  @ApiOkResponse({ description: 'List roles' })
  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.RoleWhereUniqueInput;
    where?: Prisma.RoleWhereInput;
    orderBy?: Prisma.RoleOrderByWithRelationInput;
  }): Promise<Role[]> {
    const paramsTransformed = validate_and_transform_params(params);

    return this.repo.roles(paramsTransformed);
  }

  @ApiOkResponse({ description: 'Find role by unique key' })
  findOne(where: Prisma.RoleWhereUniqueInput): Promise<Role | null> {
    return this.repo.role(where);
  }

  @ApiCreatedResponse({ description: 'Create a role' })
  create(data: Prisma.RoleCreateInput): Promise<Role> {
    return this.repo.createRole(data);
  }

  @ApiOkResponse({ description: 'Update roles by unique key' })
  async updateRole(params: {
    where: Prisma.RoleWhereUniqueInput;
    data: Prisma.RoleUpdateInput;
  }): Promise<Role> {
    const { data, where } = params;

    if (data.name) {
      throw new HttpException(
        "You can't alter a unique atribute, because this is can affected code",
        403,
      );
    }

    await this.repo.role(where);

    return this.repo.updateRole(params);
  }

  @ApiOkResponse({ description: 'Delete role by unique key' })
  async remove(where: Prisma.RoleWhereUniqueInput): Promise<Role> {
    await this.repo.role(where);

    return this.repo.deleteRole(where);
  }
}
