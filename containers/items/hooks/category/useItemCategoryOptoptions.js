import apiCategory from "@/Api/apiMaterial/category/apiCategory";
import { useQuery } from "@tanstack/react-query";

export const useItemCategoryOptoptions = (open, id) => {
    return useQuery({
        queryKey: ['api_detail_category_option'],
        queryFn: async () => {
            const { rResult } = await apiCategory.apiDetailCategoryOptionCategory(id);
            return rResult.map((x) => ({
                label: `${x.name + " " + "(" + x.code + ")"}`,
                value: x?.id,
                level: x?.level,
                code: x?.code,
                parent_id: x?.parent_id,
            }))
        },
        enabled: open,
    })
}