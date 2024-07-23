import apiContact from "@/Api/apiClients/contact/apiContact";
import { useQuery } from "@tanstack/react-query";

export const useClientCombobox = () => {
    return useQuery({
        queryKey: ["api_client_combobox"],
        queryFn: async () => {

            const { rResult } = await apiContact.apiClientContact({ params: { limit: 0 } });

            return rResult?.map((e) => ({ label: e.name, value: e.id }))
        }
    })

}