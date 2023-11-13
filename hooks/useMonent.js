import moment from "moment";

// Hàm format sử dụng Moment
export const formatDate = (date, format = "DD/MM/YYYY HH:mm:ss") => {
    return moment(date).format(format);
};
