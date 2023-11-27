import moment from "moment";

import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";

export const formatMoment = () => {
    const isMoment = (date = "", format = FORMAT_MOMENT.DATE_TIME_SLASH_LONG) => moment(date).format(format);
    return { isMoment };
};
