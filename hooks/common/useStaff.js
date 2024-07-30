import apiComons from "@/Api/apiComon/apiComon";
import { reTryQuery } from "@/configs/configRetryQuery";
import { useQuery } from "@tanstack/react-query";

export const useStaffComboboxByBranch = (params) => {
    return useQuery({
        queryKey: ["api_taff_branch", { ...params }],
        queryFn: async () => {

            const { data } = await apiComons.apiStaffBranch({ params });

            return data?.staffs?.map((e) => ({ label: e.full_name, value: e.staffid }))
        },

        ...reTryQuery
    })

}

export const useTaxList = () => {
    return useQuery({
        queryKey: ["api_tax"],
        queryFn: async () => {

            const { rResult } = await apiComons.apiListTax({});

            return rResult?.map((e) => ({
                label: e.name,
                value: e.id,
                tax_rate: e.tax_rate,
            }))
        },
        ...reTryQuery
    });

}