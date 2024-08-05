import apiWarehouseTransfer from "@/Api/apiManufacture/warehouse/warehouseTransfer/apiWarehouseTransfer";
import { optionsQuery } from "@/configs/optionsQuery";
import { useQuery } from "@tanstack/react-query";

export const useWarehouseTransferItems = (idBranch, idExportWarehouse) => {
    return useQuery({
        queryKey: ["api_warehouse_transfer_items_all", idBranch, idExportWarehouse],
        queryFn: async () => {
            const { data } = await apiWarehouseTransfer.apiGetSemiItems("GET", {
                params: {
                    "filter[branch_id]": idBranch ? idBranch?.value : null,
                    "filter[warehouse_id]": idExportWarehouse ? idExportWarehouse?.value : null,
                },
            });
            return data?.result?.map((e) => ({
                label: `${e.name}
                        <span style={{display: none}}>${e.code}</span>
                        <span style={{display: none}}>${e.product_variation} </span>
                        <span style={{display: none}}>${e.serial} </span>
                        <span style={{display: none}}>${e.lot} </span>
                        <span style={{display: none}}>${e.expiration_date} </span>
                        <span style={{display: none}}>${e.text_type} ${e.unit_name} </span>`,
                value: e.id,
                e,
            }));
        },
        ...optionsQuery,
        enabled: !!idExportWarehouse
    })

}