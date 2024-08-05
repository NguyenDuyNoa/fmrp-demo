import apiDeliveryReceipt from "@/Api/apiSalesExportProduct/deliveryReceipt/apiDeliveryReceipt";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useDeliveryReceiptList = (params) => {
    return useQuery({
        queryKey: ['api_list_deleivery', { ...params }],
        queryFn: async () => {
            const { data: { rResult, output, rTotal } } = await apiDeliveryReceipt.apiListDeliveryReceipt({ params: params })

            return { rResult, output, rTotal }
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })
}