import { Module } from '@nestjs/common';
import { DownloadFileService } from './downloadFile.service';

@Module({
  providers: [DownloadFileService]
})
export class DownloadFileModule {}
