import apiDashboard from "@/Api/apiDashboard/apiDashboard";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useGetProductionProgressByGroup = ({ limited = 7, dateStart = "", dateEnd = "" }) => {
    return useQuery({
        queryKey: ["api_getproduction_progress_by_group", { limited, dateStart, dateEnd }],
        queryFn: async () => {
            const res = await apiDashboard.apiGetDashboardProductionProgressByGroup({
                params: {
                    limit: limited,
                    date_start: dateStart,
                    date_end: dateEnd
                }
            });
            // return res.data

            return {
                ...res.data,
                items: res?.data?.items?.map(e => {
                    return {
                        ...e,
                        quantity: +e?.quantity,
                        quantity_enter: +e?.quantity_enter
                    }
                })
            }

        },
        placeholderData: keepPreviousData,
        enabled: !!dateStart && !!dateEnd,
        ...optionsQuery
    })

}