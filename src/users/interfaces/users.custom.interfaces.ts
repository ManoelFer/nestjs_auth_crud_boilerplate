import { Prisma } from '@prisma/client';

export interface IUserWithoutPassword {
  id: number;
  secureId: string;
  email: string;
  name: string;
  cellphone: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export type IUserWithRoles = Prisma.UserGetPayload<{
  include: {
    roles: {
      include: {
        role: true;
      };
    };
  };
}>;
