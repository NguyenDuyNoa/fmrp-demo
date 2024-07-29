import apiProducts from "@/Api/apiProducts/products/apiProducts";
import { useQuery } from "@tanstack/react-query";

export const useProductDetail = (open, id) => {
    return useQuery({
        queryKey: ["api_products_detail", id],
        queryFn: async () => {
            const data = await apiProducts.apiDetailProducts(id)

            return data
        },
        enabled: !!open
    })
}