import apiSuppliers from "@/Api/apiSuppliers/suppliers/apiSuppliers";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useSupplierGroup = (params) => {
    const newParams = {
        ...params,
        page: undefined,
        "filter[supplier_group_id]": undefined
    }
    return useQuery({
        queryKey: ["api_group_supplier", { ...newParams }],
        queryFn: async () => {
            const { rResult } = await apiSuppliers.apiListGroupSuppliers({ params: newParams });

            return rResult || []
        },
        placeholderData: keepPreviousData,
    })
}