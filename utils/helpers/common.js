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

export { convertArrayToObject, parseStringToArray, parseStringToObject, parseArrayToString };
