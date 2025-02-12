import apiAiBoms from "@/Api/ai/apiAiBoms";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useGetTypeOpenAi = () => {

    return useQuery({
        queryKey: ["getTypeOpenAi"],
        queryFn: async () => {
            const { data } = await apiAiBoms.apiGetTypeOpenAi()
            return data
        },
        placeholderData: keepPreviousData,
    });
};
