import { _ServerInstance as axiosCustom } from "@/services/axios";

const apiRecall = {
    async apiListRecall(param) {
        const response = await axiosCustom('GET', `/api_web/Api_material_recall/materialRecall/?csrf_protection=true`, param);
        return response.data
    },
    async apiListGroupRecall(param) {
        const response = await axiosCustom('GET', `/api_web/Api_material_recall/filterBar/?csrf_protection=true`, param);
        return response.data
    },
    async apiMaterialRecallCombobox(method, params) {
        const response = await axiosCustom(method, `/api_web/Api_material_recall/materialRecallCombobox/?csrf_protection=true`, params);
        return response.data
    },

    async apiWarehouseCombobox() {
        const response = await axiosCustom('GET', `/api_web/Api_warehouse/warehouseCombobox/?csrf_protection=true`);
        return response.data
    },
    async apiHandingStatusRecall(data) {
        const response = await axiosCustom('POST', `/api_web/Api_material_recall/confirmWarehouse/?csrf_protection=true`, data);
        return response.data
    },
    async apiDetailRecall(id) {
        const response = await axiosCustom('GET', `/api_web/Api_material_recall/materialRecall/${id}?csrf_protection=true`);
        return response.data
    },
    async apiDetailPageRecall(id) {
        const response = await axiosCustom('GET', `/api_web/Api_material_recall/getMaterialRecallDetail/${id}?csrf_protection=true`);
        return response.data
    },
    async apiItemsRecall(method, data) {
        const response = await axiosCustom(method, `/api_web/Api_material_recall/itemCombobox/?csrf_protection=true`, data);
        return response.data
    },
    async apiWarehouseLocationCombobox(param) {
        const response = await axiosCustom('GET', `/api_web/Api_warehouse/warehouseLocationCombobox/?csrf_protection=true`, param);
        return response.data
    },
    async apiHandingRecall(id, data) {
        const response = await axiosCustom('POST', id ? `/api_web/Api_material_recall/materialRecall/${id}?csrf_protection=true` : `/api_web/Api_material_recall/materialRecall/?csrf_protection=true`, data);
        return response.data
    },
}
export default apiRecall