import { calculateDays } from './calculateDays';

describe('calculateDays', () => {
  const mockActualDate = '2022-12-10';
  it('should return the number between input date and actual date when is less than 10', () => {
    const mockInputDate = '2022-12-08';
    expect(calculateDays(mockActualDate, mockInputDate)).toBe(2);
  });

  it('should return the number between input date and actual date when is equal or greather than 10', () => {
    const mockInputDate = '2022-11-22';
    expect(calculateDays(mockActualDate, mockInputDate)).toBe(18);
  });

  it('should return error when date have invalid format', () => {
    const mockInputDate = '2022-11-9';
    expect(() => calculateDays(mockActualDate, mockInputDate)).toThrow(
      'Invalid input date. Inform date with mm-dd-yyyy format',
    );
  });

  it('should return error when date have invalid month', () => {
    const mockInputDate = '2022-14-20';
    expect(() => calculateDays(mockActualDate, mockInputDate)).toThrow(
      'Invalid month. Inform value between 1 and 12',
    );
  });
});
