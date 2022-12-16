import { Test, TestingModule } from '@nestjs/testing';
import { DownloadFileService } from './downloadFile.service';
import { promises as fs } from 'fs';
import { randomUUID } from 'crypto';

describe('DownloadFileService', () => {
  let service: DownloadFileService;

  const mockUserId = randomUUID();
  const mockOperations = [
    {
      id: '35e42af4-5602-4895-9646-c094dddb1d03',
      userId: mockUserId,
      createdAt: new Date('2022-12-13'),
      description: 'Salary',
      value: 3500,
    },
    {
      id: 'f30d9b30-001b-4968-8ada-7d114a7e2f06',
      userId: mockUserId,
      createdAt: new Date('2022-12-13'),
      description: 'Food',
      value: -10,
    }
  ]

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DownloadFileService],
    }).compile();

    service = module.get<DownloadFileService>(DownloadFileService);
  });

  it('should create file and return file path to download', async () => {
    const mockWriteFile = jest.spyOn(fs, 'writeFile').mockResolvedValue();
    const mockFileContent = `All operations for ${mockUserId}:
    ${mockOperations.map(operation => `\n ${operation.createdAt} | ${operation.description} | ${operation.value}` )}`

    const fileLink = await service.createFile(mockUserId, mockOperations)
    expect(mockWriteFile).toHaveBeenCalledWith(
      `./download/${mockUserId}.txt`, mockFileContent
    )
    expect(fileLink).toMatchObject({ fileToDownload: `./download/${mockUserId}.txt` });
  });
});
