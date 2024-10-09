import apiComons from "@/Api/apiComon/apiComon";
import apiProducts from "@/Api/apiProducts/products/apiProducts";
import { optionsQuery } from "@/configs/optionsQuery";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
// danh sách thành phẩm type thành phẩm
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

// ds thành phẩm DÙNG KHNB VÀ KHSX
export const useProductsVariantByBranchSearch = (branch, search) => {
    return useQuery({
        queryKey: ["api_products_variant_branch_search", branch, search],
        queryFn: async () => {
            const { data } = await apiComons.apiSearchProductsVariant({
                params: {
                    "filter[branch_id]": branch !== null ? +branch.value : null,
                },
                data: {
                    term: search,
                }
            });
            return data?.result?.map((e) => ({
                label: `${e.name}
                    <spa style={{display: none}}>${e.code}</spa
                    <span style={{display: none}}>${e.text_type} ${e.unit_name} ${e.product_variation} </span>`,
                value: e.id,
                e,
            })) || [];
        },
        enabled: !!branch,
        ...optionsQuery
    })
}