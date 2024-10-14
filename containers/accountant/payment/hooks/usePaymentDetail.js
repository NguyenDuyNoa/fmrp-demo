import apiPayments from "@/Api/apiAccountant/apiPayments";
import { optionsQuery } from "@/configs/optionsQuery";
import { useQuery } from "@tanstack/react-query";

export const usePaymentDetail = (open, id) => {
    return useQuery({
        queryKey: ["api_detail_payment", id],
        enabled: open,
        queryFn: async () => {
            const db = await apiPayments.apiDetailPayment(id)

            return db
        },
        ...optionsQuery
    })
}