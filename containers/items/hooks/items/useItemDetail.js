import apiItems from "@/Api/apiMaterial/items/apiItems";
import { useQuery } from "@tanstack/react-query";

export const useItemDetail = (open, id) => {
    return useQuery({
        queryKey: ['api_detail_items', !!open],
        queryFn: async () => {
            const data = await apiItems.apiDetailItems(id);

            return data
        },
        enabled: !!open,
    })
}