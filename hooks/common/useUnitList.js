import apiComons from "@/Api/apiComon/apiComon";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

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
            return unit
        }
    })
}