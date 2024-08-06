import apiExportToOther from "@/Api/apiManufacture/warehouse/exportToOther/apiExportToOther";
import { optionsQuery } from "@/configs/optionsQuery";
import { useQuery } from "@tanstack/react-query";

export const useExportToOtherCombobox = (search) => {
    return useQuery({
        queryKey: ['api_export_to_other_combobox', search],
        queryFn: async () => {
            const { result } = await apiExportToOther.apiExportOtherCombobox(search ? "POST" : "GET", {
                data: { term: search }
            });
            return result?.map((e) => ({ label: e?.code, value: e.id, })) || []
        },
        ...optionsQuery
    })
}