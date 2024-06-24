import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiCategory = {
    async apiListCategory(params) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_material/category?csrf_protection=true`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiCategoryOptionCategory() {
        try {
            const response = await axiosCustom('GET', `/api_web/api_material/categoryOption?csrf_protection=true`);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiDetailCategoryOptionCategory(id) {
        try {
            const response = await axiosCustom('GET', id ? `/api_web/api_material/categoryOption/${id}?csrf_protection=true` : "api_web/api_material/categoryOption?csrf_protection=true");
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiHandingCategory(data, id) {
        try {
            const response = await axiosCustom('POST', id ? `/api_web/api_material/category/${id}?csrf_protection=true` : "/api_web/api_material/category?csrf_protection=true", data);
            return response.data
        } catch (error) {
            throw error;
        }
    }

}

export default apiCategory