import apiItems from "@/Api/apiMaterial/items/apiItems";
import { reTryQuery } from "@/configs/configRetryQuery";
import { useQuery } from "@tanstack/react-query";

export const useItemList = (params) => {
    return useQuery({
        queryKey: ["api_material", { ...params }],
        queryFn: async () => {
            const { output, rResult } = await apiItems.apiListItems({ params: params });
            return { output, rResult }
        },
        ...reTryQuery
    })

}