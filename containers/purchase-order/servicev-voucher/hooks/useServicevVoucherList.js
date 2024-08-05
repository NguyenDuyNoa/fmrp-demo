import apiServiceVoucher from "@/Api/apiPurchaseOrder/apiServicevVoucher";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useServicevVoucherList = (params) => {
    return useQuery({
        queryKey: ["api_servicev_voucher", { ...params }],
        queryFn: async () => {
            const { rResult, output, rTotal } = await apiServiceVoucher.apiListServiceVoucher({ params });

            return { rResult, output, rTotal }
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })
}