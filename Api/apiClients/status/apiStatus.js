import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiStatus = {
    async apiListStatus(params) {
        const response = await axiosCustom('GET', `/api_web/api_client/status?csrf_protection=true`, params);
        return response.data

    },
    async apiHandingStatus(data, id) {
        const response = await axiosCustom('POST', id ? `/api_web/api_client/status/${id}?csrf_protection=true` : "/api_web/api_client/status?csrf_protection=true", data);
        return response.data
    },
}
export default apiStatus