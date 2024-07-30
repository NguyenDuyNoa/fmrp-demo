import apiDeliveryReceipt from "@/Api/apiSalesExportProduct/deliveryReceipt/apiDeliveryReceipt";
import { reTryQuery } from "@/configs/configRetryQuery";
import { useQuery } from "@tanstack/react-query";

export const useDeliveryReceiptFilterbar = (params) => {
    return useQuery({
        queryKey: ['api_list_filter_bar', { ...params }],
        queryFn: async () => {
            const { data } = await apiDeliveryReceipt.apiListFilterBar({
                ...params,
                limit: 0,
            })
            return data?.status
        },
        ...reTryQuery
    })
}