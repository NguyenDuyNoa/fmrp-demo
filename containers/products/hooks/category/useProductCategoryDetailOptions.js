import apiCategory from "@/Api/apiProducts/category/apiCategory";
import { useQuery } from "@tanstack/react-query";

export const useProductCategoryDetailOptions = (open, params, id) => {
    return useQuery({
        queryKey: ["api_detail_options_category", { ...params }],
        queryFn: async () => {
            const params = {
                "filter[branch_id][]": branch?.length > 0 ? branch.map((e) => e.value) : 0,
            }
            const { rResult } = await apiCategory.apiDetailOptionCategory(id, { params });

            return rResult.map((x) => ({
                label: x.name,
                value: x.id,
                level: x.level,
            }))
        },
        enabled: open && !!id
    })
}