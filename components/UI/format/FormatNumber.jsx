export const FormatNumberToThousands = (number) => {
    if (number >= 1000 && number < 1000000) {
        return (number / 1000).toFixed(0) + "k";
    } else if (number >= 1000000) {
        return (number / 1000000).toFixed(0) + "M";
    } else {
        return number.toString();
    }
}

export const FormatNumberComma = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
export const FormatNumberDot = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

export const FormatNumberHundred = (number) => {
    if (number >= 100) {
        return '99+';
    } else {
        return number.toString()
    }
}