import { calculateDays } from './calculateDays';

describe('calculateDays', () => {
  const mockActualDate = '12-10-2022';
  it('should return the number between input date and actual date when is less than 10', () => {
    const mockInputDate = '12-08-2022';
    expect(calculateDays(mockActualDate, mockInputDate)).toBe(2);
  });

  it('should return the number between input date and actual date when is equal or greather than 10', () => {
    const mockInputDate = '11-22-2022';
    expect(calculateDays(mockActualDate, mockInputDate)).toBe(18);
  });

  it('should return error when date have invalid format', () => {
    const mockInputDate = '11-9-2022';
    expect(() => calculateDays(mockActualDate, mockInputDate)).toThrow(
      'Invalid input date. Inform date with mm-dd-yyyy format',
    );
  });
});
