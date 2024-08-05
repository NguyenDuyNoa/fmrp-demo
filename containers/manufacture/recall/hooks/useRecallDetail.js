import apiRecall from "@/Api/apiManufacture/warehouse/recall/apiRecall"
import { optionsQuery } from "@/configs/optionsQuery"
import { useQuery } from "@tanstack/react-query"

export const useRecallDetail = (open, id) => {
    return useQuery({
        queryKey: ["api_detail_recall", id],
        queryFn: async () => {
            const data = await apiRecall.apiDetailRecall(id)
            return data
        },
        enabled: open && !!id,
        ...optionsQuery
    })
}