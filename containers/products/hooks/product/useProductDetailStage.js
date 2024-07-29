import apiProducts from "@/Api/apiProducts/products/apiProducts";
import { useQuery } from "@tanstack/react-query";

export const useProductDetailStage = (open, id) => {
    return useQuery({
        queryKey: ["api_detail_stage_product"],
        queryFn: async () => {
            const data = await apiProducts.apiDetailStageProducts(id)

            return data
        },
        enabled: !!open
    })
}