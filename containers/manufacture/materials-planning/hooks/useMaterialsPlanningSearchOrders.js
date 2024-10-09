import apiMaterialsPlanning from "@/Api/apiManufacture/manufacture/materialsPlanning/apiMaterialsPlanning";
import { optionsQuery } from "@/configs/optionsQuery";
import { useQuery } from "@tanstack/react-query";

export const useMaterialsPlanningSearchOrders = (value) => {
    return useQuery({
        queryKey: ["api_search_orders", value],
        queryFn: async () => {
            const { data } = await apiMaterialsPlanning.apiSearchOrders({ params: { search: value } });
            return data?.items?.map((e) => {
                return {
                    value: e?.id,
                    label: e?.reference_no,
                };
            }) || []
        },
        ...optionsQuery
    })
}