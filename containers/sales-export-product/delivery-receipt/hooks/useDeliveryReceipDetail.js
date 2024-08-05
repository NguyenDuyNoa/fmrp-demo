import apiDeliveryReceipt from "@/Api/apiSalesExportProduct/deliveryReceipt/apiDeliveryReceipt";
import { optionsQuery } from "@/configs/optionsQuery";
import { useQuery } from "@tanstack/react-query";

export const useDeliveryReceipDetail = (open, id) => {
    return useQuery({
        queryKey: ["api_delivery_detail", id],
        queryFn: async () => {

            const db = await apiDeliveryReceipt.apiDetail(id)

            return db
        },
        ...optionsQuery,
        enabled: open && !!id
    })

}