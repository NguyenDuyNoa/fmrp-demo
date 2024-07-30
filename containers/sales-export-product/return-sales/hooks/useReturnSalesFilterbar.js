import apiReturnSales from "@/Api/apiSalesExportProduct/returnSales/apiReturnSales";
import { reTryQuery } from "@/configs/configRetryQuery";
import { useQuery } from "@tanstack/react-query";

export const useReturnSalesFilterbar = (params) => {
    return useQuery({
        queryKey: ["api_list_filter_bar", { ...params }],
        queryFn: async () => {
            const data = await apiReturnSales.apiListFilterBar({ params })
            return data
        },
        ...reTryQuery
    })
}