import apiWarehouseTransfer from "@/Api/apiManufacture/warehouse/warehouseTransfer/apiWarehouseTransfer";
import { reTryQuery } from "@/configs/configRetryQuery";
import { useQuery } from "@tanstack/react-query";

export const useWarehouseTransferCombobox = (serach) => {
    return useQuery({
        queryKey: ["api_warehouse_transfer_list_code", serach],
        queryFn: async () => {

            const { result } = await apiWarehouseTransfer.apiTransferCombobox(serach ? "POST" : "GET", {
                data: {
                    term: serach,
                },
            });
            return result?.map((e) => ({ label: e.code, value: e.id })) || []
        },
        ...reTryQuery
    })

}