import apiExportToOther from "@/Api/apiManufacture/warehouse/exportToOther/apiExportToOther";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useExportToOtherList = (params) => {
    return useQuery({
        queryKey: ['api_export_to_other', { ...params }],
        queryFn: async () => {
            const { rResult, output, rTotal } = await apiExportToOther.apiListExportOther({ params: params });
            return { rResult, output, rTotal }
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })
}