import apiImport from "@/Api/apiPurchaseOrder/apiImport";
import { reTryQuery } from "@/configs/configRetryQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useImportFilterbar = (params) => {
    return useQuery({
        queryKey: ["api_import_filter_bar", { ...params }],
        queryFn: async () => {
            const data = await apiImport.apiListFilterBar({ params: params });
            return data
        },
        placeholderData: keepPreviousData,
        ...reTryQuery
    })
}