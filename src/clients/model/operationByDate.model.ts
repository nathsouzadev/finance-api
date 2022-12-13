export type OperationByDate = Record<string, OperationModel[]>

interface OperationModel {
  description: string;
  value: number;
}
