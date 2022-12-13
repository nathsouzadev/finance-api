import { Module } from '@nestjs/common';
import { OperationService } from './operation.service';
import { PrismaService } from 'src/database/prisma.service';
import { OperationRepository } from './repository/operation.repository';
import { PrismaOperationRepository } from './repository/prisma/prismaOperation.repository';

@Module({
  providers: [
    OperationService,
    PrismaService,
    {
      provide: OperationRepository,
      useClass: PrismaOperationRepository
    }
  ]
})
export class OperationModule {}
