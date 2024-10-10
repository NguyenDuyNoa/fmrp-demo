import apiReceipts from "@/Api/apiAccountant/apiReceipts";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useReceiptsList = (params) => {
    return useQuery({
        queryKey: ["api_list_receipts", params],
        queryFn: async () => {

            const { rResult, output, rTotal } = await apiReceipts.apiListReceipts({ params: params });

            return { rResult, output, rTotal }
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    });
}

