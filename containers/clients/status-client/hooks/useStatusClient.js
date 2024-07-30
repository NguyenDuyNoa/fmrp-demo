import apiStatus from "@/Api/apiClients/status/apiStatus";
import { reTryQuery } from "@/configs/configRetryQuery";
import { useQuery } from "@tanstack/react-query";

export const useStatusClient = (prams, updateTotalItems) => {
    return useQuery({
        queryKey: ["api_client_status", { ...prams }],
        queryFn: async () => {

            const { rResult, output } = await apiStatus.apiListStatus({ params: prams })

            updateTotalItems(output);

            return { rResult, output }
        },
        ...reTryQuery
    })
}
