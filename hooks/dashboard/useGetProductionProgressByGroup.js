import apiDashboard from "@/Api/apiDashboard/apiDashboard";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useGetProductionProgressByGroup = () => {
    return useQuery({
        queryKey: ["api_getproduction_progress_by_group"],
        queryFn: async () => {
            const res = await apiDashboard.apiGetDashboardProductionProgressByGroup({
                params: {
                    limit: 8
                }
            });
            return res
        },
        //     return {
        //         ...res,
        //         data: {
        //             ...res.data,
        //             items: res?.data?.items?.map(e => {
        //                 return {
        //                     ...e,
        //                     type: e?.item_name,
        //                     value: +e?.quantity,
        //                 }
        //             })
        //         }
        //     }
        // },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })

}