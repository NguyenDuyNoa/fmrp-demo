import apiPurchases from "@/Api/apiPurchaseOrder/apiPurchases";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const usePurchasesFilterbar = (key) => {
    const params = {
        ...key,
        "filter[status]": undefined,
        "filter[id]": undefined,
        "filter[staff_id]": undefined,
        page: undefined,
    }
    return useQuery({
        queryKey: ["api_list_group", { ...params }],
        queryFn: async () => {
            const data = await apiPurchases.apiGroupPurchases({
                params: {
                    ...params,
                    limit: 0,
                    page: undefined,
                }
            })
            return data?.map(e => ({
                ...e,
                id: e?.name == 'all' ? 'all' : e?.id
            }))
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })

}