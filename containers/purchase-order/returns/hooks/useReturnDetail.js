import apiReturns from "@/Api/apiPurchaseOrder/apiReturns";
import { reTryQuery } from "@/configs/configRetryQuery";
import { useQuery } from "@tanstack/react-query";

export const useReturnDetail = (open, id) => {
    return useQuery({
        queryKey: ["api_return_detail", id],
        queryFn: async () => {
            const db = await apiReturns.apiDetailReturns(id);
            return db
        },
        enabled: open && !!id,
        ...reTryQuery
    })

}