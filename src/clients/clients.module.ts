import { Module } from '@nestjs/common';
import { ClientsService } from './service/clients.service';
import { ClientsController } from './clients.controller';
import { PrismaService } from '../database/prisma.service';
import { UserRepository } from './repository/user.repository';
import { PrismaUserRepository } from './repository/prisma/prismaUser.repository';
import { OperationService } from '../operation/operation.service';
import { PrismaOperationRepository } from '../operation/repository/prisma/prismaOperation.repository';
import { OperationRepository } from '../operation/repository/operation.repository';
import { OperationModule } from '../operation/operation.module';

@Module({
  imports: [OperationModule],
  controllers: [ClientsController],
  providers: [
    ClientsService, 
    PrismaService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository
    },
    {
      provide: OperationRepository,
      useClass: PrismaOperationRepository
    },
    OperationService
  ]
})
export class ClientsModule {}
