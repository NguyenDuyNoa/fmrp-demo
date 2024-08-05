import apiOrder from "@/Api/apiPurchaseOrder/apiOrder";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useOrderList = (params) => {
    return useQuery({
        queryKey: ["api_list_order", { ...params }],
        queryFn: async () => {
            const { rResult, output, rTotal } = await apiOrder.apiListOrder({ params });

            return { rResult, output, rTotal }
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })
}

export const useOrderListCode = () => {
    return useQuery({
        queryKey: ["api_list_order"],
        queryFn: async () => {
            const { rResult, output, rTotal } = await apiOrder.apiListOrder({});

            return rResult?.map((e) => ({ label: e.code, value: e.id }))
        },
        ...optionsQuery
    })
}