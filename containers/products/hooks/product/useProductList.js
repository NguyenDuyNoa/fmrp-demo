import apiProducts from "@/Api/apiProducts/products/apiProducts";
import { reTryQuery } from "@/configs/configRetryQuery";
import { useQuery } from "@tanstack/react-query";

export const useProductList = (params, sTotalItems) => {
    return useQuery({
        queryKey: ["api_products", { ...params }],
        queryFn: async () => {

            const { output, rResult } = await apiProducts.apiListProducts({ params })

            sTotalItems(output)

            return {
                output,
                rResult,
                finishedPro: rResult.map((e) => ({
                    label: `${e.code} (${e.name})`,
                    value: e.id,
                })) || []
            }
        },
        ...reTryQuery
    })
}