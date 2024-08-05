import apiCategory from "@/Api/apiProducts/category/apiCategory";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useProductCategory = (params) => {
    return useQuery({
        queryKey: ["api_category", { ...params }],
        queryFn: async () => {
            const { output, rResult } = await apiCategory.apiListCategory({ params });

            return { output, rResult }
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })
}