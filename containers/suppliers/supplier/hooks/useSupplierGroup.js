import apiSuppliers from "@/Api/apiSuppliers/suppliers/apiSuppliers";
import { useQuery } from "@tanstack/react-query";

export const useSupplierGroup = (params) => {
    return useQuery({
        queryKey: ["api_group_supplier", { ...params }],
        queryFn: async () => {
            const { rResult } = await apiSuppliers.apiListGroupSuppliers({ params: params });

            return rResult || []
        }
    })
}