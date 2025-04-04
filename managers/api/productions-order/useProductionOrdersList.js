import { useInfiniteQuery } from "@tanstack/react-query";
import apiProductionsOrders from "@/Api/apiManufacture/manufacture/productionsOrders/apiProductionsOrders";
import { useContext } from "react";
import { ProductionsOrdersContext } from "../../../containers/manufacture/productions-orders/context/productionsOrders";
import { StateContext } from "@/context/_state/productions-orders/StateContext";

export const useProductionOrdersList = (params) => {
    const { isStateProvider, queryStateProvider } = useContext(StateContext);

    const fetchProductionOrdersList = async ({ pageParam = 1 }) => {
        const { data } = await apiProductionsOrders.apiProductionOrders(pageParam, isStateProvider?.productionsOrders.limit, { params });

        // if (pageParam === 1) {
        //     queryStateProvider({
        //         productionsOrders: {
        //             ...isStateProvider?.productionsOrders,
        //             countAll: data?.countAll,
        //             productionOrdersList: data?.productionOrders.map((e, index) => ({ ...e })),
        //             next: data?.next == 1,
        //             idDetailProductionOrder: data?.productionOrders[0]?.id ?? null,
        //         }
        //     });
        // } else {
        //     queryStateProvider({
        //         productionsOrders: {
        //             ...isStateProvider?.productionsOrders,
        //             countAll: data?.countAll,
        //             productionOrdersList: merged.map((e) => ({ ...e })),
        //             next: data?.next == 1,
        //         }
        //     });
        // }

        return {
            ...data,
            // nextPage: data?.next == 1 ? pageParam + 1 : undefined,
        };
    };

    return useInfiniteQuery({
        queryKey: [
            "apiProductionOrders",
            isStateProvider?.productionsOrders.search,
            isStateProvider?.productionsOrders.limit,
            isStateProvider?.productionsOrders.date.dateStart,
            isStateProvider?.productionsOrders.date.dateEnd,
            isStateProvider?.productionsOrders.valueProductionOrders,
            isStateProvider?.productionsOrders.valueProductionOrdersDetail,
            isStateProvider?.productionsOrders.valueBr,
            isStateProvider?.productionsOrders.valueOrders,
            isStateProvider?.productionsOrders.valuePlan,
            isStateProvider?.productionsOrders.valueProducts,
            isStateProvider?.productionsOrders.selectStatusFilter
        ],
        queryFn: fetchProductionOrdersList,
        initialPageParam: 1,
        getNextPageParam: (lastPage,pages) => {
            // Kiểm tra nếu còn trang kế tiếp
            if (lastPage?.next === 1) {
                return pages.length + 1; // Trang tiếp theo
            }
            return undefined;
        },
        enabled: true,
        retry: 3,
        retryDelay: 2000,
    });
};
