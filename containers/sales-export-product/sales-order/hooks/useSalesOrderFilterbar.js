import apiSalesOrder from "@/Api/apiSalesExportProduct/salesOrder/apiSalesOrder";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useSalesOrderFilterbar = (params) => {
    return useQuery({
        queryKey: ["api_list_filterbar", { ...params }],
        queryFn: async () => {

            const data = await apiSalesOrder.apiListFilterbar({ params })

            return data
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })
}