import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiCategory = {
    async apiListCategory(params) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_product/category/?csrf_protection=true`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiOptionCategory(prams) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_product/categoryOption/?csrf_protection=true`, prams);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiDetailCategory(id) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_product/category/${id}?csrf_protection=true`);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiDetailOptionCategory(id, params) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_product/categoryOption/${id}?csrf_protection=true`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiHandingCategory(id, data) {
        try {
            const response = await axiosCustom('POST', id ? `/api_web/api_product/category/${id}?csrf_protection=true` : "/api_web/api_product/category?csrf_protection=true", data);
            return response.data
        } catch (error) {
            throw error;
        }
    },

}

export default apiCategory