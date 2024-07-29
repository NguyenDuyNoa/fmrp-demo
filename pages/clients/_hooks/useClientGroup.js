import apiClient from "@/Api/apiClients/client/apiClient";
import { reTryQuery } from "@/configs/configRetryQuery";
import { useQuery } from "@tanstack/react-query";

export const useClientGroup = (params) => {
    const newParam = {
        ...params,
        page: undefined,
        "filter[client_group_id]": undefined
    }
    return useQuery({
        queryKey: ["api_client_group", { ...params }],
        queryFn: async () => {
            const { rResult } = await apiClient.apiListGroupClient({ params: newParam });

            return rResult || []
        },
        ...reTryQuery
    });
}