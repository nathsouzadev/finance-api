import { Controller, Get, Param, Query, Req, ValidationPipe } from '@nestjs/common';
import { Request } from 'express';
import { QueryDTO } from './dto/query.dto';
import { ClientsService } from './service/clients.service';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get(':id')
  async getBallance(
    @Req() request: Request,
    @Param('id') id: string
  ) {
    const { balance } = await this.clientsService.getBalance(id)
    return {
      balance,
      date: new Date().toISOString()
    }
  }

  @Get(':id/releases')
  async getReleases(
    @Req() request: Request,
    @Param('id') id: string,
    @Query(new ValidationPipe()) query: QueryDTO
  ) {
    return this.clientsService.getOperationsByPagination(
      id,
      query.start_date,
      query.end_date,
      query.page ?? 1
    )
  }
}
