import apiDashboard from "@/Api/apiDashboard/apiDashboard";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery, useInfiniteQuery } from "@tanstack/react-query";

export const useGetMaterialsToPurchase = () => {
    return useInfiniteQuery({
        queryKey: ["api_get_materials_to_purchase"],
        queryFn: async ({ pageParam = 1 }) => {
            const { data } = await apiDashboard.apiGetDashboardMaterialsToPurchase({
                params: {
                    page: pageParam,
                    limit: 10,
                }
            }
            );

            return data;
        },
        getNextPageParam: (lastPage, pages) => {
            return lastPage?.next == 1 ? pages?.length + 1 : null;
        },
        retry: 5,
        retryDelay: 5000,
        initialPageParam: 1,
        ...optionsQuery,
    });
}