import apiInventory from "@/Api/apiManufacture/warehouse/inventory/apiInventory";
import { optionsQuery } from "@/configs/optionsQuery"
import { useQuery } from "@tanstack/react-query"

export const useInventoryItems = (search) => {
    return useQuery({
        queryKey: ["api_inventory_items", search],
        queryFn: async () => {
            const { data } = await apiInventory.apiItemsNoneVariantInventory({
                data: {
                    term: search,
                },
            });
            return data?.result?.map((e) => ({
                label: `${e.name + e.code + e.id}`,
                name: e.name,
                value: e.id,
                code: e.code,
                img: e.images,
                type: e.text_type,
            }))
        },
        ...optionsQuery
    })
}