import apiInventory from "@/Api/apiManufacture/warehouse/inventory/apiInventory";
import { optionsQuery } from "@/configs/optionsQuery"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export const useInventoryList = (params) => {
    return useQuery({
        queryKey: ['api_inventory_list', { ...params }],
        queryFn: async () => {
            const { output, rResult } = await apiInventory.apiListInventory({ params: params });
            return { output, rResult }
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })
}