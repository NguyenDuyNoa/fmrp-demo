import apiExportToOther from "@/Api/apiManufacture/warehouse/exportToOther/apiExportToOther";
import { optionsQuery } from "@/configs/optionsQuery";
import { useQuery } from "@tanstack/react-query";

export const useExportToOtherObject = (dataLang) => {
    return useQuery({
        queryKey: ['api_export_to_other_object'],
        queryFn: async () => {
            const data = await apiExportToOther.apiListObject();
            return data?.map((e) => ({ label: dataLang[e?.name], value: e?.id })) || []
        },
        ...optionsQuery
    })
}