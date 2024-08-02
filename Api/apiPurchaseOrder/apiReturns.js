import { _ServerInstance as axiosCustom } from "@/services/axios";

const apiReturns = {
    async apiListReturns(param) {
        const response = await axiosCustom('GET', `/api_web/Api_return_supplier/returnSupplier/?csrf_protection=true`, param ? param : undefined);
        return response.data
    },
    async apiListFilterBar(param) {
        const response = await axiosCustom('GET', `/api_web/Api_return_supplier/filterBar/?csrf_protection=true`, param ? param : undefined);
        return response.data
    },
    async apiReturnsSupplierCombobox(method, param) {
        const response = await axiosCustom(method, `/api_web/Api_return_supplier/returnsupplierCombobox/?csrf_protection=true`, param ? param : undefined);
        return response.data
    },
    async apiHandingStatus(data) {
        const response = await axiosCustom('POST', `/api_web/Api_return_supplier/ConfirmWarehous?csrf_protection=true`, data);
        return response.data
    },
    async apiDetailReturns(id) {
        const response = await axiosCustom('GET', `/api_web/Api_return_supplier/returnSupplier/${id}?csrf_protection=true`);
        return response.data
    },
    async apiDetailPageReturns(id) {
        const response = await axiosCustom('GET', `/api_web/Api_return_supplier/getDetail/${id}?csrf_protection=true`);
        return response.data
    },
    async apiItemsReturn(params) {
        const response = await axiosCustom('GET', `/api_web/Api_return_supplier/getImportItems/?csrf_protection=true`, params);
        return response.data
    },
    async apiQuantityStock(id, param) {
        const response = await axiosCustom('GET', `/api_web/Api_import/quantityStock/${id}?csrf_protection=true`, param);
        return response.data
    },
    async apiHandingReturn(id, data) {
        const response = await axiosCustom('POST', id ? `/api_web/Api_return_supplier/returnSupplier/${id}?csrf_protection=true` : "/api_web/Api_return_supplier/returnSupplier/?csrf_protection=true", data);
        return response.data
    },
}
export default apiReturns