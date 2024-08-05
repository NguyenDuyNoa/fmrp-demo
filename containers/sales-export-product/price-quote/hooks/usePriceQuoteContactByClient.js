import apiPriceQuocte from "@/Api/apiSalesExportProduct/priceQuote/apiPriceQuocte";
import { optionsQuery } from "@/configs/optionsQuery";
import { useQuery } from "@tanstack/react-query";

export const usePriceQuoteContactByClient = (value) => {
    return useQuery({
        queryKey: ["api_contact_by_id", value],
        queryFn: async () => {

            const { rResult } = await apiPriceQuocte.apiContact({
                params: {
                    "filter[client_id]": value != null ? value.value : null,
                }
            });

            return rResult?.map((e) => ({
                label: e.full_name,
                value: e.id,
            }))
        },
        enabled: !!value,
        ...optionsQuery
    });
}