import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiProductionWarehouse = {
    async apiListProductionWarehouse(param) {
        const response = await axiosCustom('GET', `/api_web/Api_stock/exportProduction/?csrf_protection=true`, param);
        return response.data
    },
    async apiListGroupProductionWarehouse(param) {
        const response = await axiosCustom('GET', `/api_web/Api_stock/exportProductionFilterBar/?csrf_protection=true`, param);
        return response.data
    },

    async apiCodeProductionWarehouse() {
        const response = await axiosCustom('GET', `/api_web/Api_stock/exportProductionCombobox/?csrf_protection=true`,);
        return response.data
    },
    async apiAjaxCodeProductionWarehouse(data) {
        const response = await axiosCustom('POST', `/api_web/Api_stock/exportProductionCombobox/?csrf_protection=true`, data);
        return response.data
    },
    async apiComboboxWarehouse(param) {
        const response = await axiosCustom('GET', `/api_web/Api_warehouse/warehouseCombobox/?csrf_protection=true`, param);
        return response.data
    },

    async apiDetailProductionWarehouse(id) {
        const response = await axiosCustom('GET', `/api_web/Api_stock/exportProduction/${id}?csrf_protection=true`);
        return response.data
    },
    async apiHangdingStatusWarehouse(data) {
        const response = await axiosCustom('POST', `/api_web/Api_stock/confirmWarehouse?csrf_protection=true`, data);
        return response.data
    },
    //form
    async apiDetailPageProductionWarehouse(id) {
        const response = await axiosCustom('GET', `/api_web/Api_stock/getExportProductionDetail/${id}?csrf_protection=true`);
        return response.data
    },
    async apiSemiItemsProductionWarehouse(method, param) {
        const response = await axiosCustom(method, `/api_web/Api_stock/getItemsProduction`, param);
        return response.data
    },

    async apiHangdingProductionWarehouse(id, data) {
        const response = await axiosCustom('POST', id ? `/api_web/Api_stock/exportProduction/${id}?csrf_protection=true` : `/api_web/Api_stock/exportProduction/?csrf_protection=true`, data);
        return response.data
    },

}
export default apiProductionWarehouse