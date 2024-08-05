import apiComons from "@/Api/apiComon/apiComon";
import apiReturnSales from "@/Api/apiSalesExportProduct/returnSales/apiReturnSales";
import apiSalesOrder from "@/Api/apiSalesExportProduct/salesOrder/apiSalesOrder";
import { optionsQuery } from "@/configs/optionsQuery";
import { useQuery } from "@tanstack/react-query";

export const useWarehouseTranfer = () => {
    return useQuery({
        queryKey: ['api_list_transfer'],
        queryFn: async () => {
            const { result } = await apiSalesOrder.apiListTransferCombobox()

            return result?.map(({ code, id }) => ({ label: code, value: id }))
        },
        ...optionsQuery
    })
}

///combobox kho nhập ở model kho & sản xuất
export const useWarehouseComboboxByManufacture = () => {
    return useQuery({
        queryKey: ['api_warehouse_combobox_manufacturer'],
        queryFn: async () => {
            const data = await apiComons.apiComboboxWarehouseManufacture({})

            return data?.map((e) => ({ label: e?.warehouse_name, value: e?.id })) || []
        },
        ...optionsQuery
    })
}

///combobox nhập kho tp kho
export const useWarehouseComboboxByManufactureByBranch = (idBranch, idImportWarehouse) => {
    const params = {
        "filter[branch_id]": idBranch ? idBranch?.value : null,
        "filter[warehouse_id]": idImportWarehouse ? idImportWarehouse?.value : undefined
    }
    return useQuery({
        queryKey: ['api_warehouse_combobox_manufacturer_branch', { ...params }],
        queryFn: async () => {
            const data = await apiComons.apiComboboxWarehouseManufacture({ params: params })

            return data?.map((e) => ({ label: e?.warehouse_name, value: e?.id })) || []
        },
        enabled: !!idBranch,
        ...optionsQuery
    })
}


export const useWarehouseByBranch = () => {
    return useQuery({
        queryKey: ['api_warehouse_combobox_find_branch'],
        queryFn: async () => {
            const data = await apiSalesOrder.apiWarehouseComboboxFindBranch()

            return data?.map((e) => ({ label: e?.warehouse_name, value: e?.id }))
        }
    })
}

export const useWarehouseComboboxlocation = (params) => {
    return useQuery({
        queryKey: ['api_warehouse_combobox_location', { ...params }],
        queryFn: async () => {
            const { rResult } = await apiReturnSales.apiComboboxLocation({ params });

            return rResult?.map((e) => ({
                label: e?.name,
                value: e?.id,
                warehouse_name: e?.warehouse_name,
            }))

        },
        ...optionsQuery
    })
}


export const useLocationByWarehouseTo = (idWarehouse, idBranch = undefined) => {
    const params = {
        "filter[warehouse_id]": idWarehouse ? idWarehouse?.value : null,
        "filter[branch_id]": idBranch ? idBranch?.value : null
    };
    return useQuery({
        queryKey: ["api_location_combobox", { ...params }],
        queryFn: async () => {

            const data = await apiComons.apiLocationWarehouseTo({ params: params });

            return data?.map((e) => ({
                label: e?.location_name,
                value: e?.id,
            }))
        },
        enabled: (!!idWarehouse || !!idBranch)
    })
}