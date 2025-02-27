import apiCheckQuality from "@/Api/apiManufacture/qc/checkQuality/apiCheckQuality";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useCheckQualityList = (params) => {
    return useQuery({
        queryKey: ['api_check_quality', { ...params }],
        queryFn: async () => {
            const { data } = await apiCheckQuality.apiGetListQc({ params: params });
            return data
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })
}