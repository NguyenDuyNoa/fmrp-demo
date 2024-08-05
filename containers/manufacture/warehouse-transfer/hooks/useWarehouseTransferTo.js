import apiWarehouseTransfer from "@/Api/apiManufacture/warehouse/warehouseTransfer/apiWarehouseTransfer";
import { reTryQuery } from "@/configs/configRetryQuery";
import { useQuery } from "@tanstack/react-query";

export const useWarehouseTransferTo = () => {
    return useQuery({
        queryKey: ["api_warehouse_combobox_not_system"],
        queryFn: async () => {
            const data = await apiWarehouseTransfer.apiWarehouseComboboxNotSystem();

            return data?.map((e) => ({
                label: e?.warehouse_name,
                value: e?.id,
            }))
        },
        ...reTryQuery
    })

}