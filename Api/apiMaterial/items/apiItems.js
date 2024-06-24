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
    async apiUnitItems() {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_unit/unit/?csrf_protection=true`);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiCategoryOptionItems(params) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_material/categoryOption?csrf_protection=true`, params ? params : undefined);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiVariationItems() {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_variation/variation?csrf_protection=true`);
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