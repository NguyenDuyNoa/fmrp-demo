import { _ServerInstance as axiosCustom } from "@/services/axios";

const apiWarehouse = {

    async apiListWarehouse(param) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_warehouse/warehouse/?csrf_protection=true`, param);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiHandingWarehouse(url, data) {
        try {
            const response = await axiosCustom('POST', `${url}`, data);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiWarehouseDetail(id, param) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_warehouse/warehouse_detail/${id}?csrf_protection=true`, param);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiLocationWarehouse(id) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_warehouse/location/?csrf_protection=true&filter[warehouse_id]=${id}`);
            return response.data
        } catch (error) {
            throw error;
        }
    },

}
export default apiWarehouse