import apiComons from "@/Api/apiComon/apiComon";
import { useQuery } from "@tanstack/react-query";

export const useProvinceList = ({ provinceid = null }) => {
    return useQuery({
        queryKey: ["api_province"],
        queryFn: async () => {
            const { rResult } = await apiComons.apiListProvince();
            return rResult?.map((e) => ({ label: e?.name, value: e?.provinceid })) || [];
        },
    });
};