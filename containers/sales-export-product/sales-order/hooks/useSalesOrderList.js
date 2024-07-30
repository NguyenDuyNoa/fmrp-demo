import apiSalesOrder from "@/Api/apiSalesExportProduct/salesOrder/apiSalesOrder"
import { reTryQuery } from "@/configs/configRetryQuery"
import { useQuery } from "@tanstack/react-query"

export const useSalesOrderList = (params) => {
    return useQuery({
        queryKey: ["api_list_sales_order", { ...params }],
        queryFn: async () => {
            const { rResult, output, rTotal } = await apiSalesOrder.apiListSalesOrder({ params })


            return { rResult: rResult?.map((e) => ({ ...e, show: false })), output, rTotal }
        },
        ...reTryQuery
    })
}