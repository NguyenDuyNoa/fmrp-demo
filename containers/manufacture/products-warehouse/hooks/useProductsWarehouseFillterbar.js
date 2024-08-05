import apiProductsWarehouse from "@/Api/apiManufacture/warehouse/productsWarehouse/apiProductsWarehouse";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useProductsWarehouseFillterbar = (params) => {
    return useQuery({
        queryKey: ["api_products_warehouse_fillterbar", { ...params }],
        queryFn: async () => {
            const data = await apiProductsWarehouse.apiListGroupProductWarehouse({ params: params });
            return data
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })
}