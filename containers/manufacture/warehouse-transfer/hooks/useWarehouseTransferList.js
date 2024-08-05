import apiWarehouseTransfer from "@/Api/apiManufacture/warehouse/warehouseTransfer/apiWarehouseTransfer";
import { reTryQuery } from "@/configs/configRetryQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useWarehouseTransferList = (params) => {
    return useQuery({
        queryKey: ["api_warehouse_transfer_list", { ...params }],
        queryFn: async () => {
            const { rResult, output, rTotal } = await apiWarehouseTransfer.apiListTransfer({ params: params });

            return { rResult, output, rTotal };
        },
        placeholderData: keepPreviousData,
        ...reTryQuery
    })

}