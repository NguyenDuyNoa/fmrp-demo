import apiProductionsOrders from "@/Api/apiManufacture/manufacture/productionsOrders/apiProductionsOrders";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
export const useProductionOrdersComboboxDetail = () => {
    return useQuery({
        queryKey: ['api_production_order_detail_combobox'],
        queryFn: async () => {
            const { data } = await apiProductionsOrders.apiComboboxProductionOrdersDetail();

            return data?.pod?.map((e) => {
                return { value: e?.id, label: e?.reference_no_detail };
            }) || []
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })
}