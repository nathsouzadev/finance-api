import { Injectable } from '@nestjs/common';
import { AppLogger } from '../../utils/appLogger';
import { DownloadFileService } from '../../dowloadFile/downloadFile.service';
import { OperationService } from '../../operation/operation.service';
import { OperationByDate } from '../model/operationByDate.model';
import { OperationByPagination } from '../model/operationByPagination.model';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class ClientsService {

  constructor(
    private readonly applogger: AppLogger,
    private readonly userRepository: UserRepository,
    private readonly operationService: OperationService,
    private readonly dowloadFileService: DownloadFileService
  ){}

  getBalance = async (userId: string): Promise<{ balance: number }> => {
    this.applogger.logger({ message: `Getting balance from user ${userId}`}, ClientsService.name)

    const { balance } = await this.userRepository.getUserById(userId)
    return { balance }
  }

  getOperationsByPagination = async (
    userId: string,
    startDate: string,
    endDate: string,
    page: number
  ): Promise<OperationByPagination> => {
    this.applogger.logger({ message: `Getting operations with pages from user ${userId}`}, ClientsService.name)

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
    this.applogger.logger({ message: `Getting operations from user ${userId}`}, ClientsService.name)
    const { count } = await this.operationService.getTotalOperationsByUserId(userId)

    return Math.ceil(count / 5)
  }

  getOperationsByDate = async(
    userId: string,
    startDate: string,
    endDate: string,
    page: number
  ): Promise<OperationByDate> => {
    this.applogger.logger({ message: `Getting operations by date from user ${userId}`}, ClientsService.name)

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

  getFileToDownload = async (userId: string): Promise<{ fileToDownload: string }> => {
    this.applogger.logger({ message: `Getting link to download file with operations from user ${userId}`}, ClientsService.name)

    const operations = await this.operationService.getOperationsByUserId(userId)

    return this.dowloadFileService.createFile(userId, operations)
  }
}
