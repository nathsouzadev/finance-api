import { ConsoleLogger, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IncomingHttpHeaders } from 'http';

interface DataLogger {
  headers?: IncomingHttpHeaders,
  message: string
}

@Injectable()
export class AppLogger extends ConsoleLogger {
  logger = (data: DataLogger, context: string) => {
    if(Object.keys(data).includes('headers')){
      global.correlationId = data.headers['x-correlation-id'] ?? randomUUID();
    }

    const { message } = data
    this.log(JSON.stringify({ correlationId: global.correlationId, message }), context);
  };

  errors = (error: string, context: string) => {
    this.error(JSON.stringify({ correlationId: global.correlationId, error }), context);
  }
}
