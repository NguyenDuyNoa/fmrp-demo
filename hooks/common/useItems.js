import apiComons from "@/Api/apiComon/apiComon";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import apiVariant from "@/Api/apiSettings/apiVariant";
import { optionsQuery } from "@/configs/optionsQuery";

// ds đơn vị tính
export const useUnitList = () => {
    const dispatch = useDispatch()

    return useQuery({
        queryKey: ['api_unit_list'],
        queryFn: async () => {
            const { rResult } = await apiComons.apiUnit({})

            const unit = rResult?.map((e) => ({ label: e.unit, value: e.id }))

            dispatch({
                type: "unit_NVL/update",
                payload: unit
            })

            dispatch({
                type: "unit_finishedProduct/update",
                payload: unit
            });
            return unit
        },
        ...optionsQuery
    })
}

// ds biến thể combobox
export const useVariantList = (params = undefined) => {
    const dispatch = useDispatch()
    return useQuery({
        queryKey: ['api_variation', { ...params }],
        queryFn: async () => {

            const { rResult } = await apiVariant.apiListVariant({ params: params })

            const variation = rResult?.map((e) => ({
                label: e.name,
                value: e.id,
                option: e.option,
            }))

            dispatch({
                type: "variant_NVL/update",
                payload: variation
            });
            return variation
        },
        ...optionsQuery
    })
}

/// lệnh sản xuất
export const useItemsVariantSearchCombobox = (value) => {
    return useQuery({
        queryKey: ['api_items_variation_search_combobox', value],
        queryFn: async () => {
            const { data } = await apiComons.apiListItemsVariant({ data: { term: value } });
            const newData = data?.result.map((e) => ({
                label: `${e.name} <span style={{display: none}}>${e.code}</span> <span style={{display: none}}>${e.text_type} ${e.unit_name} ${e.product_variation} </span>`,
                value: e.id,
                e,
            })) || []
            return newData
        },
        ...optionsQuery
    })
}

