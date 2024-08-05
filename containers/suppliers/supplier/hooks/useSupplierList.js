import apiSuppliers from "@/Api/apiSuppliers/suppliers/apiSuppliers";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useSupplierList = (params) => {

    return useQuery({
        queryKey: ["api_supplier_list", { ...params }],
        queryFn: async () => {

            const { rResult, output } = await apiSuppliers.apiListSuppliers({ params: params });

            return { rResult, output }
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })
}