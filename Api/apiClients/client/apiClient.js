import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiClient = {
    async apiListClient(params, url) {
        const response = await axiosCustom('GET', `${url}`, params);
        return response.data
    },
    async apiListGroupClient(params) {
        const response = await axiosCustom('GET', `/api_web/api_client/group_count/?csrf_protection=true`, params);
        return response.data
    },
    async apiDetailClient(id) {
        const response = await axiosCustom('GET', `/api_web/api_client/client/${id}?csrf_protection=true`,);
        return response.data
    },
    async apiCharClient(prams) {
        const response = await axiosCustom('GET', `/api_web/api_staff/GetstaffInBrard?csrf_protection=true`, prams);
        return response.data

    },
    async apiGroupClient(prams) {
        const response = await axiosCustom('GET', `/api_web/Api_client/group?csrf_protection=true`, prams);
        return response.data
    },
    async apiHandingClient(data, url) {
        const response = await axiosCustom('POST', `${url}`, data);
        return response.data
    },

}
export default apiClient