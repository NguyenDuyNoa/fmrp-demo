import apiPriceQuocte from "@/Api/apiSalesExportProduct/priceQuote/apiPriceQuocte";
import { optionsQuery } from "@/configs/optionsQuery";
import { useQuery } from "@tanstack/react-query";

const fetchPriceQuote = async (search) => {
    try {
        const { data } = await apiPriceQuocte.apiSearchQuocte({
            params: { search: search || "" }
        });
        return data?.quotes?.map(e => ({ label: e.reference_no, value: e.id })) || [];
    } catch (error) {

    }
};

export const usePriceQuoteCombobox = (search) => {
    return useQuery({
        queryKey: ["api_search_price_quote", search],
        queryFn: () => fetchPriceQuote(search),
        ...optionsQuery
    });
};
