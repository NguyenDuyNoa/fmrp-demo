import apiOrder from "@/Api/apiPurchaseOrder/apiOrder";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useOrderFilterbar = (params) => {
    return useQuery({
        queryKey: ["api_order_list_filter_bar", { ...params }],
        queryFn: async () => {
            const data = await apiOrder.apiListFilterBar({ params });
            return data
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })
}