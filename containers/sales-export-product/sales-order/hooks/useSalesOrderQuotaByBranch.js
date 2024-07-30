import apiSalesOrder from "@/Api/apiSalesExportProduct/salesOrder/apiSalesOrder";
import { reTryQuery } from "@/configs/configRetryQuery";
import { useQuery } from "@tanstack/react-query";

export const useSalesOrderQuotaByBranch = (params) => {
    return useQuery({
        queryKey: ["api_quotation", { ...params }],
        queryFn: async () => {
            const { result } = await apiSalesOrder.apiQuotationNotOrdered({ params });

            return result?.map((e) => ({
                label: e.reference_no,
                value: e.id,
            }))
        },
        ...reTryQuery
    })
}