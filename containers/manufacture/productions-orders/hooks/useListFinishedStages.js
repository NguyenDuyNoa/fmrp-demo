import apiProductionsOrders from "@/Api/apiManufacture/manufacture/productionsOrders/apiProductionsOrders";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
export const useListFinishedStages = (params) => {
    return useQuery({
        queryKey: ['apiFinishedStages', { ...params }],
        queryFn: async () => {
            const { data } = await apiProductionsOrders.apiFinishedStages(params.id);
            return {
                ...data,
                warehouses: data?.warehouses?.map(e => ({ ...e, label: e?.name, value: e?.id }))
            }
        },
        placeholderData: keepPreviousData,
        enabled: !!params.id && params.open,
        ...optionsQuery
    })
}