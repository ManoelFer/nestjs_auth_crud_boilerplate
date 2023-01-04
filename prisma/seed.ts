import { PrismaClient } from '@prisma/client';

import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const salt = bcrypt.genSaltSync(10);
  /**
   *TODO: seed to generate roles
   */
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      description:
        'This user can create a new roles and see all users in the system.',
    },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: {
      name: 'user',
      description: 'Only see your own data',
    },
  });

  /**
   * TODO: seed to generate users
   */
  const hashAdmin = bcrypt.hashSync('hardpasswordtoadmins123', salt);
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@admin.com',
      password: hashAdmin,
      name: 'Administrator',
      cellphone: '(64) 999690090',
      roles: {
        create: [
          {
            createdAt: new Date(),
            role: {
              connect: {
                id: adminRole.id,
              },
            },
          },
        ],
      },
    },
  });

  const hashUser = bcrypt.hashSync('hardpasswordtousers123', salt);
  const commonUser = await prisma.user.create({
    data: {
      email: 'user@user.com',
      password: hashUser,
      name: 'User',
      cellphone: '(64) 999690091',
      roles: {
        create: [
          {
            createdAt: new Date(),
            role: {
              connect: {
                id: userRole.id,
              },
            },
          },
        ],
      },
    },
  });

  console.log({ adminUser, commonUser });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
