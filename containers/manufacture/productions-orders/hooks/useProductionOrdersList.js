import { useInfiniteQuery } from "@tanstack/react-query";
import apiProductionsOrders from "@/Api/apiManufacture/manufacture/productionsOrders/apiProductionsOrders";
import { useContext } from "react";
import { formatMoment } from "@/utils/helpers/formatMoment";
import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";
import { ProductionsOrdersContext } from "../context/productionsOrders";

export const useProductionOrdersList = (params) => {
    const { isStateProvider: isState, queryState } = useContext(ProductionsOrdersContext);

    const fetchProductionOrdersList = async ({ pageParam = 1 }) => {
        const { data } = await apiProductionsOrders.apiProductionOrders(pageParam, isState.limit, { params });

        console.log('data', data);


        // const arrayItem = convertArrData(data?.productionOrders);
        // console.log('arrayItem arrayItem', arrayItem);

        if (pageParam === 1) {
            queryState({
                countAll: data?.countAll,
                productionOrdersList: data?.productionOrders.map((e, index) => ({ ...e })),
                next: data?.next == 1,
                idDetailProductionOrder: data?.productionOrders[0]?.id ?? null,
            });
        } else {
            const merged = [...isState.productionOrdersList, ...data?.productionOrders];
            queryState({
                countAll: data?.countAll,
                productionOrdersList: merged.map((e) => ({ ...e })),
                next: data?.next == 1,
            });
        }

        return {

            ...data,
            nextPage: data?.next == 1 ? pageParam + 1 : undefined,
        };
    };

    return useInfiniteQuery({
        queryKey: [
            "apiProductionOrders",
            isState.search,
            isState.limit,
            isState.date.dateStart,
            isState.date.dateEnd,
            isState.valueProductionOrders,
            isState.valueProductionOrdersDetail,
            isState.valueBr,
            isState.valueOrders,
            isState.valuePlan,
            isState.valueProducts
        ],
        queryFn: fetchProductionOrdersList,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage?.nextPage,
        enabled: true,
        retry: 3,
        retryDelay: 2000,
    });
};
