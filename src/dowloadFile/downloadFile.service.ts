import { Injectable } from '@nestjs/common';
import { Operation } from '@prisma/client';
import { promises as fs } from 'fs';

@Injectable()
export class DownloadFileService {
  
  createFile = async(userId: string, operations: Operation[]): Promise<{ fileToDownload: string }> => {
    const fileContent = `All operations for ${userId}:
    ${operations.map(operation => `\n ${operation.createdAt} | ${operation.description} | ${operation.value}` )}`
    const fileToDownload = `./download/${userId}.txt`;
    
    await fs.writeFile(fileToDownload, fileContent);

    return { fileToDownload };
  }
}
