import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiClient = {
    async apiListClient(params, url) {
        try {
            const response = await axiosCustom('GET', `${url}`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiListGroupClient(params) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_client/group_count/?csrf_protection=true`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiDetailClient(id) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_client/client/${id}?csrf_protection=true`,);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiCharClient(prams) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_staff/GetstaffInBrard?csrf_protection=true`, prams);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiGroupClient(prams) {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_client/group?csrf_protection=true`, prams);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiHandingClient(data, url) {
        try {
            const response = await axiosCustom('POST', `${url}`, data);
            return response.data
        } catch (error) {
            throw error;
        }
    },

}
export default apiClient