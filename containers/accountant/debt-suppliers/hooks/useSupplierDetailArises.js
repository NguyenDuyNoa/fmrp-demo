import apiSuppliersDebt from "@/Api/apiAccountant/apiSuppliersDebt";
import { optionsQuery } from "@/configs/optionsQuery";
import { useQuery } from "@tanstack/react-query";

export const useSupplierDebtDetailArises = (open, params, id, type) => {
    return useQuery({
        queryKey: ["api_supplier_debt_detail_arises", { ...params }, id],
        enabled: open,
        queryFn: async () => {
            const { rResult, rTotal, output } = await apiSuppliersDebt.apiSupplierDetailArises({ params }, id, type)

            return { rResult, rTotal, output }
        },
        enabled: open,
        ...optionsQuery
    })
}