import apiPrefix from "@/Api/apiSettings/apiPrefix"
import { optionsQuery } from "@/configs/optionsQuery"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export const usePrefixesList = () => {
    return useQuery({
        queryKey: ["api_prefixes"],
        queryFn: async () => {
            const { rResult } = await apiPrefix.apiListPrefix()
            return { rResult }
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })
}