import { _ServerInstance as axiosCustom } from "@/services/axios";

const apiImport = {
    async apiListImport(param) {
        const response = await axiosCustom('GET', `/api_web/Api_import/import/?csrf_protection=true`, param ? param : undefined);
        return response.data
    },
    async apiListFilterBar(param) {
        const response = await axiosCustom('GET', `/api_web/Api_import/filterBar/?csrf_protection=true`, param ? param : undefined);
        return response.data
    },
    async apiImportCombobox(method, param) {
        const response = await axiosCustom(method, `/api_web/Api_import/importCombobox/?csrf_protection=true`, param ? param : undefined);
        return response.data
    },
    async apiHandingStatus(data) {
        const response = await axiosCustom('POST', `/api_web/api_import/ConfirmWarehous?csrf_protection=true`, data);
        return response.data
    },
    async apiDetailImport(id) {
        const response = await axiosCustom('GET', `/api_web/Api_import/import/${id}?csrf_protection=true`);
        return response.data
    },
    async apiDetailPageImport(id) {
        const response = await axiosCustom('GET', `/api_web/Api_import/getImport/${id}?csrf_protection=true`);
        return response.data
    },
    async apiNotStockCombobox(method, params) {
        const response = await axiosCustom(method, `/api_web/Api_purchase_order/purchase_order_not_stock_combobox/?csrf_protection=true`, params);
        return response.data
    },
    async apiSearchItems(params) {
        const response = await axiosCustom('GET', `/api_web/Api_purchase_order/searchItemsVariant/?csrf_protection=true`, params);
        return response.data
    },
    async apiHandingImport(id, data) {
        const response = await axiosCustom('POST', id ? `/api_web/Api_import/import/${id}?csrf_protection=true` : "/api_web/Api_import/import/?csrf_protection=true", data);
        return response.data
    },
}
export default apiImport