import apiPurchases from "@/Api/apiPurchaseOrder/apiPurchases"
import { useQuery } from "@tanstack/react-query"

export const useDeliveryReceipStaff = (params) => {
    return useQuery({
        queryKey: ["api_delivery_receip_staff", { ...params }],
        queryFn: async () => {
            const { rResult } = await apiPurchases.apiStaffOptionPurchases({ params: params })
            return rResult?.map((e) => ({ label: e.name, value: e.staffid }))
        }
    })
}