import apiCategory from "@/Api/apiMaterial/category/apiCategory";
import { useQuery } from "@tanstack/react-query";

export const useItemCategoryOptions = (params) => {
    return useQuery({
        queryKey: ['api_category_option', { ...params }],
        queryFn: async () => {
            const { rResult } = await apiCategory.apiCategoryOptionCategory({ params: params })
            const newData = rResult?.map((x) => ({
                label: `${x.name + " " + "(" + x.code + ")"}`,
                value: x?.id,
                level: x?.level,
                code: x?.code,
                parent_id: x?.parent_id,
            }))
            return newData
        }
    })
}