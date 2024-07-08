import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiInventory = {
    async apiListInventory(param) {
        const response = await axiosCustom('GET', `/api_web/api_inventory/inventory`, param);
        return response.data
    },
    async apiDeleteInventory(id) {
        const response = await axiosCustom('DELETE', `/api_web/api_inventory/inventory/${id}`);
        return response.data
    },
    async apiDetailInventory(id) {
        const response = await axiosCustom('GET', `/api_web/api_inventory/inventory/${id}`);
        return response.data
    },
    // form
    async apiWarehouseInventory(id) {
        const response = await axiosCustom('GET', `api_web/api_warehouse/warehouse?csrf_protection=true&filter[is_system]=2&filter[branch_id]=${id}`);
        return response.data
    },
    async apiLocationInWarehouseInventory(id) {
        const response = await axiosCustom('GET', `/api_web/api_warehouse/LocationInWarehouse/${id}?csrf_protection=true`);
        return response.data
    },
    async apiHandingInventory(data) {
        const response = await axiosCustom('POST', `/api_web/api_inventory/addDetail?csrf_protection=true`, data);
        return response.data
    },
    // popup
    async apiItemsNoneVariantInventory(param) {
        const response = await axiosCustom('POST', `/api_web/api_product/searchItemsNoneVariant?csrf_protection=true`, param);
        return response.data
    },
    async apiGetVariantInventory(param) {
        const response = await axiosCustom('POST', `/api_web/api_inventory/GetVariantInventory?csrf_protection=true`, param);
        return response.data
    },

}
export default apiInventory