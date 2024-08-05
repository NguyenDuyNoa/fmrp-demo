import apiWarehouseTransfer from "@/Api/apiManufacture/warehouse/warehouseTransfer/apiWarehouseTransfer";
import { reTryQuery } from "@/configs/configRetryQuery";
import { useQuery } from "@tanstack/react-query";

export const useWarehouseTransferExport = (idBranch, idExportWarehouse) => {
    return useQuery({
        queryKey: ["api_warehouse_combobox_export", idBranch],
        queryFn: async () => {

            const params = {
                "filter[branch_id]": idBranch ? idBranch?.value : null,
                "filter[warehouse_id]": idExportWarehouse ? idExportWarehouse?.value : null,
            };

            const data = await apiWarehouseTransfer.apiWarehouseCombobox({ params: params });

            return data?.map((e) => ({
                label: e?.warehouse_name,
                value: e?.id,
            }))
        },
        enabled: !!idBranch,
        ...reTryQuery
    })

}