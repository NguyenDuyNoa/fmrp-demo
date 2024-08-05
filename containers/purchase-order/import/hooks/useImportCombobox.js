import apiImport from "@/Api/apiPurchaseOrder/apiImport";
import { optionsQuery } from "@/configs/optionsQuery";
import { useQuery } from "@tanstack/react-query";

export const useImportCombobox = (search) => {
    return useQuery({
        queryKey: ["api_import_combobox", search],
        queryFn: async () => {

            const { result } = await apiImport.apiImportCombobox(search ? 'POST' : 'GET', {
                data: {
                    term: search,
                }
            });

            return result?.map((e) => ({ label: `${e.code}`, value: e.id })) || []
        },
        ...optionsQuery
    })

}