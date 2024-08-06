import apiInternalPlan from "@/Api/apiManufacture/manufacture/internalPlan/apiInternalPlan";
import { optionsQuery } from "@/configs/optionsQuery";
import { useQuery } from "@tanstack/react-query";

export const useInternalPlanDetail = (open, id) => {
    return useQuery({
        queryKey: ["api_internal_plan_detail", id],
        queryFn: async () => {
            const { data } = await apiInternalPlan.apiDetailInternalPlan(id);
            return data
        },
        enabled: open && !!id,
        ...optionsQuery
    })
}