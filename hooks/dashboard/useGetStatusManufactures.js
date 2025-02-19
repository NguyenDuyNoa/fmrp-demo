import apiDashboard from "@/Api/apiDashboard/apiDashboard";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useGetStatusManufactures = () => {
    return useQuery({
        queryKey: ["api_get_status_manufactures"],
        queryFn: async () => {
            const res = await apiDashboard.apiGetDashboardStatusManufactures();
            return res
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })

}