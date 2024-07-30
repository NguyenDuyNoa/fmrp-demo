import apiSalesOrder from "@/Api/apiSalesExportProduct/salesOrder/apiSalesOrder";
import { reTryQuery } from "@/configs/configRetryQuery";
import { useQuery } from "@tanstack/react-query";

export const useSalesOrderFilterbar = (params) => {
    return useQuery({
        queryKey: ["api_list_filterbar", { ...params }],
        queryFn: async () => {

            const data = await apiSalesOrder.apiListFilterbar({ params })

            return data
        },
        ...reTryQuery
    })
}