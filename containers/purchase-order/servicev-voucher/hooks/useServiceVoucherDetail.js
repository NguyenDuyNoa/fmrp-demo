import apiServiceVoucher from "@/Api/apiPurchaseOrder/apiServicevVoucher";
import { useQuery } from "@tanstack/react-query";

export const useServiceVoucherDetail = (open, id) => {
    return useQuery({
        queryKey: ["api_detail_service", id],
        queryFn: async () => {
            const res = await apiServiceVoucher.apiDetailService(id);

            return res
        },
        enabled: open && !!id,
    })
}