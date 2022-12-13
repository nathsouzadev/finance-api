import { IsString, IsNotEmpty } from 'class-validator';

export class QueryDTO {
  @IsString()
  @IsNotEmpty({ message: 'field required' })
  start_date: string;

  @IsString()
  @IsNotEmpty({ message: 'field required' })
  end_date: string;

  page?: number;
}
