import apiWarehouse from "@/Api/apiManufacture/warehouse/apiWarehouse/apiWarehouse";
import { reTryQuery } from "@/configs/configRetryQuery";
import { useQuery } from "@tanstack/react-query";

export const useWarehouseLocation = (id) => {
    return useQuery({
        queryKey: ["api_location_warehouse", id],
        queryFn: async () => {
            const { rResult } = await apiWarehouse.apiLocationWarehouse(id);

            return rResult?.map((e) => ({ label: e?.name, value: e?.id })) || []
        },
        enabled: !!id,
        ...reTryQuery
    });
}