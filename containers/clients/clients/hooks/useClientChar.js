import apiClient from "@/Api/apiClients/client/apiClient"
import { useQuery } from "@tanstack/react-query"

export const useClientChar = (isState) => {
    return useQuery({
        queryKey: ["api_char_client", isState.valueBr],
        queryFn: async () => {

            const params = {
                "brach_id[]": isState?.valueBr?.map((e) => e.value),
                staffid: isState?.valueBr ? isState?.valueBr?.map((e) => e?.value) : -1,
            }

            const db = await apiClient.apiCharClient({ params: params })

            return db?.map((e) => ({
                label: e?.name,
                value: e?.staffid,
            })) || []
        },
    })
}