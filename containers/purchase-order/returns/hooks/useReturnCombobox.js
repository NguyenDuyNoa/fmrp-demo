import apiReturns from "@/Api/apiPurchaseOrder/apiReturns";
import { optionsQuery } from "@/configs/optionsQuery";
import { useQuery } from "@tanstack/react-query";

export const useReturnCombobox = (search) => {
    return useQuery({
        queryKey: ["api_filter_combobox", search],
        queryFn: async () => {
            const { result } = await apiReturns.apiReturnsSupplierCombobox(search ? "POST" : "GET", {
                data: {
                    term: search,
                }
            });
            return result?.map((e) => ({ label: e.code, value: e.id })) || []
        },
        ...optionsQuery
    })
}