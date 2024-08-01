import apiServiceVoucher from "@/Api/apiPurchaseOrder/apiServicevVoucher";
import { reTryQuery } from "@/configs/configRetryQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useServicevVoucherFilterbar = (params) => {
    return useQuery({
        queryKey: ["api_servicev_voucher_filterbar", { ...params }],
        queryFn: async () => {
            const data = await apiServiceVoucher.apiFilterBar();

            return data
        },
        placeholderData: keepPreviousData,
        ...reTryQuery
    })
}