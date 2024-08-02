import apiReturns from "@/Api/apiPurchaseOrder/apiReturns";
import { reTryQuery } from "@/configs/configRetryQuery";
import { useQuery } from "@tanstack/react-query";

export const useReturnItemsBySupplier = (idSupplier, params) => {
    return useQuery({
        queryKey: ["api_item_return_by_supplier", params],
        queryFn: async () => {
            const { data } = await apiReturns.apiItemsReturn({ params: params });

            return data?.result?.map((e) => ({
                label: `${e.name}
                <span style={{display: none}}>${e.code}</span>
                <span style={{display: none}}>${e.product_variation} </span>
                <span style={{display: none}}>${e.serial} </span>
                <span style={{display: none}}>${e.lot} </span>
                <span style={{display: none}}>${e.expiration_date} </span>
                <span style={{display: none}}>${e.text_type} ${e.unit_name} </span>`,
                value: e.id,
                e,
            }));
        },
        enabled: !!idSupplier,
        ...reTryQuery
    })

}