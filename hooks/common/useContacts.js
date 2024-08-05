import apiComons from "@/Api/apiComon/apiComon";
import { optionsQuery } from "@/configs/optionsQuery";
import { useQuery } from "@tanstack/react-query";

// danh sách liên hệ
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
        ...optionsQuery
    })
}