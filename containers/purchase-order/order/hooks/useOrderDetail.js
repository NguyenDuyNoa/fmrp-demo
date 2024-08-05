import apiOrder from "@/Api/apiPurchaseOrder/apiOrder"
import { optionsQuery } from "@/configs/optionsQuery"
import { useQuery } from "@tanstack/react-query"

export const useOrderDetail = (open, id) => {
    return useQuery({
        queryKey: ["api_detail_order", id],
        queryFn: async () => {
            const data = await apiOrder.apiDetailOrder(id)
            return data
        },
        ...optionsQuery,
        enabled: open && !!id
    })
}