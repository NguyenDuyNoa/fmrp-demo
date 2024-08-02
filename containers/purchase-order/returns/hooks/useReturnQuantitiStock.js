import apiReturns from "@/Api/apiPurchaseOrder/apiReturns";
import { reTryQuery } from "@/configs/configRetryQuery";
import { useQuery } from "@tanstack/react-query";

export const useReturnQuantitiStock = (idParen, idBranch) => {
    return useQuery({
        queryKey: ["api_quantity_stock", idParen, idBranch],
        queryFn: async () => {
            const result = await apiReturns.apiQuantityStock(idParen, {
                params: {
                    "filter[branch_id]": idBranch?.value,
                }
            });

            return result?.map((e) => ({
                label: e?.name,
                value: e?.id,
                warehouse_name: e?.warehouse_name,
                qty: e?.quantity,
            }))
        },
        enabled: !!idParen,
        ...reTryQuery
    })
}