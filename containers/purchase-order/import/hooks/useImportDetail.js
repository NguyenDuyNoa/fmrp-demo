import apiImport from "@/Api/apiPurchaseOrder/apiImport";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useImportDetail = (open, id) => {
    return useQuery({
        queryKey: ['api_import_detail', id],
        queryFn: async () => {
            const db = await apiImport.apiDetailImport(id);
            return db
        },
        enabled: open && !!id,
        ...optionsQuery
    })
}