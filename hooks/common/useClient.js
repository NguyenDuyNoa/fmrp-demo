import apiContact from "@/Api/apiClients/contact/apiContact";
import apiComons from "@/Api/apiComon/apiComon";
import { reTryQuery } from "@/configs/configRetryQuery";
import { useQuery } from "@tanstack/react-query";
export const useClientCombobox = (search) => {
    return useQuery({
        queryKey: ["api_client_combobox", search],
        queryFn: async () => {

            const { data } = await apiComons.apiSearchClient({
                params: {
                    search: search ? search : "",
                    limit: 0,
                }
            })
            return data?.clients?.map((e) => ({ label: e.name, value: e.id }))
        }
    })
}


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

export const useClientByBranch = (value) => {
    return useQuery({
        queryKey: ["api_client_by_branch", value],
        queryFn: async () => {

            const { rResult } = await apiContact.apiClientContact({
                params: {
                    "filter[branch_id]": value != null ? value?.value : null,
                }
            });
            return rResult?.map((e) => ({ label: e?.name, value: e?.id })) || [];
        },
        enabled: !!value,
        ...reTryQuery
    });
}