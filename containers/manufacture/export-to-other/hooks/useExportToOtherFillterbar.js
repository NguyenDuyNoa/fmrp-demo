import apiExportToOther from "@/Api/apiManufacture/warehouse/exportToOther/apiExportToOther"
import { optionsQuery } from "@/configs/optionsQuery"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export const useExportToOtherFillterbar = (params) => {
    return useQuery({
        queryKey: ['api_export_to_other_fillterbar', { ...params }],
        queryFn: async () => {
            const data = await apiExportToOther.apiListGroupExportOther({ params: params })
            return data
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })
}