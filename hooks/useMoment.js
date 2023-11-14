import moment from "moment";

export const useMoment = (date, format = "DD/MM/YYYY HH:mm:ss") => {
    return moment(date).format(format);
};
