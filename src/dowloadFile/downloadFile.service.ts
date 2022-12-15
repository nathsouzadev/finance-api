import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';

@Injectable()
export class DownloadFileService {
  
  createFile = async(userId: string): Promise<{ fileToDownload: string }> => {
    const fileContent = 'This is other the content of the text file. \nOther line';
    const fileToDownload = `./download/${userId}.txt`;
    
    await fs.writeFile(fileToDownload, fileContent);

    return { fileToDownload };
  }
}
