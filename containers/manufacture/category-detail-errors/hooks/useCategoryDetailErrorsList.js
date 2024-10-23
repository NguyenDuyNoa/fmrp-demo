import apiCategoryDetailErrors from "@/Api/apiManufacture/qc/categoryDetailErrors/apiCategoryDetailErrors";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useCategoryDetailErrorsList = (params) => {
    return useQuery({
        queryKey: ['api_category_list_detail_errors', { ...params }],
        queryFn: async () => {
            const { data } = await apiCategoryDetailErrors.apiListDetailError({ params });
            const { dtResult, countAll } = data
            return { dtResult, countAll }
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })
}