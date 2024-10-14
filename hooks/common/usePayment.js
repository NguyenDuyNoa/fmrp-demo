import apiComons from "@/Api/apiComon/apiComon";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const usePayment = () => {
    return useQuery({
        queryKey: ["api_payment_list_combobox"],
        queryFn: async () => {

            const { rResult } = await apiComons.apiPaymentList()

            return rResult?.map(({ name, id }) => ({ label: name, value: id }))
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    });
}

