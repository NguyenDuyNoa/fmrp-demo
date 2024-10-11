import apiComons from "@/Api/apiComon/apiComon";
import { optionsQuery } from "@/configs/optionsQuery";
import { useQuery } from "@tanstack/react-query";

// đối tượng
export const useObject = (dataLang) => {
    return useQuery({
        queryKey: ['api_object'],
        queryFn: async () => {
            const data = await apiComons.apiListObject();
            return data?.map((e) => ({ label: dataLang[e?.name], value: e?.id })) || []
        },
        ...optionsQuery
    })
}
// danh sách đối tượng
export const useObjectList = (dataLang, idBranch, idObject) => {
    return useQuery({
        queryKey: ['api_object_list', idBranch, idObject],
        queryFn: async () => {
            const { rResult } = await apiComons.apiObjectList({
                params: {
                    type: idObject?.value,
                    "filter[branch_id]": idBranch?.value,
                }
            });
            return rResult?.map((e) => ({ label: dataLang[e?.name] || e?.name, value: e?.staffid || e?.id })) || []
        },
        enabled: !!idObject,
        ...optionsQuery
    })
}

///combobox đối tượng
export const useObjectCombobox = (dataLang) => {
    return useQuery({
        queryKey: ['api_object_list_combobox'],
        queryFn: async () => {
            const data = await apiComons.apiObjectCombobox();
            return data?.map(({ name, id }) => ({ label: dataLang[name], value: id }))
        },
        ...optionsQuery
    })
}
///combobox đối tượng trong phiếu thu
export const useObjectPaySlipCombobox = (dataLang) => {
    return useQuery({
        queryKey: ['api_object_combobox_payslip'],
        queryFn: async () => {
            const data = await apiComons.apiObjectPaySlipCombobox();
            return data?.map(({ name, id }) => ({ label: dataLang[name], value: id }))
        },
        ...optionsQuery
    })
}

///combobox ds đối tượng trong phiếu thu
export const useObjectListPaySlipCombobox = (params, dataLang) => {
    return useQuery({
        queryKey: ['api_object_list_combobox_payslip', { ...params }],
        queryFn: async () => {
            const { rResult } = await apiComons.apiObjectListPaySlipCombobox({ params });

            return rResult?.map(({ name, id }) => ({ label: name, value: id }))
        },
        ...optionsQuery
    })
}