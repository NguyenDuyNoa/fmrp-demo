import apiProductionWarehouse from "@/Api/apiManufacture/warehouse/productionWarehouse/apiProductionWarehouse";
import { reTryQuery } from "@/configs/configRetryQuery";
import { useQuery } from "@tanstack/react-query"

export const useProductionWarehouseItems = ({ idBranch }) => {
    const params = {
        "filter[branch_id]": idBranch ? idBranch?.value : null,
    }
    return useQuery({
        queryKey: ["api_production_warehouse_items", { ...params }],
        queryFn: async () => {
            const { data } = await apiProductionWarehouse.apiSemiItemsProductionWarehouse("GET", { params: params });

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
        enabled: !!idBranch,
        ...reTryQuery
    })
}