import apiWarehouse from "@/Api/apiManufacture/warehouse/apiWarehouse/apiWarehouse";
import { reTryQuery } from "@/configs/configRetryQuery";
import { useQuery } from "@tanstack/react-query";

export const useWarehouseList = (params) => {
    return useQuery({
        queryKey: ["api_warehouse_list", { ...params }],
        queryFn: async () => {
            const { rResult, output } = await apiWarehouse.apiListWarehouse({ param: params });

            return { rResult, output }
        },
        ...reTryQuery
    })
}