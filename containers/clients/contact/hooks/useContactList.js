import apiContact from "@/Api/apiClients/contact/apiContact";
import { reTryQuery } from "@/configs/configRetryQuery";
import { useQuery } from "@tanstack/react-query";

export const useContactList = (params, updateTotalItems) => {
    return useQuery({
        queryKey: ["api_list_contact", { ...params }],
        queryFn: async () => {

            const { rResult, output } = await apiContact.apiListContact({ params: params });

            updateTotalItems(output);

            return { rResult, output }
        },
        ...reTryQuery
    })
}