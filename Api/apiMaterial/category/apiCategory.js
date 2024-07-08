import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiCategory = {
    async apiListCategory(params) {
        const response = await axiosCustom('GET', `/api_web/api_material/category?csrf_protection=true`, params);
        return response.data
    },
    async apiCategoryOptionCategory(prams) {
        const response = await axiosCustom('GET', `/api_web/api_material/categoryOption?csrf_protection=true`, prams);
        return response.data
    },
    async apiDetailCategoryOptionCategory(id) {
        const response = await axiosCustom('GET', id ? `/api_web/api_material/categoryOption/${id}?csrf_protection=true` : "api_web/api_material/categoryOption?csrf_protection=true");
        return response.data
    },
    async apiHandingCategory(data, id) {
        const response = await axiosCustom('POST', id ? `/api_web/api_material/category/${id}?csrf_protection=true` : "/api_web/api_material/category?csrf_protection=true", data);
        return response.data
    }
}

export default apiCategory