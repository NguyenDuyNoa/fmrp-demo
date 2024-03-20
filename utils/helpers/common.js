import { ERROR_DISCOUNT_MAX } from "@/constants/errorStatus/errorStatus";
import useToast from "@/hooks/useToast";
const isShow = useToast()
const convertArrayToObject = (array, key) => {
    const initialValue = {};
    return array.reduce((obj, item) => {
        return {
            ...obj,
            [item[key]]: item,
        };
    }, initialValue);
};

const parseArrayToString = (array) => array.join(",");

const parseStringToArray = (str) => str.split(",");

const parseStringToObject = (str) => {
    const keys = str.split(",");
    return keys.reduce((acc, cur) => {
        acc[cur] = true;
        return acc;
    }, {});
};


const isAllowedDiscount = (values) => {
    const { floatValue } = values;
    if (floatValue === 0) {
        return true;
    }
    if (floatValue > 100) {
        isShow("error", ERROR_DISCOUNT_MAX);
        return false;
    }
    return true;
}

const isAllowedNumber = (values) => {
    const { floatValue } = values;
    if (floatValue == 0) {
        return true;
    } else {
        return true;
    }
}



export {
    isAllowedDiscount,
    isAllowedNumber,
    convertArrayToObject,
    parseStringToArray,
    parseStringToObject,
    parseArrayToString
};
