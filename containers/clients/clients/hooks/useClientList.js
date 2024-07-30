import apiClient from "@/Api/apiClients/client/apiClient";
import { reTryQuery } from "@/configs/configRetryQuery";
import { useQuery } from "@tanstack/react-query";

export const useClientList = (params) => {
    return useQuery({
        queryKey: ["api_clients", params],
        queryFn: async () => {
            const tab = params["filter[client_group_id]"]

            const url = `/api_web/${tab === "0" || tab === "-1" ? "api_client/client?csrf_protection=true" : "api_client/client/?csrf_protection=true"}`

            const { rResult, output } = await apiClient.apiListClient({ params: params }, url);

            return { rResult, output }
        },
        ...reTryQuery
    });
}

