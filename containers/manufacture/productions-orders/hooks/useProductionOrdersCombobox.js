import apiProductionsOrders from "@/Api/apiManufacture/manufacture/productionsOrders/apiProductionsOrders";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
export const useProductionOrdersCombobox = (value) => {
    return useQuery({
        queryKey: ['api_production_order_combobox', value],
        queryFn: async () => {
            const { data } = await apiProductionsOrders.apiComboboxProductionOrders({ params: { search: value } });
            return data?.po?.map((e) => {
                return { value: e?.id, label: e?.reference_no };
            }) || []
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })
}