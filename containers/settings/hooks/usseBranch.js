import apiBranch from "@/Api/apiSettings/apiBranch"
import { optionsQuery } from "@/configs/optionsQuery"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export const useBranchPageList = (params) => {
    return useQuery({
        queryKey: ["api_branch_list", { ...params }],
        queryFn: async () => {
            const { rResult, output } = await apiBranch.apiListBranch({ params: params })
            return { rResult, output }
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })
}