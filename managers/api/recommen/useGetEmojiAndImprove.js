import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { optionsQuery } from "@/configs/optionsQuery";
import apiRecommendation from "@/Api/popup/apiRecommendation";

export const useGetEmojiAndImprove = ({
    enabled,
}) => {
    const fetchEmojiAndImprove = async ({ pageParam = 1 }) => {
        const { data } = await apiRecommendation.apiGetEmojiAndImprove()



        return data
    };

    return useQuery({
        queryKey: ['apiGetEmojiAndImprove'],
        queryFn: fetchEmojiAndImprove,
        enabled: enabled,
        placeholderData: keepPreviousData,
        ...optionsQuery
    });
};
