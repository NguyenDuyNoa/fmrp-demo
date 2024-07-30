import apiComons from "@/Api/apiComon/apiComon";
import { reTryQuery } from "@/configs/configRetryQuery";
import { useQuery } from "@tanstack/react-query";

export const useContactCombobox = (params) => {
    return useQuery({
        queryKey: ["api_search_contact", { ...params }],
        queryFn: async () => {
            const { data } = await apiComons.apiSearchContact({ ...params });
            return data?.contacts.map((e) => ({
                label: e?.full_name,
                value: e?.id,
            }))
        },
        ...reTryQuery
    })
}