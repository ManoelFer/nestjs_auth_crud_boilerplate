import { HttpException, Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { PrismaService } from 'src/prisma/prisma.service';
import { IUserWithRoles } from './interfaces/users.custom.interfaces';

@Injectable()
export class UsersRepository implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit(): Promise<void> {
    //TODO: run only once when building the module
    await this.prisma.$connect();

    this.prisma.$use(async (params, next) => {
      //TODO: execute always before any database request

      if (params.action == 'create' && params.model == 'User') {
        //TODO: execute on create method prisma to user Model
        const user = params.args.data;
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(user.password, salt);
        user.password = hash;
        params.args.data = user;
      }
      return next(params);
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    //TODO: all new users starting with user role
    data = {
      ...data,
      roles: {
        create: [
          {
            createdAt: new Date(),
            role: {
              connect: {
                name: 'user',
              },
            },
          },
        ],
      },
    };

    try {
      const userCreated = await this.prisma.user.create({
        data,
      });

      return userCreated;
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

  users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    return this.prisma.user.findMany(params);
  }

  async user(
    where: Prisma.UserWhereUniqueInput,
  ): Promise<IUserWithRoles | null> {
    const user = await this.prisma.user.findUnique({
      where: where,
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) throw new HttpException('User not found!', 404);

    return user;
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    return this.prisma.user.update(params);
  }

  deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }

  addRoleOnUser({ userId, roleId }) {
    return this.prisma.usersOnRoles.create({
      data: {
        createdAt: new Date(),
        userId: userId,
        roleId: roleId,
      },
    });
  }

  deleteRoleOnUser({ userId, roleId }) {
    return this.prisma.usersOnRoles.deleteMany({
      where: {
        userId: userId,
        AND: {
          roleId: roleId,
        },
      },
    });
  }
}
