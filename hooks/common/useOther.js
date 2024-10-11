// ds loại chứng từ

import apiComons from "@/Api/apiComon/apiComon";
import { optionsQuery } from "@/configs/optionsQuery";
import { useQuery } from "@tanstack/react-query";

export const useVoucherPayTypePaySlip = (params, dataLang) => {
    return useQuery({
        queryKey: ['api_voucher_type_combobox_payslip', { ...params }],
        queryFn: async () => {
            const data = await apiComons.apiVoucherTypePaySlipCombobox({
                params: {
                    type: params?.type,
                }
            });

            return data?.map(({ name, id }) => ({ label: dataLang[name] || name, value: id }))
        },
        ...optionsQuery
    })
}

// ds chứng từ
export const useVoucherListPayPaySlip = (params, search) => {
    return useQuery({
        queryKey: ['api_voucher_list_combobox_payslip', { ...params }, search],
        queryFn: async () => {
            const result = await apiComons.apiVoucherListPaySlipCombobox({ params, data: search ?? undefined });
            console.log("result", result);


            return result?.map(({ code, id, money }) => ({
                label: code,
                value: id,
                money: money,
            }))
        },
        ...optionsQuery
    })
}