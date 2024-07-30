import apiComons from "@/Api/apiComon/apiComon";
import { reTryQuery } from "@/configs/configRetryQuery";
import { useQuery } from "@tanstack/react-query";

export const useClientComboboxByBranch = (params) => {
    return useQuery({
        queryKey: ["api_search_clients_by_branch", { ...params }],
        queryFn: async () => {


            const { data } = await apiComons.apiSearchClient({ params });

            if (!params?.branch_id) return []

            return data?.clients?.map((e) => ({ label: e.name, value: e.id }))
        },
        ...reTryQuery
    })
}