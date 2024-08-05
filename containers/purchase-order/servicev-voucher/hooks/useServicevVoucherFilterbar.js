import apiServiceVoucher from "@/Api/apiPurchaseOrder/apiServicevVoucher";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useServicevVoucherFilterbar = (params) => {
    return useQuery({
        queryKey: ["api_servicev_voucher_filterbar", { ...params }],
        queryFn: async () => {
            const data = await apiServiceVoucher.apiFilterBar();

            return data
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })
}