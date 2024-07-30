import apiDeliveryReceipt from "@/Api/apiSalesExportProduct/deliveryReceipt/apiDeliveryReceipt"
import { useQuery } from "@tanstack/react-query"

export const useDeliveryReceipPerson = (params) => {
    return useQuery({
        queryKey: ["api_delivery_receip_staff", { ...params }],
        queryFn: async () => {
            const { rResult } = await apiDeliveryReceipt.apiContactCombobox({ params })

            return rResult?.map((e) => ({ label: e.full_name, value: e.id }))
        }
    })
}