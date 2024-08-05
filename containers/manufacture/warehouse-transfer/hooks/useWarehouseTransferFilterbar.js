import apiWarehouseTransfer from "@/Api/apiManufacture/warehouse/warehouseTransfer/apiWarehouseTransfer";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useWarehouseTransferFilterbar = (params) => {
    return useQuery({
        queryKey: ["api_warehouse_transfer_filterbar", { ...params }],
        queryFn: async () => {
            const db = await apiWarehouseTransfer.apiTransferFilterBar({
                params: {
                    ...params,
                    limit: 0,
                }
            });
            return db;
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })
}