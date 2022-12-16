import { Injectable } from '@nestjs/common';
import { Operation } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { OperationRepository } from '../operation.repository';

@Injectable()
export class PrismaOperationRepository implements OperationRepository {
  constructor(private readonly prisma: PrismaService) {}
  getAllOperationsByUserId(userId: string): Promise<Operation[]> {
    return this.prisma.operation.findMany({
      where: { userId }
    })
  }

  getTotalOperationsByUserId = async (userId: string): Promise<{ count: number; }> => {
    const { _count }= await this.prisma.operation.aggregate({
      _count: {
        userId: true,
      },
      where: {
        userId
      }
    })
    
    return { count: _count.userId }
  }

  getOperationsByDate = async (
    userId: string,
    startDate: string, 
    endDate: string,
    page: number
  ): Promise<Operation[]> => {
    return this.prisma.operation.findMany({
      where: {
        createdAt: {
          lte: new Date(endDate),
          gte: new Date(startDate),
        },
        userId
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * 5,
      take: 5
    })
  }
}
