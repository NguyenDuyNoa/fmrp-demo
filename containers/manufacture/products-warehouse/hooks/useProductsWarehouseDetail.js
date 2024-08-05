import apiProductsWarehouse from "@/Api/apiManufacture/warehouse/productsWarehouse/apiProductsWarehouse";
import { optionsQuery } from "@/configs/optionsQuery";
import { useQuery } from "@tanstack/react-query"

export const useProductsWarehouseDetail = (open, id) => {
    return useQuery({
        queryKey: ["api_detail_products_warehouse", id],
        queryFn: async () => {
            const data = await apiProductsWarehouse.apiDetailPoductWarehouse(id)
            return data
        },
        enabled: open && !!id,
        ...optionsQuery
    })
}