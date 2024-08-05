import apiContact from "@/Api/apiClients/contact/apiContact";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useContactList = (params) => {
    return useQuery({
        queryKey: ["api_list_contact", { ...params }],
        queryFn: async () => {

            const { rResult, output } = await apiContact.apiListContact({ params: params });

            return { rResult, output }
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })
}