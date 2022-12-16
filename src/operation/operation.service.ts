import { Injectable } from '@nestjs/common';
import { Operation } from '@prisma/client';
import { AppLogger } from '../utils/appLogger';
import { OperationRepository } from './repository/operation.repository';

@Injectable()
export class OperationService {

  constructor(
    private readonly appLogger: AppLogger,
    private readonly operationRepository: OperationRepository
  ){}

  getOperationsByDate = async (
    userId: string,
    startDate: string,
    endDate: string,
    page: number
  ): Promise<Operation[]> => {
    this.appLogger.logger({ message: `Getting operations with pagination to ${userId}`}, OperationService.name)
    return this.operationRepository.getOperationsByDate(userId, startDate, endDate, page)
  }

  getTotalOperationsByUserId = async (userId: string): Promise<{ count: number }> => {
    this.appLogger.logger({ message: `Getting total operations to ${userId}`}, OperationService.name)
    return this.operationRepository.getTotalOperationsByUserId(userId)
  }

  getOperationsByUserId = async (userId: string): Promise<Operation[]> => {
    this.appLogger.logger({ message: `Getting all operations to ${userId}`}, OperationService.name)
    return this.operationRepository.getAllOperationsByUserId(userId)
  }
}
