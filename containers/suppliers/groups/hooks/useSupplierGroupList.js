import apiGroups from "@/Api/apiSuppliers/groups/apiGroups";
import { reTryQuery } from "@/configs/configRetryQuery";
import { useQuery } from "@tanstack/react-query";

export const useSupplierGroupList = (params, updateTotalItems) => {
    return useQuery({
        queryKey: ["api_groups_suppliers_list", { ...params }],
        queryFn: async () => {

            const { rResult, output } = await apiGroups.apiListGroup({ params: params });

            updateTotalItems(output);
            return { rResult, output }
        },
        ...reTryQuery
    })


}