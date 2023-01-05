import { Prisma } from '@prisma/client';
import { HttpException } from '@nestjs/common/exceptions';

export interface IParams {
  skip?: number;
  take?: number;
  cursor?: Prisma.UserWhereUniqueInput;
  where?: Prisma.UserWhereInput;
  orderBy?: Prisma.UserOrderByWithRelationInput;
}

export function validate_and_transform_params(params: IParams): IParams {
  const { skip, take, cursor, where, orderBy } = params;

  if (skip && isNaN(Number(skip)))
    throw new HttpException('skip needs to be a valid number', 400);
  if (take && isNaN(Number(take)))
    throw new HttpException('take needs to be a valid number', 400);

  params.skip = Number(skip) || undefined;
  params.take = Number(take) || undefined;

  params.cursor = cursor ? JSON.parse(cursor as string) : undefined;
  params.where = where ? JSON.parse(where as string) : undefined;
  params.orderBy = orderBy ? JSON.parse(orderBy as string) : undefined;

  return params;
}
