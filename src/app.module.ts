import { Module } from '@nestjs/common';
import { ClientsModule } from './clients/clients.module';
import { OperationModule } from './operation/operation.module';

@Module({
  imports: [ClientsModule, OperationModule]
})
export class AppModule {}
