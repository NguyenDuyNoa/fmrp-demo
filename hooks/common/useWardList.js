import apiComons from "@/Api/apiComon/apiComon";
import { useQuery } from "@tanstack/react-query";

export const useWardList = (key, value = null) => {
    return useQuery({
        queryKey: ["api_ward", key],
        queryFn: async () => {

            const params = {
                districtid: key?.value ? key?.value : -1,
            }

            const { rResult } = await apiComons.apiWWard({ params: params })

            return rResult?.map((e) => ({
                label: e.name,
                value: e.wardid,
            })) || []
        },
    })
}