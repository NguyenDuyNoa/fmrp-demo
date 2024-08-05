import apiFinance from "@/Api/apiSettings/apiFinance";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export const useFinanceList = (url, params) => {
    return useQuery({
        queryKey: ["api_finance", { ...params }],
        queryFn: async () => {
            const { rResult, output } = await apiFinance.apiListFinance(url, { params: params })
            return { rResult, output }
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })
}