import apiProductionWarehouse from "@/Api/apiManufacture/warehouse/productionWarehouse/apiProductionWarehouse";
import { useQuery } from "@tanstack/react-query"

export const useProductionWarehouseCombobox = (search) => {
    return useQuery({
        queryKey: ["api_production_warehouse_combobox", search],
        queryFn: async () => {
            const { result } = await apiProductionWarehouse.apiCodeProductionWarehouse(search ? 'POST' : 'GET', {
                data: {
                    term: search,
                }
            });
            return result?.map((e) => ({ label: e.code, value: e.id })) || []
        },
    })

}