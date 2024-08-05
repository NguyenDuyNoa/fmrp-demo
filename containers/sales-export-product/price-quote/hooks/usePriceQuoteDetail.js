import apiPriceQuocte from "@/Api/apiSalesExportProduct/priceQuote/apiPriceQuocte";
import { optionsQuery } from "@/configs/optionsQuery";
import { useQuery } from "@tanstack/react-query";

export const usePriceQuoteDetail = (open, id) => {
    return useQuery({
        queryKey: ["api_detail_quote", id],
        queryFn: async () => {

            const db = await apiPriceQuocte.apiDetailQuote(id);

            return db
        },
        enabled: open && !!id,
        ...optionsQuery
    })
}