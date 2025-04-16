import apiDashboard from "@/Api/apiDashboard/apiDashboard";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useGetProductStatus = ({ dateStart = "", dateEnd = "" }) => {
    return useQuery({
        queryKey: ["api_get_dashboard_production_status", { dateStart, dateEnd }],
        queryFn: async () => {
            const res = await apiDashboard.apiGetDashboardStatusProduct({
                params: {
                    date_start: dateStart,
                    date_end: dateEnd
                }
            });
            return {
                ...res.data,
                status: res.data.status?.map(e => ({
                    ...e,
                    count: +e.count,
                }))
            };
        },
        placeholderData: keepPreviousData,
        enabled: !!dateEnd && !!dateStart,
        ...optionsQuery
    })

}