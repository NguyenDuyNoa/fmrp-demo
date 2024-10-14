import apiSuppliersDebt from "@/Api/apiAccountant/apiSuppliersDebt";
import { optionsQuery } from "@/configs/optionsQuery";
import { useQuery } from "@tanstack/react-query";

export const useSupplierDetailFirst = (open, params, id) => {
    return useQuery({
        queryKey: ["api_supplier_debt_detail_first", { ...params }, id],
        enabled: open,
        queryFn: async () => {
            const { data, rResult, rTotal, output } = await apiSuppliersDebt.apiSupplierDetailFirst({ params }, id)

            return { data, rResult, rTotal, output }
        },
        enabled: open,
        ...optionsQuery
    })
}