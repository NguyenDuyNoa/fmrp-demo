import apiVariant from "@/Api/apiSettings/apiVariant"
import { optionsQuery } from "@/configs/optionsQuery"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export const useVariantList = (params) => {
    return useQuery({
        queryKey: ["api_variant_list", { ...params }],
        queryFn: async () => {
            const { rResult, output } = await apiVariant.apiListVariant({ params: params })
            return { rResult, output }
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })
}