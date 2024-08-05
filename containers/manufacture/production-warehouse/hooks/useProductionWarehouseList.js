import apiProductionWarehouse from "@/Api/apiManufacture/warehouse/productionWarehouse/apiProductionWarehouse";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useProductionWarehouseList = (params) => {
    return useQuery({
        queryKey: ['api_production_warehouse_list', { ...params }],
        queryFn: async () => {
            const { rResult, output, rTotal } = await apiProductionWarehouse.apiListProductionWarehouse({ params: params });
            return { rResult, output, rTotal }
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })
}