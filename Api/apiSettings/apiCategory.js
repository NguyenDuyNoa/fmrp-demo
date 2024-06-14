import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiCategory = {
    async apiListCategory(url, param) {
        try {
            const response = await axiosCustom('GET', url, param);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiHandingCategory(url, data) {
        try {
            const response = await axiosCustom('POST', url, data);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiCostCombobox(id, data) {
        try {
            const response = await axiosCustom('GET', id ? `/api_web/Api_cost/costCombobox/${id}?csrf_protection=true` : "/api_web/Api_cost/costCombobox/?csrf_protection=true", data);
            return response.data
        } catch (error) {
            throw error;
        }
    },

}
export default apiCategory