import apiProductionWarehouse from "@/Api/apiManufacture/warehouse/productionWarehouse/apiProductionWarehouse";
import { reTryQuery } from "@/configs/configRetryQuery";
import { useQuery } from "@tanstack/react-query"

export const useProductionWarehouseDetail = (open, id) => {
    return useQuery({
        queryKey: ['api_production_warehouse_detail', id],
        queryFn: async () => {
            const data = await apiProductionWarehouse.apiDetailProductionWarehouse(id);
            return data
        },
        enabled: open && !!id,
        ...reTryQuery
    })
}