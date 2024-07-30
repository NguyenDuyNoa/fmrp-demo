import apiSalesOrder from "@/Api/apiSalesExportProduct/salesOrder/apiSalesOrder";
import { useQuery } from "@tanstack/react-query";

export const useWarehouseByBranch = () => {
    return useQuery({
        queryKey: ['api_list_warehouse_combobox_find_branch'],
        queryFn: async () => {
            const data = await apiSalesOrder.apiWarehouseComboboxFindBranch()

            return data?.map((e) => ({ label: e?.warehouse_name, value: e?.id }))
        }
    })
}