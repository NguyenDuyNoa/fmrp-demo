import apiCategory from "@/Api/apiProducts/category/apiCategory";
import { useQuery } from "@tanstack/react-query";

export const useCategoryOptions = () => {
    return useQuery({
        queryKey: ["api_category_options"],
        queryFn: async () => {

            const { rResult } = await apiCategory.apiOptionCategory({});

            return rResult?.map((e) => ({
                label: `${e.name + " " + "(" + e.code + ")"}`,
                value: e.id,
                level: e.level,
                code: e.code,
                parent_id: e.parent_id,
            }))
        }
    })
}