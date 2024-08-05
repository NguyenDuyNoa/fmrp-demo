import apiProductsWarehouse from "@/Api/apiManufacture/warehouse/productsWarehouse/apiProductsWarehouse";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export const useProductsWarehouseList = (params) => {
    return useQuery({
        queryKey: ["api_products_warehouse_list", { ...params }],
        queryFn: async () => {
            const { rResult, output, rTotal } = await apiProductsWarehouse.apiListProductWarehouse({ params: params });
            return { rResult, output, rTotal }
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })
}