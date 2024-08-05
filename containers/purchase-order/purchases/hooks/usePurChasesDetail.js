import apiPurchases from "@/Api/apiPurchaseOrder/apiPurchases";
import { optionsQuery } from "@/configs/optionsQuery";
import { useQuery } from "@tanstack/react-query";

export const usePurChasesDetail = (open, id) => {
    return useQuery({
        queryKey: ['api_detail_purchases', id],
        queryFn: async () => {
            const db = await apiPurchases.apiDetailPurchases(id);

            return db
        },
        ...optionsQuery,
        enabled: open && !!id
    })
}