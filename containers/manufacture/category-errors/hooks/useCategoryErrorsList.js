import apiCategoryErrors from "@/Api/apiManufacture/qc/categoryErrors/apiCategoryErrors";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useCategoryErrorsList = (params) => {
    return useQuery({
        queryKey: ['api_category_list_detail_errors', { ...params }],
        queryFn: async () => {
            const { data } = await apiCategoryErrors.apiCategoryErrors({ params });
            const { dtResult, countAll } = data
            return { dtResult, countAll }
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })
}