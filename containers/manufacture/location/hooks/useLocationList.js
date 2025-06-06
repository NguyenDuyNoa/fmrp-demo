import apiLocationWarehouse from "@/Api/apiManufacture/warehouse/apiWarehouseLocation/apiWarehouseLocation";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useLocationList = (params) => {
    return useQuery({
        queryKey: ["api_location_list", { ...params }],
        queryFn: async () => {
            const { rResult, output } = await apiLocationWarehouse.apiLocationWarehouse({ params: params });

            return { rResult, output }
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })
}