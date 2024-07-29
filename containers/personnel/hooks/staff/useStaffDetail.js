import apiSatff from "@/Api/apiPersonnel/apiStaff";
import { useQuery } from "@tanstack/react-query";

export const useStaffDetail = (open, id) => {
    return useQuery({
        queryKey: ["api_detail_staff"],
        queryFn: async () => {
            const db = await apiSatff.apiDetailStaff(id)

            return db
        },
        enabled: !!open && !!id
    })
}