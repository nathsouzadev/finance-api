export const calculateDays = (
  actualDate: string,
  inputDate: string,
): number => {
   if ( !validateDateFormat(actualDate) || !validateDateFormat(inputDate) ) {
    throw new Error('Invalid input date. Inform date with mm-dd-yyyy format');
  }

  const actual = new Date(actualDate);
  const input = new Date(inputDate);
  const difDate = (actual.getTime() - input.getTime()) / (1000 * 3600 * 24);
  return difDate;
};

const validateDateFormat = (date: string): boolean => {
  const dateToValidate = date.split('-');
  if(Number(dateToValidate[1]) < 1 || Number(dateToValidate[1]) > 12){
    throw new Error('Invalid month. Inform value between 1 and 12');
  }

  if (
    dateToValidate[2].length !== 2 ||
    dateToValidate[1].length !== 2 ||
    dateToValidate[0].length !== 4
  ) {
    return false;
  }
  return true;
};
