import { keepPreviousData, useQuery } from "@tanstack/react-query";
import apiProductionsOrders from "@/Api/apiManufacture/manufacture/productionsOrders/apiProductionsOrders";
import { useContext } from "react";
import { ProductionsOrdersContext } from "../context/productionsOrders";
import { optionsQuery } from "@/configs/optionsQuery";

export const useProductionOrderDetail = ({ id, enabled }) => {
    const { isStateProvider: isState, queryState } = useContext(ProductionsOrdersContext);

    const fetchProductionOrderDetail = async () => {
        try {
            const { data, isSuccess } = await apiProductionsOrders.apiDetailProductionOrders(id);

            console.log('data data data data', data);

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
