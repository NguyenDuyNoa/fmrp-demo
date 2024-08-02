import apiImport from "@/Api/apiPurchaseOrder/apiImport";
import { reTryQuery } from "@/configs/configRetryQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useImportList = (params) => {
    return useQuery({
        queryKey: ["api_import_list", { ...params }],
        queryFn: async () => {
            const { rResult, output, rTotal } = await apiImport.apiListImport({ params });

            return { rResult, output, rTotal }
        },
        placeholderData: keepPreviousData,
        ...reTryQuery
    })
}