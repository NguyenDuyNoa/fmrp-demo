import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiInventory = {
    async apiListInventory(param) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_inventory/inventory`, param);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiDeleteInventory(id) {
        try {
            const response = await axiosCustom('DELETE', `/api_web/api_inventory/inventory/${id}`);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiDetailInventory(id) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_inventory/inventory/${id}`);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    // form
    async apiWarehouseInventory(id) {
        try {
            const response = await axiosCustom('GET', `api_web/api_warehouse/warehouse?csrf_protection=true&filter[is_system]=2&filter[branch_id]=${id}`);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiLocationInWarehouseInventory(id) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_warehouse/LocationInWarehouse/${id}?csrf_protection=true`);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiHandingInventory(data) {
        try {
            const response = await axiosCustom('POST', `/api_web/api_inventory/addDetail?csrf_protection=true`, data);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    // popup
    async apiItemsNoneVariantInventory(param) {
        try {
            const response = await axiosCustom('POST', `/api_web/api_product/searchItemsNoneVariant?csrf_protection=true`, param);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiGetVariantInventory(param) {
        try {
            const response = await axiosCustom('POST', `/api_web/api_inventory/GetVariantInventory?csrf_protection=true`, param);
            return response.data
        } catch (error) {
            throw error;
        }
    },

}
export default apiInventory