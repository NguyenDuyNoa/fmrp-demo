import apiPriceQuocte from "@/Api/apiSalesExportProduct/priceQuote/apiPriceQuocte";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const usePriceQuoteList = (params) => {
    return useQuery({
        queryKey: ["api_list_quote", { ...params }],
        queryFn: async () => {

            const { rResult, output, rTotal } = await apiPriceQuocte.apiListPriceQuocte({ params })

            return { rResult, output, rTotal }
        },
        placeholderData: keepPreviousData,
        ...optionsQuery,
    });
}