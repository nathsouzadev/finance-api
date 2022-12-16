import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../database/prisma.service';
import { PrismaOperationRepository } from './prismaOperation.repository';

describe('PrismaOperationRepository', () => {
  let repository: PrismaOperationRepository;
  let mockPrismaService: PrismaService;

  const mockUserId = '4e423bda-7c4b-4564-8e86-4b0e4812e7c0';
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
      createdAt: new Date('2022-11-28'),
      description: 'Tax',
      value: -300,
    },
  ]

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaOperationRepository,
        {
          provide: PrismaService,
          useValue: {
            operation: {
              findMany: jest.fn(),
              aggregate: jest.fn()
            },
          },
        },
      ],
    }).compile();

    repository = module.get<PrismaOperationRepository>(
      PrismaOperationRepository,
    );
    mockPrismaService = module.get<PrismaService>(PrismaService);
  });

  it('should return operations between dates with userId', async () => {
    const mockFindMany = jest
      .spyOn(mockPrismaService.operation, 'findMany')
      .mockResolvedValue(mockOperations);

    const operations = await repository.getOperationsByDate(
      mockUserId,
      '2022-09-12',
      '2022-12-13',
      1
    );
    expect(mockFindMany).toHaveBeenCalledWith({
      where: {
        createdAt: {
          lte: new Date('2022-12-13'),
          gte: new Date('2022-09-12'),
        },
        userId: mockUserId
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: 0 * 5,
      take: 5,
    });
    expect(operations).toHaveLength(5);
  });

  it('return total of operations with userId', async() => {
    const mockAggregate = jest
      .spyOn<any, any>(mockPrismaService.operation, 'aggregate')
      .mockImplementation(() => Promise.resolve({
        _count: {
          userId: 8
        }
      }))

    const count = await repository.getTotalOperationsByUserId(mockUserId)
    expect(mockAggregate).toHaveBeenCalledWith({
      _count: {
        userId: true,
      },
      where: {
        userId: mockUserId
      }
    })
    expect(count).toMatchObject({ count: 8 })
  })

  it('should return all operations with userId', async () => {
    const mockFindMany = jest.spyOn<any, any>(mockPrismaService.operation, 'findMany').mockImplementation(() => Promise.resolve(mockOperations))
    const operations = await repository.getAllOperationsByUserId(mockUserId)
    expect(mockFindMany).toHaveBeenCalledWith({
      where: {
        userId: mockUserId,
      }
    })
    expect(operations).toMatchObject(mockOperations)
  })
});
