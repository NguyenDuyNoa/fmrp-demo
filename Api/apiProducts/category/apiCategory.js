import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiCategory = {
    async apiListCategory(params) {
        const response = await axiosCustom('GET', `/api_web/api_product/category/?csrf_protection=true`, params);
        return response.data
    },
    async apiOptionCategory(prams) {
        const response = await axiosCustom('GET', `/api_web/api_product/categoryOption/?csrf_protection=true`, prams);
        return response.data
    },
    async apiDetailCategory(id) {
        const response = await axiosCustom('GET', `/api_web/api_product/category/${id}?csrf_protection=true`);
        return response.data
    },
    async apiDetailOptionCategory(id, params) {
        const response = await axiosCustom('GET', `/api_web/api_product/categoryOption/${id}?csrf_protection=true`, params);
        return response.data
    },
    async apiHandingCategory(id, data) {
        const response = await axiosCustom('POST', id ? `/api_web/api_product/category/${id}?csrf_protection=true` : "/api_web/api_product/category?csrf_protection=true", data);
        return response.data
    },

}

export default apiCategory