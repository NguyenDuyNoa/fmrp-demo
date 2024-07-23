import apiSuppliers from "@/Api/apiSuppliers/suppliers/apiSuppliers";
import { reTryQuery } from "@/configs/configRetryQuery";
import { useQuery } from "@tanstack/react-query";

export const useSupplierList = (params, updateTotalItems) => {
    return useQuery({
        queryKey: ["api_supplier_list", { ...params }],
        queryFn: async () => {

            const { rResult, output } = await apiSuppliers.apiListSuppliers({ params: params });

            updateTotalItems(output);

            return { rResult, output }
        },
        ...reTryQuery
    })
}