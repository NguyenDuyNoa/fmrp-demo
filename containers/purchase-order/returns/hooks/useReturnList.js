import apiReturns from "@/Api/apiPurchaseOrder/apiReturns";
import { reTryQuery } from "@/configs/configRetryQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useReturnList = (params) => {
    return useQuery({
        queryKey: ["api_returns", { ...params }],
        queryFn: async () => {
            const { rResult, output, rTotal } = await apiReturns.apiListReturns({ params });

            return { rResult, output, rTotal }
        },
        placeholderData: keepPreviousData,
        ...reTryQuery
    })
}