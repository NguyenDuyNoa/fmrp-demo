import apiDashboard from "@/Api/apiDashboard/apiDashboard";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useGetTopProducedProducts = ({ limited = 5, dateStart = "", dateEnd = "" }) => {
    return useQuery({
        queryKey: ["api_get_top_produced_products", { limited, dateStart, dateEnd }],
        queryFn: async () => {
            const res = await apiDashboard.apiGetDashboardTopProducedProducts({
                params: {
                    limit: limited,
                    date_start: dateStart,
                    date_end: dateEnd
                }
            });
            console.log("🚀 ~ queryFn: ~ res:", res)


            return {
                ...res.data,
                items: res?.data?.items?.map(e => {
                    return {
                        ...e,
                        quantity: +e?.quantity,
                        percent_quantity: +e?.percent_quantity
                    }
                })
            }
            // return {
            //     ...res,
            //     data: {
            //         ...res.data,
            //         items: res?.data?.items?.map(e => {
            //             return {
            //                 ...e,
            //                 type: e?.item_name,
            //                 value: +e?.quantity,
            //             }
            //         })
            //     }
            // }
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })

}