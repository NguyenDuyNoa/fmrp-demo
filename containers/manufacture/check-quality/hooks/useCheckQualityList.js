import apiCategoryErrors from "@/Api/apiManufacture/qc/categoryErrors/apiCategoryErrors";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useCheckQualityList = (params) => {
    return useQuery({
        queryKey: ['api_category_errors', { ...params }],
        queryFn: async () => {
            // const { data } = await apiCategoryErrors.apiCategoryErrors({ params: params });
            // console.log("data", data);

            // const { dtResult, countAll } = data
            return { dtResult: [], countAll: 0 }
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })
}