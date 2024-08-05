import apiReturns from "@/Api/apiPurchaseOrder/apiReturns";
import { optionsQuery } from "@/configs/optionsQuery";
import { useQuery } from "@tanstack/react-query";

export const useReturnDetail = (open, id) => {
    return useQuery({
        queryKey: ["api_return_detail", id],
        queryFn: async () => {
            const db = await apiReturns.apiDetailReturns(id);
            return db
        },
        enabled: open && !!id,
        ...optionsQuery
    })

}