import { _ServerInstance as axiosCustom } from "@/services/axios";

const apiLocationWarehouse = {

    async apiLocationWarehouse(param) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_warehouse/location/?csrf_protection=true`, param);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiListWarehouse(param) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_warehouse/warehouse/?csrf_protection=true`, param);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiHandingStatus(id, data) {
        try {
            const response = await axiosCustom('POST', `/api_web/api_warehouse/locationStatus/${id}?csrf_protection=true`, data);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiHandingLocation(url, data) {
        try {
            const response = await axiosCustom('POST', `${url}`, data);
            return response.data
        } catch (error) {
            throw error;
        }
    },

}
export default apiLocationWarehouse