import apiDepartments from "@/Api/apiPersonnel/apiDepartments";
import { reTryQuery } from "@/configs/configRetryQuery";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

export const useDepartmentList = (params, sTotalItem) => {
    const dispatch = useDispatch()
    return useQuery({
        queryKey: ['api_list_departments', { ...params }],
        queryFn: async () => {

            const { rResult, output } = await apiDepartments.apiListDepartment({ params })
            sTotalItem(output)

            dispatch({
                type: "department_staff/update",
                payload: rResult.map((e) => ({
                    label: e.name,
                    value: e.id,
                })),
            });
            return { rResult, output }
        },
        ...reTryQuery
    })
}