import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import { operations } from './operations';

const prisma = new PrismaClient(({ log: ['query'] }));
const userId = '4e423bda-7c4b-4564-8e86-4b0e4812e7c0';

const main = async () => {
  await prisma.user.create({
    data: {
      id: userId,
      balance: 100,
    },
  });

  for (const operation of operations) {
    await prisma.operation.create({
      data: {
        id: randomUUID(),
        userId,
        ...operation
      },
    });
  }
};

main()
