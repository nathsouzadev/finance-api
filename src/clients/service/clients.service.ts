import { Injectable } from '@nestjs/common';
import { OperationService } from '../../operation/operation.service';
import { OperationByDate } from '../model/operationByDate.model';
import { OperationByPagination } from '../model/operationByPagination.model';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class ClientsService {

  constructor(
    private readonly userRepository: UserRepository,
    private readonly operationService: OperationService
  ){}

  getBalance = async (userId: string): Promise<{ balance: number }> => {
    const { balance } = await this.userRepository.getUserById(userId)
    return { balance }
  }

  getOperationsByPagination = async (
    userId: string,
    startDate: string,
    endDate: string,
    page: number
  ): Promise<OperationByPagination> => {
    const operations = await this.getOperationsByDate(
      userId,
      startDate,
      endDate,
      page
    )
    const totalPages = await this.getTotalPagesWithOperations(userId)

    return {
      totalPages,
      page,
      nextPage: (page < totalPages),
      releases: operations
    }
  }

  getTotalPagesWithOperations = async (userId: string): Promise<number> => {
    const { count } = await this.operationService.getTotalOperationsByUserId(userId)

    return Math.ceil(count / 5)
  }

  getOperationsByDate = async(
    userId: string,
    startDate: string,
    endDate: string,
    page: number
  ): Promise<OperationByDate> => {
    const operationByDate: OperationByDate = {}
    const operations = await this.operationService.getOperationsByDate(
      userId,
      startDate,
      endDate,
      page
    )

    operations.forEach(operation => {
      const dateKey = operation.createdAt.toISOString().split('T')[0]
      if(Object
          .keys(operationByDate)
          .includes(dateKey)
        ){
          operationByDate[dateKey].push(operation)
      } else {
        operationByDate[dateKey] = []
        operationByDate[dateKey].push(operation)
      }
    })

    return operationByDate
  }
}
