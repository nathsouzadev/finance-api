import { Test, TestingModule } from '@nestjs/testing';
import { DownloadFileService } from './downloadFile.service';
import { promises as fs } from 'fs';
import { randomUUID } from 'crypto';

describe('DownloadFileService', () => {
  let service: DownloadFileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DownloadFileService],
    }).compile();

    service = module.get<DownloadFileService>(DownloadFileService);
  });

  it('should create file and return file path to download', async () => {
    const mockUserId = randomUUID();
    
    const mockWriteFile = jest.spyOn(fs, 'writeFile')
    const fileLink = await service.createFile(mockUserId)
    expect(mockWriteFile).toHaveBeenCalledWith(`./download/${mockUserId}.txt`, 'This is other the content of the text file. \nOther line')
    expect(fileLink).toMatchObject({ fileToDownload: `./download/${mockUserId}.txt` });
  });
});
