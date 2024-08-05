import apiRoles from "@/Api/apiPersonnel/apiRoles";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useRolesList = (params) => {
    return useQuery({
        queryKey: ['api_list_roles', { ...params }],
        queryFn: async () => {

            const { output, rResult } = await apiRoles.apiListRoles({ params })

            return { output, rResult }
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })
}