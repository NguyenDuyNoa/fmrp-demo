import apiDeliveryReceipt from "@/Api/apiSalesExportProduct/deliveryReceipt/apiDeliveryReceipt";
import { reTryQuery } from "@/configs/configRetryQuery";
import { useQuery } from "@tanstack/react-query";

export const useDeliveryReceipDetail = (open, id) => {
    return useQuery({
        queryKey: ["api_delivery_detail", id],
        queryFn: async () => {

            const db = await apiDeliveryReceipt.apiDetail(id)

            return db
        },
        ...reTryQuery,
        enabled: open && !!id
    })

}