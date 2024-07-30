import apiPriceQuocte from "@/Api/apiSalesExportProduct/priceQuote/apiPriceQuocte";
import { reTryQuery } from "@/configs/configRetryQuery";
import { useQuery } from "@tanstack/react-query";

export const usePriceQuocteListFilterbar = (params, query) => {
    return useQuery({
        queryKey: ["api_list_filterBar", { ...query }],
        queryFn: async () => {

            const data = await apiPriceQuocte.apiListFilterBar({ params });

            return data
        },
        ...reTryQuery
    })
}