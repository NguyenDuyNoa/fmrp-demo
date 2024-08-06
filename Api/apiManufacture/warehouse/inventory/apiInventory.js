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