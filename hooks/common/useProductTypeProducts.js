import apiProducts from "@/Api/apiProducts/products/apiProducts";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

export const useProductTypeProducts = () => {
    const dispatch = useDispatch();
    return useQuery({
        queryKey: ["api_products_type_products"],
        queryFn: async () => {

            const data = await apiProducts.apiProductTypeProducts();

            dispatch({
                type: "type_finishedProduct/update",
                payload: data?.map((e) => ({
                    label: dataLang[e.name],
                    value: e.code,
                })),
            });

            return data

        }
    })
}