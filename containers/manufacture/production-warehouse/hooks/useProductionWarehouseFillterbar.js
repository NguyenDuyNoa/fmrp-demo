import apiProductionWarehouse from "@/Api/apiManufacture/warehouse/productionWarehouse/apiProductionWarehouse";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export const useProductionWarehouseFillterbar = (params) => {
    return useQuery({
        queryKey: ["useProductionWarehouseFillterbar", params],
        queryFn: async () => {
            const data = await apiProductionWarehouse.apiListGroupProductionWarehouse({ params: params });
            return data
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })
}