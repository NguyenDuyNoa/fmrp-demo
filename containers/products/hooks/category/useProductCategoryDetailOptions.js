import apiCategory from "@/Api/apiProducts/category/apiCategory";
import { useQuery } from "@tanstack/react-query";

export const useProductCategoryDetailOptions = (open, params, id) => {
    return useQuery({
        queryKey: ["api_detail_options_category", { ...params }],
        queryFn: async () => {
            const payLoad = {
                "filter[branch_id][]": params?.branch?.length > 0 ? params?.branch.map((e) => e.value) : 0,
            }

            const { rResult } = await apiCategory.apiDetailOptionCategory(id, { params: payLoad });

            return rResult.map((x) => ({
                label: x.name,
                value: x.id,
                level: x.level,
            }))
        },
        enabled: open && !!id
    })
}