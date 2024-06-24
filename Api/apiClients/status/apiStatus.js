import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiStatus = {
    async apiListStatus(params) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_client/status?csrf_protection=true`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiHandingStatus(data, id) {
        try {
            const response = await axiosCustom('POST', id ? `/api_web/api_client/status/${id}?csrf_protection=true` : "/api_web/api_client/status?csrf_protection=true", data);
            return response.data
        } catch (error) {
            throw error;
        }
    },
}
export default apiStatus