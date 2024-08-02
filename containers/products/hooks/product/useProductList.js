import apiProducts from "@/Api/apiProducts/products/apiProducts";
import { reTryQuery } from "@/configs/configRetryQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useProductList = (params) => {
    return useQuery({
        queryKey: ["api_products", { ...params }],
        queryFn: async () => {

            const { output, rResult } = await apiProducts.apiListProducts({ params })

            return {
                output,
                rResult,
                finishedPro: rResult.map((e) => ({
                    label: `${e.code} (${e.name})`,
                    value: e.id,
                })) || []
            }
        },
        placeholderData: keepPreviousData,
        ...reTryQuery
    })
}