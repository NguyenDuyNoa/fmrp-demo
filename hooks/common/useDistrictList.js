import apiComons from "@/Api/apiComon/apiComon";
import { useQuery } from "@tanstack/react-query";

export const useDistrictList = (key) => {
    const params = {
        provinceid: key?.value ? key?.value : -1,
    }
    return useQuery({
        queryKey: ["api_district", key?.value],
        queryFn: async () => {
            const { rResult } = await apiComons.apiDistric({ params: params })
            return rResult?.map((e) => ({
                label: e.name,
                value: e.districtid,
            })) || []
        },
    })
}