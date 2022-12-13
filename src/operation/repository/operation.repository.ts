import { Operation } from '@prisma/client';

export abstract class OperationRepository {
  abstract getOperationsByDate(
    userId: string, 
    startDate: string, 
    endDate: string, 
    page: number
  ): Promise<Operation[]>

  abstract getTotalOperationsByUserId(userId: string): Promise<{ count: number }>
}
