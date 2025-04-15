import apiDashboard from "@/Api/apiDashboard/apiDashboard";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useGetProductionPlan = ({ limited = 5, dateStart = "", dateEnd = "" }) => {
    return useQuery({
        queryKey: ["api_get_dashboard_production_plan", { limited, dateStart, dateEnd }],
        queryFn: async () => {
            const res = await apiDashboard.apiGetDashboardProductionPlan({
                params: {
                    limit: limited,
                    date_start: dateStart,
                    date_end: dateEnd
                }
            });
            return {
                ...res.data,
                items: res.data.items?.map(e => ({
                    ...e,
                    quantity: +e.quantity,
                    quantity_plan: +e.quantity_plan
                }))
            };


            // return {
            //     ...res,
            //     data: {
            //         ...res.data,
            //         items: res?.data?.items?.map(e => {
            //             return {
            //                 ...e,
            //                 quantity: +e?.quantity,
            //                 quantity_plan: +e?.quantity_plan
            //             }
            //         })
            //     }
            // }
        },
        placeholderData: keepPreviousData,
        enabled: !!dateEnd && !!dateStart,
        ...optionsQuery
    })

}