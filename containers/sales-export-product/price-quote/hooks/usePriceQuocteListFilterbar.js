import apiPriceQuocte from "@/Api/apiSalesExportProduct/priceQuote/apiPriceQuocte";
import { reTryQuery } from "@/configs/configRetryQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const usePriceQuocteListFilterbar = (params) => {
    return useQuery({
        queryKey: ["api_list_filterBar", { ...params }],
        queryFn: async () => {

            const data = await apiPriceQuocte.apiListFilterBar({ params });

            return data
        },
        placeholderData: keepPreviousData,
        ...reTryQuery
    })
}