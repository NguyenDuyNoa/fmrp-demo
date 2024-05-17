

const formatNumber = (number, dataSeting, _d = 0) => {
  if (isNaN(number)) {
    return 0
  }
  if (typeof number != 'number' || isNaN(number)) {
    console.error('Invalid number:', number);

    return '0';
  }


  let formattedNumber;

  if (!_d) {
    _d = dataSeting?.decimals_number;
  }

  if (dataSeting?.remove_decimals_on_zero == 1 && number % 1 == 0) {
    _d = 0
  }

  let code = "en-US";

  if (dataSeting?.thousand_separator == '.' && dataSeting?.decimal_separator == ',') {
    code = "de-DE";
  }

  formattedNumber = new Intl.NumberFormat(code, {
    style: 'decimal', // Specify the style of formatting
    maximumFractionDigits: _d, // Specify the maximum number of fraction digits
    minimumFractionDigits: _d, // Specify the minimum number of fraction digits
    useGrouping: true, // Enable grouping separators
  }).format(number);
  // formattedNumber = number.toFixed(_d).replace(/\B(?=(\d{3})+(?!\d))/g, dataSeting?.thousand_separator).replace('.', dataSeting?.decimal_separator);
  return formattedNumber;
};
export default formatNumber



// const formatNumber = (number) => {
//   if (!number && number !== 0) return 0;
//   const integerPart = Math.floor(number);
//   const decimalPart = number - integerPart;
//   const roundedDecimalPart = decimalPart >= 0.05 ? 1 : 0;
//   const roundedNumber = integerPart + roundedDecimalPart;
//   return roundedNumber.toLocaleString("en");
// };

// export default formatNumber;
