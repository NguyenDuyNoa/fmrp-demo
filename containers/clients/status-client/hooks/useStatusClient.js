import apiStatus from "@/Api/apiClients/status/apiStatus";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useStatusClient = (prams) => {
    return useQuery({
        queryKey: ["api_client_status", { ...prams }],
        queryFn: async () => {

            const { rResult, output } = await apiStatus.apiListStatus({ params: prams })

            return { rResult, output }
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })
}
