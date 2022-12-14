import { BadRequestException, Controller, Get, Param, Query, Req, Res, ValidationPipe } from '@nestjs/common';
import { Request, Response } from 'express';
import { promises as fs } from 'fs';
import { calculateDays } from '../utils/calculateDays';
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
    const today = new Date().toISOString().split('T')[0];
    if(calculateDays(today, query.end_date) > 90){
      throw new BadRequestException('Invalid date interval. To get operations before 90 days go to /:id/old-releases')
    }

    return this.clientsService.getOperationsByPagination(
      id,
      query.start_date,
      query.end_date,
      query.page ?? 1
    )
  }

  @Get(':id/old-releases')
  async downloadRelease(
    @Res() response: Response,
    @Req() request: Request,
    @Param('id') id: string
  ) {
    const fileContent = 'This is the content of the text file.';
    const fileName = 'my-file.txt';
    
    await fs.writeFile('my-file.txt', fileContent);

    return response.download(fileName)
  }
}
