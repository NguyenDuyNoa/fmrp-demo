import apiPayments from "@/Api/apiAccountant/apiPayments";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const usePaymentList = (params) => {
    return useQuery({
        queryKey: ["api_list_payment_list", { ...params }],
        queryFn: async () => {

            const { rResult, output, rTotal } = await apiPayments.apiListPayment({ params });

            return { rResult, output, rTotal }
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    });
}

