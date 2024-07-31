import apiPurchases from "@/Api/apiPurchaseOrder/apiPurchases";
import { reTryQuery } from "@/configs/configRetryQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const usePurchasesList = (params) => {
    return useQuery({
        queryKey: ["api_List_purchases", { ...params }],
        queryFn: async () => {
            const { output, rResult } = await apiPurchases.apiListPurchases({ params })

            return { output, rResult }
        },
        ...reTryQuery
    })
}

export const usePurchasesListCode = () => {
    return useQuery({
        queryKey: ["api_List_purchases_code"],
        queryFn: async () => {
            const { output, rResult } = await apiPurchases.apiListPurchases({})

            return rResult?.map((e) => ({ label: e.code, value: e.id || [] }))
        },
        ...reTryQuery
    })
}