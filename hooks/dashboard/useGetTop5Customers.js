import apiDashboard from "@/Api/apiDashboard/apiDashboard";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useGetTop5Customers = () => {
    return useQuery({
        queryKey: ["api_get_top_5_customers"],
        queryFn: async () => {
            const res = await apiDashboard.apiGetDashboardTop5Customers({
                params: {
                    limit: 5
                }
            });

            return {
                ...res,
                data: {
                    ...res.data,
                    items: res?.data?.items?.map(e => {
                        return {
                            ...e,
                            total_quantity: +e?.total_quantity
                        }
                    })
                }
            }
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })

}