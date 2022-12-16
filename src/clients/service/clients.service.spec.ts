import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { OperationRepository } from '../../operation/repository/operation.repository';
import { OperationService } from '../../operation/operation.service';
import { UserRepository } from '../repository/user.repository';
import { ClientsService } from './clients.service';
import { DownloadFileService } from '../../dowloadFile/downloadFile.service';
import { AppLogger } from '../../utils/appLogger';

describe('ClientsService', () => {
  let service: ClientsService;
  let mockUserRepository: UserRepository;
  let mockOperationService: OperationService;
  let mockDownloadFileService: DownloadFileService;

  const mockUserId = randomUUID()

  const mockOperationsByDate = {
    '2022-12-13': [
      {
        description: 'Salary',
        value: 3500
      },
      {
        description: 'Food',
        value: -10
      }
    ],
    '2022-12-12': [
      {
        description: 'Food',
        value: -3.67
      },
      {
        description: 'Car',
        value: -253.49
      },
      {
        description: 'Tax',
        value: -300.00
      },
    ]
  }

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
    },
    {
      id: '6f2e7d74-12eb-4a00-8747-42a9e7802c7d',
      userId: mockUserId,
      createdAt: new Date('2022-12-12'),
      description: 'Food',
      value: -3.67,
    },
    {
      id: '6ba8b7bb-a9ea-4a95-bb22-cfd6d1d2863a',
      userId: mockUserId,
      createdAt: new Date('2022-12-12'),
      description: 'Car',
      value: -253.49,
    },
    {
      id: '834461ad-0c36-421f-8ca6-677e1043eac5',
      userId: mockUserId,
      createdAt: new Date('2022-12-12'),
      description: 'Tax',
      value: -300,
    }
  ]

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ 
        ClientsService,
        {
          provide: UserRepository,
          useValue: {
            getUserById: jest.fn()
          }
        },
        {
          provide: OperationRepository,
          useValue: {}
        },
        {
          provide: OperationService,
          useValue: {
            getOperationsByDate: jest.fn(),
            getTotalOperationsByUserId: jest.fn(),
            getOperationsByUserId: jest.fn()
          }
        },
        {
          provide: DownloadFileService,
          useValue: {
            createFile: jest.fn()
          }
        },
        AppLogger
      ]
    }).compile();

    service = module.get<ClientsService>(ClientsService);
    mockUserRepository = module.get<UserRepository>(UserRepository)
    mockOperationService = module.get<OperationService>(OperationService)
    mockDownloadFileService = module.get<DownloadFileService>(DownloadFileService)
  });

  it('should be return client balance', async () => {
    const mockFindUnique = jest.spyOn(mockUserRepository, 'getUserById').mockImplementation(() => Promise.resolve({
      id: mockUserId,
      balance: 100.00
    }))
    const balance = await service.getBalance(mockUserId)
    expect(mockFindUnique).toHaveBeenCalledWith(mockUserId)
    expect(balance).toMatchObject({
      balance: 100
    })
  });

  it('should return object with operations and pagiantion information with next page true when page is less than totalPages', async()=>{
    const mockGetOperationsByDate = jest.spyOn(service, 'getOperationsByDate').mockImplementation(() => Promise.resolve(mockOperationsByDate))
    const mockGetTotalPages = jest.spyOn(service, 'getTotalPagesWithOperations').mockImplementation(() => Promise.resolve(2))
    const operationsByPagination = await service.getOperationsByPagination(
      mockUserId,
      '2022-12-12',
      '2022-12-13',
      1
    )
    expect(mockGetOperationsByDate).toHaveBeenCalledWith(
      mockUserId,
      '2022-12-12',
      '2022-12-13',
      1
    )
    expect(mockGetTotalPages).toHaveBeenCalledWith(mockUserId)
    expect(operationsByPagination).toMatchObject({
      totalPages: 2,
      page: 1,
      nextPage: true,
      releases: {
        '2022-12-13': [
          {
            description: 'Salary',
            value: 3500
          },
          {
            description: 'Food',
            value: -10
          }
        ],
        '2022-12-12': [
          {
            description: 'Food',
            value: -3.67
          },
          {
            description: 'Car',
            value: -253.49
          },
          {
            description: 'Tax',
            value: -300.00
          },
        ]
      }
    })
  })

  it('should return object with operations and pagiantion information with next page true when page is equal than totalPages', async()=>{
    const mockGetOperationsByDate = jest.spyOn(service, 'getOperationsByDate').mockImplementation(() => Promise.resolve(mockOperationsByDate))
    const mockGetTotalPages = jest.spyOn(service, 'getTotalPagesWithOperations').mockImplementation(() => Promise.resolve(2))
    const operationsByPagination = await service.getOperationsByPagination(
      mockUserId,
      '2022-12-12',
      '2022-12-13',
      2
    )
    expect(mockGetOperationsByDate).toHaveBeenCalledWith(
      mockUserId,
      '2022-12-12',
      '2022-12-13',
      2
    )
    expect(mockGetTotalPages).toHaveBeenCalledWith(mockUserId)
    expect(operationsByPagination).toMatchObject({
      totalPages: 2,
      page: 2,
      nextPage: false,
      releases: {
        '2022-12-13': [
          {
            description: 'Salary',
            value: 3500
          },
          {
            description: 'Food',
            value: -10
          }
        ],
        '2022-12-12': [
          {
            description: 'Food',
            value: -3.67
          },
          {
            description: 'Car',
            value: -253.49
          },
          {
            description: 'Tax',
            value: -300.00
          },
        ]
      }
    })
  })

  it('should return releases splited by date', async () => {
    const mockGetOperations = jest.spyOn(mockOperationService, 'getOperationsByDate').mockImplementation(() => Promise.resolve(mockOperations))
    const operations = await service.getOperationsByDate(
      mockUserId,
      '2022-12-12',
      '2022-12-13',
      1
    )
    expect(mockGetOperations).toHaveBeenCalledWith(
      mockUserId,
      '2022-12-12',
      '2022-12-13',
      1
    )
    expect(operations).toMatchObject(mockOperationsByDate)
  })

  it('should return total pages with operations by userId', async() => {
    const mockGetTotalOperations = jest.spyOn(mockOperationService, 'getTotalOperationsByUserId').mockImplementation(() => Promise.resolve({ count: 8 }))

    const totalPages = await service.getTotalPagesWithOperations(mockUserId)
    expect(mockGetTotalOperations).toHaveBeenCalledWith(mockUserId)
    expect(totalPages).toBe(2)
  })

  it('should return link to dowload file with operations', async () => {
    const mockGetOperations = jest.spyOn(mockOperationService, 'getOperationsByUserId').mockImplementation(() => Promise.resolve(mockOperations))
    const mockCreateFile = jest.spyOn(mockDownloadFileService, 'createFile').mockImplementation(() => Promise.resolve({ fileToDownload: `./download/${mockUserId}.txt` }))
    
    const linkToDocument = await service.getFileToDownload(mockUserId)
    expect(mockGetOperations).toHaveBeenCalledWith(mockUserId)
    expect(mockCreateFile).toHaveBeenCalledWith(mockUserId, mockOperations)
    expect(linkToDocument).toMatchObject({ fileToDownload: `./download/${mockUserId}.txt` })
  })
});
