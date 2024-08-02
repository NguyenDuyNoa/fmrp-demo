import apiVariant from "@/Api/apiSettings/apiVariant"
import { reTryQuery } from "@/configs/configRetryQuery"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export const useVariantList = (params) => {
    return useQuery({
        queryKey: ["api_variant_list", { ...params }],
        queryFn: async () => {
            const { rResult, output } = await apiVariant.apiListVariant({ params: params })
            return { rResult, output }
        },
        placeholderData: keepPreviousData,
        ...reTryQuery
    })
}