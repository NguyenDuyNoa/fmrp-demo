import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import apiProductionsOrders from "@/Api/apiManufacture/manufacture/productionsOrders/apiProductionsOrders";
import { optionsQuery } from "@/configs/optionsQuery";

export const useMaterialReturn = ({
    isSearch = "",
    limit = 10,
    poiId,
    enabled,
    idTabSheet
}) => {
    const fetchMaterialReturn = async ({ pageParam = 1 }) => {
        let formData = new FormData();

        if (isSearch) {
            formData.append("search", isSearch)
        }

        formData.append("pod_id", poiId);

        const { data } = await apiProductionsOrders.apiGetRecallProduction({ page: pageParam, limit: limit },formData)

        return data
    };

    return useInfiniteQuery({
        queryKey: ['apiGetRecallProduction', poiId, isSearch, idTabSheet, limit],
        queryFn: fetchMaterialReturn,
        enabled: enabled,
        placeholderData: keepPreviousData,
        getNextPageParam: (lastPage, pages) => {
            // Kiểm tra nếu còn trang kế tiếp
            if (lastPage?.output?.next === 1) {
                return pages.length + 1; // Trang tiếp theo
            }
            return undefined;
        },
        initialPageParam: 1,
        ...optionsQuery
    });
};
