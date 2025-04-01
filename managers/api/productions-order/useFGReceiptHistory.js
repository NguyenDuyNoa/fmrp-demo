import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import apiProductionsOrders from "@/Api/apiManufacture/manufacture/productionsOrders/apiProductionsOrders";
import { optionsQuery } from "@/configs/optionsQuery";

export const useFGReceiptHistory = ({
    isSearch = "",
    limit = 10,
    poiId,
    enabled,
    idTabSheet
}) => {
    const fetchFGReceiptHistory = async ({ pageParam = 1 }) => {
        let formData = new FormData();

        if (isSearch) {
            formData.append("search", isSearch)
        }

        formData.append("poi_id", poiId);
        formData.append("is_web", 1);

        const { data } = await apiProductionsOrders.apiGetPurchaseProducts({ page: pageParam, limit: limit }, formData)

        return data
    };

    // const { data, isLoading, isFetching, refetch, isRefetching } = useQuery({
    //     queryKey: ['api_get_purchase_products', isSearch, router.query?.page],
    //     queryFn: async () => {
    //         let formData = new FormData();

    //         formData.append("search", isSearch);

    //         formData.append("page", router.query?.page ?? "");

    //         formData.append("pod_id", isStateModal?.dataDetail?.poi?.poi_id);

    //         const res = await apiProductionsOrders.apiGetPurchaseProducts(formData)

    //         const flattenedItemsArray = res?.data?.rResult.flatMap(entry =>
    //             entry.items.map(item => ({
    //                 branch_name: entry.branch_name,
    //                 code: entry.code,
    //                 created_by: entry.created_by,
    //                 date: entry.date,
    //                 grand_total: entry.grand_total,
    //                 id: entry.id,
    //                 note: entry.note,
    //                 poi_data: entry.poi_data,
    //                 poi_id: entry.poi_id,
    //                 staff_create: entry.staff_create,
    //                 total_quantity: entry.total_quantity,
    //                 item
    //             }))
    //         );
    //         return { ...res.data, rResult: flattenedItemsArray } || {}
    //     },
    //     ...optionsQuery
    // })

    return useInfiniteQuery({
        queryKey: ['apiGetPurchaseProducts', poiId, isSearch, idTabSheet, limit],
        queryFn: fetchFGReceiptHistory,
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
