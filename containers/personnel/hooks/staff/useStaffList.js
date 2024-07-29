import apiSatff from "@/Api/apiPersonnel/apiStaff";
import { reTryQuery } from "@/configs/configRetryQuery";
import { useQuery } from "@tanstack/react-query";

export const useStaffList = (params, sTotalItems) => {
    return useQuery({
        queryKey: ["api_staff", { ...params }],
        queryFn: async () => {
            const { rResult, output } = await apiSatff.apiListStaff({ params });
            sTotalItems(output);
            return rResult
        },
        ...reTryQuery
    })
}