import apiDashboard from "@/Api/apiDashboard/apiDashboard";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useGetProductionPlan = () => {
    return useQuery({
        queryKey: ["api_get_dashboard_production_plan"],
        queryFn: async () => {
            const res = await apiDashboard.apiGetDashboardProductionPlan({
                params: {
                    limit: 4
                }
            });

            return {
                ...res,
                data: {
                    ...res.data,
                    items: res?.data?.items?.map(e => {
                        return {
                            ...e,
                            quantity: +e?.quantity,
                            quantity_plan: +e?.quantity_plan
                        }
                    })
                }
            }
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })

}