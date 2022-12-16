import { Module } from '@nestjs/common';
import { OperationService } from './operation.service';
import { PrismaService } from '../database/prisma.service';
import { OperationRepository } from './repository/operation.repository';
import { PrismaOperationRepository } from './repository/prisma/prismaOperation.repository';
import { AppLogger } from '../utils/appLogger';

@Module({
  providers: [
    OperationService,
    PrismaService,
    AppLogger,
    {
      provide: OperationRepository,
      useClass: PrismaOperationRepository
    }
  ]
})
export class OperationModule {}
