import apiReturns from "@/Api/apiPurchaseOrder/apiReturns";
import { reTryQuery } from "@/configs/configRetryQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useReturnFilterbar = (newParam) => {
    return useQuery({
        queryKey: ["api_returns_filterbar", { ...newParam }],
        queryFn: async () => {
            const data = await apiReturns.apiListFilterBar({ params: newParam });
            return data
        },
        placeholderData: keepPreviousData,
        ...reTryQuery
    })
}