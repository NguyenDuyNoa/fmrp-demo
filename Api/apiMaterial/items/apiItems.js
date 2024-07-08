import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiItems = {
    async apiListItems(params) {
        const response = await axiosCustom('GET', `/api_web/api_material/material?csrf_protection=true`, params);
        return response.data
    },
    async apiDetailItems(id) {
        const response = await axiosCustom('GET', `/api_web/api_material/material/${id}?csrf_protection=true`);
        return response.data
    },

    async apiHandingItems(data, id) {
        const response = await axiosCustom('POST', id ? `/api_web/api_material/material/${id}?csrf_protection=true` : "/api_web/api_material/material?csrf_protection=true", data);
        return response.data
    },
}

export default apiItems