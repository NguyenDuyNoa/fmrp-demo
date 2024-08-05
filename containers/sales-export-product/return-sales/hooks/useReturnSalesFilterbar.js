import apiReturnSales from "@/Api/apiSalesExportProduct/returnSales/apiReturnSales";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useReturnSalesFilterbar = (params) => {
    return useQuery({
        queryKey: ["api_list_filter_bar", { ...params }],
        queryFn: async () => {
            const data = await apiReturnSales.apiListFilterBar({ params })
            return data
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })
}