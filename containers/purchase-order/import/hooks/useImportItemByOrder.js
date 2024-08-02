import apiImport from "@/Api/apiPurchaseOrder/apiImport";
import { useQuery } from "@tanstack/react-query";

export const useImportItemByOrder = (id, idTheOrder) => {
    return useQuery({
        queryKey: ["api_import_search_items", idTheOrder],
        queryFn: async () => {
            const { data } = await apiImport.apiSearchItems({
                params: {
                    "filter[purchase_order_id]": idTheOrder ? idTheOrder?.value : null,
                    import_id: id ? id : "",
                }
            });
            return data?.result
        },
        enabled: !!idTheOrder
    })
}