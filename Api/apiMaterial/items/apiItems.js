import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiItems = {
    async apiListItems(params) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_material/material?csrf_protection=true`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiDetailItems(id) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_material/material/${id}?csrf_protection=true`);
            return response.data
        } catch (error) {
            throw error;
        }
    },

    async apiHandingItems(data, id) {
        try {
            const response = await axiosCustom('POST', id ? `/api_web/api_material/material/${id}?csrf_protection=true` : "/api_web/api_material/material?csrf_protection=true", data);
            return response.data
        } catch (error) {
            throw error;
        }
    },
}

export default apiItems