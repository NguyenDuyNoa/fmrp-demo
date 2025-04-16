import apiDashboard from "@/Api/apiDashboard/apiDashboard";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useGetTop5Customers = ({ limited = 5, dateStart = "", dateEnd = "" }) => {
    return useQuery({
        queryKey: ["api_get_top_5_customers", { limited, dateStart, dateEnd }],
        queryFn: async () => {
            const res = await apiDashboard.apiGetDashboardTop5Customers({
                params: {
                    limit: limited,
                    date_start: dateStart,
                    date_end: dateEnd
                }
            });

            return {
                ...res.data,
                items: res?.data?.items?.map(e => {
                    return {
                        ...e,
                        total_quantity: +e?.total_quantity
                    }
                })
            }
        },
        placeholderData: keepPreviousData,
        enabled: !!dateStart && !!dateEnd,
        ...optionsQuery
    })

}