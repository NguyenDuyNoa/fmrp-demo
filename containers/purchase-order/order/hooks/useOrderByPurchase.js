import apiOrder from "@/Api/apiPurchaseOrder/apiOrder";
import { optionsQuery } from "@/configs/optionsQuery";
import { useQuery } from "@tanstack/react-query";

export const useOrderByPurchase = (params, options) => {
    return useQuery({
        queryKey: ["api_data_option_not_complete", { ...params }],
        queryFn: async () => {
            const db = await apiOrder.apiOptionNotComplete({ params: params })

            return db?.map((e) => { return { label: e.code, value: e.id } })
        },
        ...optionsQuery,
        enabled: !!options == "1"
    })
}