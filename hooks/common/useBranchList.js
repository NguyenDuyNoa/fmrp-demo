import apiComons from "@/api/apiComon/apiComon";
import { reTryQuery } from "@/configs/configRetryQuery";
import { useQuery } from "@tanstack/react-query";

export const useBranchList = (param) => {
    return useQuery({
        queryKey: ["api_branch_list", param],
        queryFn: async () => {
            const { result } = await apiComons.apiBranchCombobox();
            const newData = result?.map((e) => ({ label: e.name, value: e.id }))
            return newData || []
        },
        ...reTryQuery
    });
}