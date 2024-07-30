import apiComons from "@/Api/apiComon/apiComon";
import { reTryQuery } from "@/configs/configRetryQuery";
import { useQuery } from "@tanstack/react-query";

export const useClientComboboxByBranch = (params) => {
    return useQuery({
        queryKey: ["api_search_clients_by_branch", { ...params }],
        queryFn: async () => {

            const { data } = await apiComons.apiSearchClient({ ...params });

            if (!params?.branch_id) return []

            return data?.clients?.map((e) => ({ label: e.name, value: e.id }))
        },
        ...reTryQuery
    })
}

export const useClientComboboxByFilterBranch = (id, params) => {
    return useQuery({
        queryKey: ["api_search_clients_by_branch_filter", { ...params }],
        queryFn: async () => {
            const { rResult } = await apiComons.apiSearcClientFilterByBranch({ params });

            return id ? rResult?.map((e) => ({ label: e.name, value: e.id })) : []
        },
        ...reTryQuery
    })
}