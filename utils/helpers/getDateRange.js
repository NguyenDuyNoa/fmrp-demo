import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(isoWeek);

export const getDateRangeFromValue = (value) => {
    const now = dayjs();

    const format = (date) => dayjs(date).format("DD/MM/YYYY");

    switch (value) {
        case "today":
            return {
                startDate: format(now.startOf("day")),
                endDate: format(now.endOf("day")),
            };

        case "thisWeek":
            return {
                startDate: format(now.startOf("isoWeek")), // Monday
                endDate: format(now.endOf("isoWeek")),     // Sunday
            };

        case "thisMonth":
            return {
                startDate: format(now.startOf("month")),
                endDate: format(now.endOf("month")),
            };

        case "thisQuarter": {
            const currentMonth = now.month(); // 0-indexed
            const currentQuarter = Math.floor(currentMonth / 3);
            const startMonth = currentQuarter * 3;

            const startDate = dayjs(new Date(now.year(), startMonth, 1));
            const endDate = startDate.add(2, "month").endOf("month");

            return {
                startDate: format(startDate),
                endDate: format(endDate),
            };
        }

        case "thisYear":
            return {
                startDate: format(now.startOf("year")),
                endDate: format(now.endOf("year")),
            };

        default:
            return null;
    }
};
