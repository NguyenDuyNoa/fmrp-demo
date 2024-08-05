import apiRecall from "@/Api/apiManufacture/warehouse/recall/apiRecall";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useRecallFillterbar = (params) => {
    return useQuery({
        queryKey: ['api_recall_fillterbar', { ...params }],
        queryFn: async () => {
            const data = await apiRecall.apiListGroupRecall({ params: params, });
            return data
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })
}