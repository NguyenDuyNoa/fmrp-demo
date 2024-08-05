import apiWarehouse from "@/Api/apiManufacture/warehouse/apiWarehouse/apiWarehouse";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useWarehouseDetail = (id, params) => {
    return useQuery({
        queryKey: ["api_warehouse_detail", { id, ...params }],
        queryFn: async () => {
            const { rResult, output } = await apiWarehouse.apiWarehouseDetail(id, { params: params });

            return { rResult, output }
        },
        enabled: !!id,
        placeholderData: keepPreviousData,
        ...optionsQuery
    })

}