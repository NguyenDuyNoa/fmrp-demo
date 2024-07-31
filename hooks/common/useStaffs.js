import apiComons from "@/Api/apiComon/apiComon";
import { reTryQuery } from "@/configs/configRetryQuery";
import { useQuery } from "@tanstack/react-query";
/// danh sách nhân viên theo chii nhánh
export const useStaffComboboxByBranch = (params) => {
    return useQuery({
        queryKey: ["api_staff_branch", { ...params }],
        queryFn: async () => {

            const { data } = await apiComons.apiStaffBranch({ params });

            return data?.staffs?.map((e) => ({ label: e.full_name, value: e.staffid }))
        },

        ...reTryQuery
    })

}
/// nhân viên 
export const useStaffOptions = (params = {}) => {
    return useQuery({
        queryKey: ["api_staff_options", { ...params }],
        queryFn: async () => {

            const { rResult } = await apiComons.apiStaffOption({ params })

            return rResult?.map((e) => ({ label: e.name, value: e.staffid })) || []
        },
    })
}

