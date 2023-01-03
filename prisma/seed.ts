import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
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

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@admin.com',
      password: 'hardpasswordtoadmins123',
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

  const commonUser = await prisma.user.create({
    data: {
      email: 'user@user.com',
      password: 'hardpasswordtousers123',
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
