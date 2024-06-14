import { _ServerInstance as axiosCustom } from "@/services/axios";

const apiVariant = {
    async apiListVariant(param) {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_variation/variation?csrf_protection=true`, param);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiHandingVariant(id, data) {
        try {
            const response = await axiosCustom('POST', id ? `/api_web/Api_variation/variation/${id}?csrf_protection=true` : "/api_web/Api_variation/variation?csrf_protection=true", data);
            return response.data
        } catch (error) {
            throw error;
        }
    },

}
export default apiVariant