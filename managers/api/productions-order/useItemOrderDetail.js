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

    return useQuery({
        queryKey: ['apiItemOrdersDetail', poi_id],
        queryFn: () => fetchItemOrderDetail(),
        enabled: enabled,
        placeholderData: keepPreviousData,
        ...optionsQuery
    });
};
