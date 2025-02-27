import apiCheckQuality from "@/Api/apiManufacture/qc/checkQuality/apiCheckQuality"
import { optionsQuery } from "@/configs/optionsQuery"
import { useQuery } from "@tanstack/react-query"

export const useCheckQualityDetail = (open, id) => {
    return useQuery({
        queryKey: ["api_detail_qc", id],
        queryFn: async () => {
            const { data } = await apiCheckQuality.apiDetailQc(id)
            return data
        },
        enabled: open && !!id,
        ...optionsQuery
    })
}