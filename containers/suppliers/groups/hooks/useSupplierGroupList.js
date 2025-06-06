import apiGroups from "@/Api/apiSuppliers/groups/apiGroups";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useSupplierGroupList = (params) => {
    return useQuery({
        queryKey: ["api_groups_suppliers_list", { ...params }],
        queryFn: async () => {

            const { rResult, output } = await apiGroups.apiListGroup({ params: params });

            return { rResult, output }
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })


}