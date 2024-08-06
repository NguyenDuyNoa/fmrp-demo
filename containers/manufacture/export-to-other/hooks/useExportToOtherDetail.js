import apiExportToOther from "@/Api/apiManufacture/warehouse/exportToOther/apiExportToOther";
import { optionsQuery } from "@/configs/optionsQuery";
import { useQuery } from "@tanstack/react-query";

export const useExportToOtherDetail = (open, id) => {
    return useQuery({
        queryKey: ['api_export_to_other_detail', id],
        queryFn: async () => {
            const data = await apiExportToOther.apiDetailExportToOther(id);
            return data
        },
        enabled: open && !!id,
        ...optionsQuery
    })
}