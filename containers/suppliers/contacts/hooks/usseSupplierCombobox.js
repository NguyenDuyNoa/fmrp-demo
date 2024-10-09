import apiComons from "@/Api/apiComon/apiComon";
import { useQuery } from "@tanstack/react-query";

export const usseSupplierCombobox = () => {
    return useQuery({
        queryKey: ["api_supplier_combobox"],
        queryFn: async () => {

            const { rResult } = await apiComons.apiClientContact({ params: { limit: 0 } });

            return rResult?.map((e) => ({ label: e.code, value: e.id })) || []
        }
    })

}