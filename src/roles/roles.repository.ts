import { Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoleRepository {
  constructor(private prisma: PrismaService) {}

  async role(
    postWhereUniqueInput: Prisma.RoleWhereUniqueInput,
  ): Promise<Role | null> {
    const role = await this.prisma.role.findUnique({
      where: postWhereUniqueInput,
    });

    if (!role) throw new HttpException('Role not found!', 404);

    return role;
  }

  async roles(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.RoleWhereUniqueInput;
    where?: Prisma.RoleWhereInput;
    orderBy?: Prisma.RoleOrderByWithRelationInput;
  }): Promise<Role[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.role.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createRole(data: Prisma.RoleCreateInput): Promise<Role> {
    try {
      const roleCreated = await this.prisma.role.create({
        data,
      });
      return roleCreated;
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

  async updateRole(params: {
    where: Prisma.RoleWhereUniqueInput;
    data: Prisma.RoleUpdateInput;
  }): Promise<Role> {
    const { data, where } = params;
    return this.prisma.role.update({
      data,
      where,
    });
  }

  deleteRole(where: Prisma.RoleWhereUniqueInput): Promise<Role> {
    return this.prisma.role.delete({
      where,
    });
  }
}
