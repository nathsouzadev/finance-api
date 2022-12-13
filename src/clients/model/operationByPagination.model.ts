import { OperationByDate } from './operationByDate.model';

export interface OperationByPagination {
  totalPages: number;
  page: number;
  nextPage: boolean;
  releases: OperationByDate;
}
