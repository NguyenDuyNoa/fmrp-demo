import apiItems from "@/Api/apiMaterial/items/apiItems";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useItemList = (params) => {
    return useQuery({
        queryKey: ["api_material", { ...params }],
        queryFn: async () => {
            const { output, rResult } = await apiItems.apiListItems({ params: params });
            return { output, rResult }
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })

}