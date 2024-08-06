import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiExportToOther = {
    async apiListExportOther(param) {
        const response = await axiosCustom('GET', `/api_web/Api_export_other/exportOther/?csrf_protection=true`, param);
        return response.data
    },
    async apiListGroupExportOther(param) {
        const response = await axiosCustom('GET', `/api_web/Api_export_other/filterBar/?csrf_protection=true`, param);
        return response.data
    },
    async apiExportOtherCombobox(method, params) {
        const response = await axiosCustom(method, `/api_web/Api_export_other/exportOtherCombobox/?csrf_protection=true`, params);
        return response.data
    },
    async apiWarehouseCombobox() {
        const response = await axiosCustom('GET', `/api_web/Api_warehouse/warehouseCombobox/?csrf_protection=true`,);
        return response.data
    },

    async apiHandingStatus(data) {
        const response = await axiosCustom('POST', `/api_web/Api_export_other/confirmWarehouse?csrf_protection=true`, data);
        return response.data
    },
    async apiDetailExportToOther(id) {
        const response = await axiosCustom('GET', `/api_web/Api_export_other/exportOther/${id}?csrf_protection=true`);
        return response.data
    },
    async apiDetaiPageExportToOther(id) {
        const response = await axiosCustom('GET', `/api_web/Api_export_other/getExportOtherDetail/${id}?csrf_protection=true`);
        return response.data
    },
    async apiItemComboboxExportToOther(method, param) {
        const response = await axiosCustom(method, `/api_web/Api_export_other/itemCombobox/?csrf_protection=true`, param);
        return response.data
    },

    async apiWarehouseComboboxExportToOther(param) {
        const response = await axiosCustom('GET', `/api_web/Api_warehouse/warehouseCombobox/?csrf_protection=true`, param);
        return response.data
    },

    async apiHandingExportToOther(id, data) {
        const response = await axiosCustom('POST', id ? `/api_web/Api_export_other/exportOther/${id}?csrf_protection=true` : `/api_web/Api_export_other/exportOther/?csrf_protection=true`, data);
        return response.data
    },
}
export default apiExportToOther