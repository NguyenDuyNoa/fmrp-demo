import apiClient from "@/Api/apiClients/client/apiClient";
import { useQuery } from "@tanstack/react-query";

export const usseClientDetail = (open, id) => {
    return useQuery({
        queryKey: ["api_detail_user", id],
        enabled: open,
        queryFn: async () => {
            const db = await apiClient.apiDetailClient(id)

            return db
        },
    })
}