import apiClient from "@/Api/apiClients/client/apiClient";
import { useQuery } from "@tanstack/react-query";

export const useClientGroupClient = (key) => {
    return useQuery({
        queryKey: ["api_client_group_client", key],
        queryFn: async () => {

            const params = {
                "filter[branch_id]": key?.length > 0 ? key?.map((e) => e.value) : -1,
            }

            const { rResult } = await apiClient.apiGroupClient({ params: params })

            return rResult?.map((e) => ({
                label: e.name,
                value: e.id,
            })) || []
        },
    })
}