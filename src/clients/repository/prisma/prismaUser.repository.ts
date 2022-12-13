import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { UserRepository } from '../user.repository';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}
  
  getUserById = async (userId: string): Promise<User> => {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  };
}
