import moment from "moment";

import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";

export const formatMoment = (date = "", format = FORMAT_MOMENT.DATE_TIME_SLASH_LONG) => {
    const isMoment = () => moment(date).format(format);
    return { isMoment };
};
