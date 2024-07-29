import apiRoles from "@/Api/apiPersonnel/apiRoles";
import { useQuery } from "@tanstack/react-query";

export const useRolesList = (params, sTotalItems) => {
    return useQuery({
        queryKey: ['api_list_roles', { ...params }],
        queryFn: async () => {

            const { output, rResult } = await apiRoles.apiListRoles({ params })

            sTotalItems(output);

            return rResult
        }
    })
}