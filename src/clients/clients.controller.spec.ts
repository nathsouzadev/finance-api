import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import { OperationService } from '../operation/operation.service';
import { PrismaService } from '../database/prisma.service';
import { ClientsController } from './clients.controller';
import { UserRepository } from './repository/user.repository';
import { ClientsService } from './service/clients.service';
import { OperationRepository } from '../operation/repository/operation.repository';
import { DownloadFileService } from '../dowloadFile/downloadFile.service';

describe('ClientsController', () => {
  let controller: ClientsController;
  let mockClientsService: ClientsService;

  const mockUserId = randomUUID()

  const mockRequest: Partial<Request> = {
    headers: {
      'correlation-id': '69d11d3e-810c-4f17-9479-2359c7b3a988'
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [
        ClientsService,
        PrismaService,
        DownloadFileService,
        {
          provide: UserRepository,
          useValue: {
            getBalance: jest.fn(),
            getOperationsByPagination: jest.fn()
          }
        },
        {
          provide: OperationRepository,
          useValue: {

          }
        },
        OperationService
      ],
    }).compile();

    controller = module.get<ClientsController>(ClientsController);
    mockClientsService = module.get<ClientsService>(ClientsService);
  });

  it('should return actual balance', async () => {
    const mockGetUserById = jest.spyOn(mockClientsService, 'getBalance').mockImplementation(() => Promise.resolve({ balance: 100.51 }))
    jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2022-10-12T13:27:36.321Z')
    const response = await controller.getBallance(
      mockRequest as Request,
      mockUserId
    )
    expect(mockGetUserById).toHaveBeenCalledWith(mockUserId)
    expect(response).toMatchObject({
      balance: 100.51,
      date: '2022-10-12T13:27:36.321Z'
    })
  });

  it('should return releases with page present on query', async () => {
    const mockGetOperations = jest.spyOn(mockClientsService, 'getOperationsByPagination').mockImplementation(() => Promise.resolve({
      totalPages: 2,
      page: 2,
      nextPage: true,
      releases: {
        '2022-11-20': [
          {
            description: 'Food',
            value: -10
          },
          {
            description: 'Salary',
            value: 3500
          },
        ],
        '2022-11-19': [
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
    }))
    const response = await controller.getReleases(
      mockRequest as Request,
      mockUserId,
      {
        start_date: '2022-12-12',
        end_date: '2022-12-13',
        page: 2
      },
    )
    expect(mockGetOperations).toHaveBeenCalledWith(
      mockUserId,
      '2022-12-12',
      '2022-12-13',
      2
    )
    expect(response).toMatchObject({
      totalPages: 2,
      page: 2,
      nextPage: true,
      releases: {
        '2022-11-20': [
          {
            description: 'Food',
            value: -10
          },
          {
            description: 'Salary',
            value: 3500
          },
        ],
        '2022-11-19': [
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

  it('should return releases with page 1 when is not present on query', async () => {
    const mockGetOperations = jest.spyOn(mockClientsService, 'getOperationsByPagination').mockImplementation(() => Promise.resolve({
      totalPages: 2,
      page: 1,
      nextPage: true,
      releases: {
        '2022-11-20': [
          {
            description: 'Food',
            value: -10
          },
          {
            description: 'Salary',
            value: 3500
          },
        ],
        '2022-11-19': [
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
    }))
    const response = await controller.getReleases(
      mockRequest as Request,
      mockUserId,
      {
        start_date: '2022-12-12',
        end_date: '2022-12-13'
      },
    )
    expect(mockGetOperations).toHaveBeenCalledWith(
      mockUserId,
      '2022-12-12',
      '2022-12-13',
      1
    )
    expect(response).toMatchObject({
      totalPages: 2,
      page: 1,
      nextPage: true,
      releases: {
        '2022-11-20': [
          {
            description: 'Food',
            value: -10
          },
          {
            description: 'Salary',
            value: 3500
          },
        ],
        '2022-11-19': [
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

  it('should throw an error if end_date and today is more than 90 days', async () => {
    const mockInvalidDate = new Date()
    mockInvalidDate.setDate(mockInvalidDate.getDate() - 91)
    await expect(controller.getReleases(
      mockRequest as Request,
      mockUserId,
      {
        start_date: '2022-12-12',
        end_date: mockInvalidDate.toISOString().split('T')[0],
      }
    )).rejects.toThrow(
      new Error('Invalid date interval. To get operations before 90 days go to /:id/old-releases')
    )
  })

  it('should return a link to download releases', async() => {
    const mockGetFile = jest.spyOn(mockClientsService, 'getFileToDownload').mockImplementation(() => Promise.resolve({ fileToDownload: `./download/${mockUserId}.txt` }))
    
    const mockResponse: Partial<Response> = {
      download: jest.fn()
    }
    await controller.downloadRelease(
      mockResponse as Response,
      mockRequest as Request,
      mockUserId
    )
    expect(mockGetFile).toHaveBeenCalledWith(mockUserId)
    expect(mockResponse.download).toHaveBeenCalledWith(`./download/${mockUserId}.txt`)
  })
});
