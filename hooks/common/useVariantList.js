import apiVariant from "@/Api/apiSettings/apiVariant";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

export const useVariantList = () => {
    const dispatch = useDispatch()
    return useQuery({
        queryKey: ['api_variation'],
        queryFn: async () => {

            const { rResult } = await apiVariant.apiListVariant({})

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