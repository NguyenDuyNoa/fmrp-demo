import apiInventory from "@/Api/apiManufacture/warehouse/inventory/apiInventory";
import { optionsQuery } from "@/configs/optionsQuery";
import { useQuery } from "@tanstack/react-query"

export const useInventoryDetail = (open, id) => {
    return useQuery({
        queryKey: ["api_inventorydetail", id],
        queryFn: async () => {
            const db = await apiInventory.apiDetailInventory(id);
            return db
        },
        enabled: open && !!id,
        ...optionsQuery
    })
}