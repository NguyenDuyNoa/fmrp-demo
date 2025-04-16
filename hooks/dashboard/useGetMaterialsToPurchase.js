import apiDashboard from "@/Api/apiDashboard/apiDashboard";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery, useInfiniteQuery } from "@tanstack/react-query";

export const useGetMaterialsToPurchase = ({ limited = 10, dateStart = "", dateEnd = "" }) => {
    return useQuery({
        queryKey: ["api_get_materials_to_purchase", { limited, dateStart, dateEnd }],
        queryFn: async () => {
            const { data } = await apiDashboard.apiGetDashboardMaterialsToPurchase({
                params: {
                    limit: limited,
                    date_start: dateStart,
                    date_end: dateEnd
                }
            }
            );

            return data;
        },
        enabled: !!dateStart && !!dateEnd,
        ...optionsQuery,
    });
}