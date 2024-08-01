import apiServiceVoucher from "@/Api/apiPurchaseOrder/apiServicevVoucher";
import { reTryQuery } from "@/configs/configRetryQuery";
import { useQuery } from "@tanstack/react-query";

export const useServiceVoucherCombobox = (inputValue) => {
    return useQuery({
        queryKey: ["api_servicev_voucher_code", inputValue],
        queryFn: async () => {
            const { result } = await apiServiceVoucher.apiServiceCombobox(inputValue ? 'POST' : 'GET', {
                data: {
                    term: inputValue
                },
            });

            return result?.map((e) => ({ label: e?.code, value: e?.id })) || []
        },
        ...reTryQuery
    })
}