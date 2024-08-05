import apiRecall from "@/Api/apiManufacture/warehouse/recall/apiRecall";
import { useQuery } from "@tanstack/react-query";

export const useRecallCombobox = (search) => {
    return useQuery({
        queryKey: ["api_recall_combobox", search],
        queryFn: async () => {
            const { result } = await apiRecall.apiMaterialRecallCombobox(search ? "POST" : "GET", { data: { term: search } });
            return result?.map((e) => ({ label: e.code, value: e.id })) || [];
        }
    })
}