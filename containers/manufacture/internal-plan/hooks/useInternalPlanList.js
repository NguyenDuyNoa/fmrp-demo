import apiInternalPlan from "@/Api/apiManufacture/manufacture/internalPlan/apiInternalPlan";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export const useInternalPlanList = (params) => {
    return useQuery({
        queryKey: ["api_internal_plan", { ...params }],
        queryFn: async () => {
            const { data: { rResult, output } } = await apiInternalPlan.apiListInternalPlan({ params: params });
            return { rResult, output }
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })
}