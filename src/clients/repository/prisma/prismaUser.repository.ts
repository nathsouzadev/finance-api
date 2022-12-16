import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { AppLogger } from '../../../utils/appLogger';
import { PrismaService } from '../../../database/prisma.service';
import { UserRepository } from '../user.repository';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(
    private readonly applogger: AppLogger,
    private readonly prisma: PrismaService
  ) {}
  
  getUserById = async (userId: string): Promise<User> => {
    this.applogger.logger({ message: `Getting balance from user ${userId}`}, UserRepository.name)

    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  };
}
