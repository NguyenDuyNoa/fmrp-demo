import apiSuppliers from "@/Api/apiSuppliers/suppliers/apiSuppliers";
import { useQuery } from "@tanstack/react-query";

export const usseSupplierDetail = (open, id) => {
    return useQuery({
        queryKey: ["api_supplier_detail", id],
        queryFn: async () => {
            const db = await apiSuppliers.apiDetailSuppliers(id);

            return db
        },
        enabled: (!!id && open),
    })
}