import apiDashboard from "@/Api/apiDashboard/apiDashboard";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useGetTopProducedProducts = ({ limited = 5, dateStart = "", dateEnd = "" }) => {
    return useQuery({
        queryKey: ["api_get_top_produced_products", { limited, dateStart, dateEnd }],
        queryFn: async () => {
            const res = await apiDashboard.apiGetDashboardTopProducedProducts({
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
                        quantity: +e?.quantity,
                        percent_quantity: +e?.percent_quantity
                    }
                })
            }
        },
        placeholderData: keepPreviousData,
        enabled: !!dateStart && !!dateEnd,
        ...optionsQuery
    })

}