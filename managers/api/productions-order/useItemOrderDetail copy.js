import { keepPreviousData, useQuery } from "@tanstack/react-query";
import apiProductionsOrders from "@/Api/apiManufacture/manufacture/productionsOrders/apiProductionsOrders";
import { optionsQuery } from "@/configs/optionsQuery";

export const useItemOrderDetail = ({ poi_id, enabled }) => {
    const fetchItemOrderDetail = async () => {
        try {
            const { data, isSuccess } = await apiProductionsOrders.apiItemOrdersDetail(poi_id);

            if (!isSuccess == 1) {
                return;
            }

            return data
        } catch (error) {
            throw new Error(error);
        }
    };

    // const { data, isLoading } = useQuery({
    //     queryKey: ["api_item_orders_detail", isState.openModal, isState?.dataModal?.poi_id, router.query?.tabModal, router.query.tab],
    //     queryFn: async () => {
    //         const { data } = await apiProductionsOrders.apiItemOrdersDetail(isState?.dataModal?.poi_id);

    //         const newData = {
    //             dataDetail: {
    //                 ...data,
    //                 poi: {
    //                     ...data?.poi,
    //                     stages: data?.poi.stages?.map(e => {
    //                         return {
    //                             ...e,
    //                             active: e?.active == "1",
    //                             // quantity: 100,
    //                         }
    //                     })
    //                 }
    //             }
    //         }
    //         queryStateModal({ ...newData });
    //         return newData

    //     },
    //     enabled: !!isState.openModal && !!isState?.dataModal?.poi_id,
    //     placeholderData: keepPreviousData,
    //     ...optionsQuery,
    // })


    return useQuery({
        queryKey: ['apiItemOrdersDetail', poi_id],
        queryFn: () => fetchItemOrderDetail(),
        enabled: enabled,
        placeholderData: keepPreviousData,
        ...optionsQuery
    });
};
