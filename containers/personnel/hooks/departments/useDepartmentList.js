import apiDepartments from "@/Api/apiPersonnel/apiDepartments";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

export const useDepartmentList = (params) => {
    const dispatch = useDispatch()
    return useQuery({
        queryKey: ['api_list_departments', { ...params }],
        queryFn: async () => {

            const { rResult, output } = await apiDepartments.apiListDepartment({ params })

            dispatch({
                type: "department_staff/update",
                payload: rResult.map((e) => ({
                    label: e.name,
                    value: e.id,
                })),
            });
            return { rResult, output }
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })
}