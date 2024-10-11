import apiCustomerDebt from "@/Api/apiAccountant/apiCustomerDebt";
import { optionsQuery } from "@/configs/optionsQuery";
import { useQuery } from "@tanstack/react-query";

export const useCustomerDebtDetailArises = (open, params, id, type) => {
    return useQuery({
        queryKey: ["api_customer_debt_detail_arises", { ...params }, id],
        enabled: open,
        queryFn: async () => {
            const { rResult, rTotal, output } = await apiCustomerDebt.apiCustomerDebtDetailArises({ params }, id, type)

            return { rResult, rTotal, output }
        },
        enabled: open,
        ...optionsQuery
    })
}