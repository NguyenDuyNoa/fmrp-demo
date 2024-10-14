import apiSuppliersDebt from "@/Api/apiAccountant/apiSuppliersDebt";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useSupplierDebtList = (params) => {
    return useQuery({
        queryKey: ["api_list_suppliers_debt", { ...params }],
        queryFn: async () => {

            const { rResult, output, rTotal } = await apiSuppliersDebt.apiSupplierDebtList({ params });

            return { rResult, output, rTotal }
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    });
}

