import { Module } from '@nestjs/common';
import { ClientsModule } from './clients/clients.module';
import { OperationModule } from './operation/operation.module';
import { DownloadFileModule } from './dowloadFile/downloadFile.module';

@Module({
  imports: [ClientsModule, OperationModule, DownloadFileModule]
})
export class AppModule {}
