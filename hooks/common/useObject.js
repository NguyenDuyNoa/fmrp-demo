import apiComons from "@/Api/apiComon/apiComon";
import { optionsQuery } from "@/configs/optionsQuery";
import { useQuery } from "@tanstack/react-query";

// đối tượng
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
// danh sách đối tượng
export const useObjectList = (dataLang, idBranch, idObject) => {
    return useQuery({
        queryKey: ['api_object_list', idBranch, idObject],
        queryFn: async () => {
            const { rResult } = await apiComons.apiObjectList({
                params: {
                    type: idObject?.value,
                    "filter[branch_id]": idBranch?.value,
                }
            });
            return rResult?.map((e) => ({ label: dataLang[e?.name] || e?.name, value: e?.staffid || e?.id })) || []
        },
        enabled: !!idObject,
        ...optionsQuery
    })
}