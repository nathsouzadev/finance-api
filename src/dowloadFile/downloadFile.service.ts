import { Injectable } from '@nestjs/common';
import { Operation } from '@prisma/client';
import { promises as fs } from 'fs';
import { AppLogger } from '../utils/appLogger';

@Injectable()
export class DownloadFileService {

  constructor(private readonly appLogger: AppLogger){}
  
  createFile = async(userId: string, operations: Operation[]): Promise<{ fileToDownload: string }> => {
    this.appLogger.logger({ message: `Generating file with operations to ${userId}`}, DownloadFileService.name)

    const fileContent = `All operations for ${userId}:
    ${operations.map(operation => `\n ${operation.createdAt} | ${operation.description} | ${operation.value}` )}`
    const fileToDownload = `./download/${userId}.txt`;
    
    this.appLogger.logger({ message: `Saving file with operatiors to ${userId}`}, DownloadFileService.name)
    await fs.writeFile(fileToDownload, fileContent);

    return { fileToDownload };
  }
}
