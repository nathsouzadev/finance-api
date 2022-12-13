import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../../database/prisma.service';
import { PrismaUserRepository } from './prismaUser.repository';

describe('PrismaUserRepository', () => {
  let repository: PrismaUserRepository;
  let mockPrismaService: PrismaService;
  const mockUserId = randomUUID()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ 
        PrismaUserRepository,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn()
            },
            operation: {
              findMany: jest.fn()
            }
          }
        }
      ]
    }).compile();

    repository = module.get<PrismaUserRepository>(PrismaUserRepository);
    mockPrismaService = module.get<PrismaService>(PrismaService)
  });

  it('should return user with userId', async () => {
    const mockFindUnique = jest.spyOn(mockPrismaService.user, 'findUnique').mockResolvedValue({
      id: mockUserId,
      balance: 10000
    })
    const user = await repository.getUserById(mockUserId)
    expect(mockFindUnique).toHaveBeenCalledWith({ where: {
      id: mockUserId
    }})
    expect(user).toMatchObject({
      balance: 10000
    })
  });
});
