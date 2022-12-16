import { Injectable } from '@nestjs/common';
import { Operation } from '@prisma/client';
import { OperationRepository } from './repository/operation.repository';

@Injectable()
export class OperationService {

  constructor(
    private readonly operationRepository: OperationRepository
  ){}

  getOperationsByDate = async (
    userId: string,
    startDate: string,
    endDate: string,
    page: number
  ): Promise<Operation[]> => {
    return this.operationRepository.getOperationsByDate(userId, startDate, endDate, page)
  }

  getTotalOperationsByUserId = async (userId: string): Promise<{ count: number }> => {
    return this.operationRepository.getTotalOperationsByUserId(userId)
  }

  getOperationsByUserId = async (userId: string): Promise<Operation[]> => {
    return this.operationRepository.getAllOperationsByUserId(userId)
  }
}
