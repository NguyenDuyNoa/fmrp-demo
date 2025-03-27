import { keepPreviousData, useQuery } from "@tanstack/react-query";
import apiProductionsOrders from "@/Api/apiManufacture/manufacture/productionsOrders/apiProductionsOrders";
import { optionsQuery } from "@/configs/optionsQuery";

export const useProductionOrderDetail = ({ id, enabled }) => {
    const fetchProductionOrderDetail = async () => {
        try {
            const { data, isSuccess } = await apiProductionsOrders.apiDetailProductionOrders(id);

            if (!isSuccess == 1) {
                return;
            }

            return data
        } catch (error) {
            throw new Error(error);
        }
    };

    return useQuery({
        queryKey: ['apiDetailProductionOrders', id],
        queryFn: () => fetchProductionOrderDetail(),
        enabled: enabled,
        placeholderData: keepPreviousData,
        ...optionsQuery
    });
};
