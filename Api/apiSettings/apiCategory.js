import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiCategory = {
    async apiListCategory(url, param) {
        const response = await axiosCustom('GET', url, param);
        return response.data
    },
    async apiHandingCategory(url, data) {
        const response = await axiosCustom('POST', url, data);
        return response.data
    },
    async apiCostCombobox(id, data) {
        const response = await axiosCustom('GET', id ? `/api_web/Api_cost/costCombobox/${id}?csrf_protection=true` : "/api_web/Api_cost/costCombobox/?csrf_protection=true", data);
        return response.data
    },

}
export default apiCategory