import { Module } from '@nestjs/common';
import { AppLogger } from '../utils/appLogger';
import { DownloadFileService } from './downloadFile.service';

@Module({
  providers: [DownloadFileService, AppLogger]
})
export class DownloadFileModule {}
