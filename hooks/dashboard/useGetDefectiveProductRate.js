import apiDashboard from "@/Api/apiDashboard/apiDashboard";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useGetDefectiveProductRate = () => {
    return useQuery({
        queryKey: ["api_get_defective_product_rate"],
        queryFn: async () => {
            const res = await apiDashboard.apiGetDashboardDefectiveProductRate({
                params: {
                    limit: 4
                }
            });

            return {
                ...res,
                data: {
                    ...res?.data,
                    items: res?.data?.items?.map(e => {
                        return {
                            ...e,
                            quantity_error: +e?.quantity_error,
                        }
                    })
                }
            }
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })

}