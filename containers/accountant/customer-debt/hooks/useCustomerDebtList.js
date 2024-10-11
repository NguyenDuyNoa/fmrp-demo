import apiCustomerDebt from "@/Api/apiAccountant/apiCustomerDebt";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useCustomerDebtList = (params) => {
    return useQuery({
        queryKey: ["api_list_customer_debt", { ...params }],
        queryFn: async () => {

            const { rResult, output, rTotal } = await apiCustomerDebt.apiListCustomerDebt({ params });

            return { rResult, output, rTotal }
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    });
}

