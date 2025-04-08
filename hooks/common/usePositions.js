import apiSatff from "@/Api/apiPersonnel/apiStaff";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
// danh sách chức vụ
export const usePositionLits = () => {
    const dispatch = useDispatch();
    return useQuery({
        queryKey: ["api_position_list"],
        queryFn: async () => {

            const { rResult } = await apiSatff.apiListPositionOption({});

            const newData = rResult.map((x) => ({
                label: x?.name,
                value: x?.id,
                level: x?.level,
                code: x?.code,
                parent_id: x?.parent_id,
            })) || []

            dispatch({
                type: "position_staff/update",
                payload: newData
            });

            return newData
        }
    })
}