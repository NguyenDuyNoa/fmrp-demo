import apiRecall from "@/Api/apiManufacture/warehouse/recall/apiRecall";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useRecallList = (params) => {
    return useQuery({
        queryKey: ['api_recall', { ...params }],
        queryFn: async () => {
            const { rResult, output, rTotal } = await apiRecall.apiListRecall({ params: params, });
            return { rResult, output, rTotal }
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })
}