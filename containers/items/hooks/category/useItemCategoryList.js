import apiCategory from "@/Api/apiMaterial/category/apiCategory";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useItemCategoryList = (params) => {
    return useQuery({
        queryKey: ["api_category_list", { ...params }],
        queryFn: async () => {

            const { output, rResult } = await apiCategory.apiListCategory({ params: params });

            return { rResult, output }
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })
}