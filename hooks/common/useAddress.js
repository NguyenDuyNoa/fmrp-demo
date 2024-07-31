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

// danh sách tỉnh thành
export const useProvinceList = ({ provinceid = null }) => {
    return useQuery({
        queryKey: ["api_province"],
        queryFn: async () => {
            const { rResult } = await apiComons.apiListProvince();
            return rResult?.map((e) => ({ label: e?.name, value: e?.provinceid })) || [];
        },
    });
};

// danh sách quận huyện
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