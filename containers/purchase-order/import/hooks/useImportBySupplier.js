import apiImport from "@/Api/apiPurchaseOrder/apiImport";
import { useQuery } from "@tanstack/react-query";

export const useImportBySupplier = (idSupplier, id, search) => {
    return useQuery({
        queryKey: ['api_import_not_stock', idSupplier, search],
        queryFn: async () => {
            const db = await apiImport.apiNotStockCombobox(search ? "POST" : 'GET', {
                data: {
                    term: search,
                },
                params: {
                    "filter[supplier_id]": idSupplier ? idSupplier?.value : null,
                    import_id: id ? id : "",
                }
            });

            return db?.map((e) => ({ label: e?.code, value: e?.id })) || {
                label: db?.code,
                value: db?.id,
            }
        },
        enabled: !!idSupplier
    })

}