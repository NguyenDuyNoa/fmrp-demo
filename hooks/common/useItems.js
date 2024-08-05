import apiComons from "@/Api/apiComon/apiComon";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import apiVariant from "@/Api/apiSettings/apiVariant";

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
        }
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
        }
    })
}