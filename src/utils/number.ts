const parseStringToInt = (number: any, defaultValue = 0) : number => {
  const parsedNumber = Math.abs(parseInt(number));

  return isNaN(parsedNumber) ? defaultValue : parsedNumber;
};


export default {
  parseStringToInt
};
