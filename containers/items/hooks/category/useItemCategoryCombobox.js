import apiCategory from "@/Api/apiMaterial/category/apiCategory";
import { reTryQuery } from "@/configs/configRetryQuery";
import { useQuery } from "@tanstack/react-query";

export const useItemCategoryCombobox = () => {
    return useQuery({
        queryKey: ["api_category_option_combobox"],
        queryFn: async () => {

            const { rResult } = await apiCategory.apiCategoryOptionCategory({});

            return rResult.map((x) => ({
                label: `${x.name + " " + "(" + x.code + ")"}`,
                value: x.id,
                level: x.level,
                code: x.code,
                parent_id: x.parent_id,
            })) || []
        },
        ...reTryQuery
    })
}