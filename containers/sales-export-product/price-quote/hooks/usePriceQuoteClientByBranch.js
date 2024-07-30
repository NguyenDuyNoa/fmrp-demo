import apiContact from "@/Api/apiClients/contact/apiContact";
import { reTryQuery } from "@/configs/configRetryQuery";
import { useQuery } from "@tanstack/react-query";

export const usePriceQuoteClientByBranch = (value) => {
    return useQuery({
        queryKey: ["price_quote_client_by_id", value],
        queryFn: async () => {

            const { rResult } = await apiContact.apiClientContact({
                params: {
                    "filter[branch_id]": value != null ? value?.value : null,
                }
            });
            return rResult?.map((e) => ({ label: e?.name, value: e?.id })) || [];
        },
        enabled: !!value,
        ...reTryQuery
    });
}