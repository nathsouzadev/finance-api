import { Test, TestingModule } from '@nestjs/testing';
import { OperationService } from './operation.service';
import { OperationRepository } from './repository/operation.repository';

describe('OperationService', () => {
  let service: OperationService;
  let mockOperationRepository: OperationRepository

  const mockUserId = '4e423bda-7c4b-4564-8e86-4b0e4812e7c0';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OperationService,
        {
          provide: OperationRepository,
          useValue: {
            getOperationsByDate: jest.fn(),
            getTotalOperationsByUserId: jest.fn()
          }
        }
      ],
    }).compile();

    service = module.get<OperationService>(OperationService);
    mockOperationRepository = module.get<OperationRepository>(OperationRepository)
  });

  it('should be return operations splited dy date', async () => {
    const mockGetOperations = jest.spyOn(mockOperationRepository, 'getOperationsByDate').mockImplementation(() => Promise.resolve([
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
      }
    ]))
    const operations = await service.getOperationsByDate(
      mockUserId,
      '2022-09-12',
      '2022-12-13',
      1
    )
    expect(mockGetOperations).toHaveBeenCalledWith(
      mockUserId,
      '2022-09-12',
      '2022-12-13',
      1
    )
    expect(operations).toHaveLength(3)
  });

  it('should return total operations with userId', async() => {
    const mockGetTotalOperations = jest.spyOn(mockOperationRepository, 'getTotalOperationsByUserId').mockImplementation(() => Promise.resolve({ count: 3 }))

    const totalOperation = await service.getTotalOperationsByUserId(mockUserId)
    expect(mockGetTotalOperations).toHaveBeenCalledWith(mockUserId)
    expect(totalOperation).toMatchObject({ count: 3 })
  })
});
