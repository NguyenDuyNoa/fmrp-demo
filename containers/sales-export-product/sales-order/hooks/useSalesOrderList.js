import apiSalesOrder from "@/Api/apiSalesExportProduct/salesOrder/apiSalesOrder"
import { optionsQuery } from "@/configs/optionsQuery"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export const useSalesOrderList = (params) => {
    return useQuery({
        queryKey: ["api_list_sales_order", { ...params }],
        queryFn: async () => {
            const { rResult, output, rTotal } = await apiSalesOrder.apiListSalesOrder({ params })


            return { rResult: rResult?.map((e) => ({ ...e, show: false })), output, rTotal }
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })
}