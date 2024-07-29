import apiCategory from "@/Api/apiProducts/category/apiCategory";
import { reTryQuery } from "@/configs/configRetryQuery";
import { useQuery } from "@tanstack/react-query";

export const useProductCategory = (params, sTotalItems) => {
    return useQuery({
        queryKey: ["api_category", { ...params }],
        queryFn: async () => {
            const { output, rResult } = await apiCategory.apiListCategory({ params });

            sTotalItems(output);

            return { output, rResult }
        },
        ...reTryQuery
    })
}