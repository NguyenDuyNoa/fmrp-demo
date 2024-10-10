import apiReceipts from "@/Api/apiAccountant/apiReceipts";
import { optionsQuery } from "@/configs/optionsQuery";
import { useQuery } from "@tanstack/react-query";

export const useReceiptsDetail = (open, id) => {
    return useQuery({
        queryKey: ['api_detail_receipts', open, id],
        queryFn: async () => {
            const data = await apiReceipts.apiReceiptsDetail(id);
            return data
        },
        enabled: open && !!id,
        ...optionsQuery
    })
}