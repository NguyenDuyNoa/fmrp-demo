import apiWarehouseTransfer from "@/Api/apiManufacture/warehouse/warehouseTransfer/apiWarehouseTransfer";
import { optionsQuery } from "@/configs/optionsQuery";
import { useQuery } from "@tanstack/react-query";

export const useWarehouseTransferDetail = (open, id) => {
    return useQuery({
        queryKey: ['api_warehouse_transfer_detail', id],
        queryFn: async () => {
            const data = await apiWarehouseTransfer.apiDetailTransfer(id);
            return data
        },
        enabled: open && !!id,
        ...optionsQuery
    })

}