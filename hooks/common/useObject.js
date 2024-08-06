import apiComons from "@/Api/apiComon/apiComon";
import { optionsQuery } from "@/configs/optionsQuery";
import { useQuery } from "@tanstack/react-query";

export const useObject = (dataLang) => {
    return useQuery({
        queryKey: ['api_object'],
        queryFn: async () => {
            const data = await apiComons.apiListObject();
            return data?.map((e) => ({ label: dataLang[e?.name], value: e?.id })) || []
        },
        ...optionsQuery
    })
}

export const useObjectList = (dataLang, idBranch, object) => {
    return useQuery({
        queryKey: ['api_object_list', idBranch, object],
        queryFn: async () => {
            const { rResult } = await apiComons.apiObjectList({
                params: {
                    type: object?.value,
                    "filter[branch_id]": idBranch?.value,
                }
            });
            return rResult?.map((e) => ({ label: dataLang[e?.name] || e?.name, value: e?.staffid })) || []
        },
        enabled: !!object,
        ...optionsQuery
    })
}