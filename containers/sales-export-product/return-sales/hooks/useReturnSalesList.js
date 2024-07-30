import apiReturnSales from "@/Api/apiSalesExportProduct/returnSales/apiReturnSales";
import { reTryQuery } from "@/configs/configRetryQuery";
import { useQuery } from "@tanstack/react-query";

export const useReturnSalesList = (params) => {
    return useQuery({
        queryKey: ["api_list_return_sales", { ...params }],
        queryFn: async () => {
            const { rResult, output, rTotal } = await apiReturnSales.apiListReturnSales({ params })

            return { rResult, output, rTotal }
        },
        ...reTryQuery
    })
}