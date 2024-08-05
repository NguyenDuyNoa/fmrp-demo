import apiPurchases from "@/Api/apiPurchaseOrder/apiPurchases";
import { optionsQuery } from "@/configs/optionsQuery";
import { useQuery } from "@tanstack/react-query";

export const usePurchasesItems = (id, search) => {
    return useQuery({
        queryKey: ["api_purchases_items_variant", id, search],
        queryFn: async () => {
            let form = new FormData()
            form.append("term", search)
            if (id != null) {
                [+id?.value].forEach((e, index) => form.append(`branch_id[${index}]`, e))
            }

            const { data: { result } } = await apiPurchases.apiItemsVariantPurchases(form);

            return result?.map((e) => ({
                label: `${e.name} <span style={{display: none}}>${e.code}</span><span style={{display: none}}>${e.product_variation} </span><span style={{display: none}}>${e.text_type} ${e.unit_name} </span>`,
                value: e.id,
                e,
            }))
        },
        ...optionsQuery,
    })
}