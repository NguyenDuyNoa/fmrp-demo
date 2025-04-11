import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import apiProductionsOrders from "@/Api/apiManufacture/manufacture/productionsOrders/apiProductionsOrders";
import { optionsQuery } from "@/configs/optionsQuery";

export const useGetListComment = ({
    limit = 10,
    poiId,
    enabled,
    idTabSheet,
    type
}) => {
    const fetchListComment = async ({ pageParam = 1 }) => {
        const { data } = await apiProductionsOrders.apiGetListComment({ page: pageParam, limit: limit, post_id: poiId, type: "1" })

        return data.data
    };

    return useInfiniteQuery({
        queryKey: ['apiGetListComment', poiId, type, limit],
        queryFn: fetchListComment,
        enabled: enabled,
        placeholderData: keepPreviousData,
        getNextPageParam: (lastPage, pages) => {
            // Kiểm tra nếu còn trang kế tiếp
            if (lastPage?.next === 1) {
                return pages.length + 1; // Trang tiếp theo
            }
            return undefined;
        },
        initialPageParam: 1,
        ...optionsQuery
    });
};
