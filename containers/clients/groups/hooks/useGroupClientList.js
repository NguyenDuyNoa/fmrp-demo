import apiGroup from "@/Api/apiClients/group/apiGroup";
import { reTryQuery } from "@/configs/configRetryQuery";
import { useQuery } from "@tanstack/react-query";

export const useGroupClientList = (params, updateTotalItems) => {
    return useQuery({
        queryKey: ["api_group_client_list", { ...params }],
        queryFn: async () => {

            const { rResult, output } = await apiGroup.apiListGroup({ params: params })

            updateTotalItems(output);

            return { rResult, output }
        },
        ...reTryQuery
    })
}