import apiGroup from "@/Api/apiClients/group/apiGroup";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useGroupClientList = (params) => {
    return useQuery({
        queryKey: ["api_group_client_list", { ...params }],
        queryFn: async () => {

            const { rResult, output } = await apiGroup.apiListGroup({ params: params })

            return { rResult, output }
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })
}