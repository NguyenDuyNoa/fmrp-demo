import apiOrder from "@/Api/apiPurchaseOrder/apiOrder"
import { reTryQuery } from "@/configs/configRetryQuery"
import { useQuery } from "@tanstack/react-query"

export const useOrderTypeList = (dataLang) => {
    return useQuery({
        queryKey: ["api_order_type"],
        queryFn: async () => {

            const listOrderType = await apiOrder.apiListOrderType()

            return listOrderType?.map((e) => ({ label: dataLang[e?.name], value: e.id })) || []
        },
        ...reTryQuery
    })
}