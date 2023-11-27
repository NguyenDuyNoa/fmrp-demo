const formatNumber = (number) => {
  if (!number && number !== 0) return 0;
  const integerPart = Math.floor(number);
  const decimalPart = number - integerPart;
  const roundedDecimalPart = decimalPart >= 0.05 ? 1 : 0;
  const roundedNumber = integerPart + roundedDecimalPart;
  return roundedNumber.toLocaleString("en");
};

export default formatNumber;
