import apiCustomerDebt from "@/Api/apiAccountant/apiCustomerDebt";
import { optionsQuery } from "@/configs/optionsQuery";
import { useQuery } from "@tanstack/react-query";

export const useCustomerDebtDetailFirst = (open, params, id) => {
    return useQuery({
        queryKey: ["api_customer_debt_detail_first", { ...params }, id],
        enabled: open,
        queryFn: async () => {
            const { data, rResult, rTotal, output } = await apiCustomerDebt.apiCustomerDebtDetailFirst({ params }, id)

            return { data, rResult, rTotal, output }
        },
        enabled: open,
        ...optionsQuery
    })
}