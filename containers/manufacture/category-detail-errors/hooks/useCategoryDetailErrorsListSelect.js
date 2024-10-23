import apiCategoryDetailErrors from "@/Api/apiManufacture/qc/categoryDetailErrors/apiCategoryDetailErrors";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useCategoryDetailErrorsListSelect = (params) => {
    return useQuery({
        queryKey: ['api_category_detail_errors_select', { ...params }],
        queryFn: async () => {
            const { data } = await apiCategoryDetailErrors.apiCategoryDetailError({ params });
            return data?.dtResult?.map((e) => ({
                label: e?.name,
                value: e?.id,
                branchId: e?.branch_id,
            }))
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })
}