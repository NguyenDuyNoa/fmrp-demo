import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiGroup = {
    async apiListGroup(params) {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_client/group?csrf_protection=true`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiHandingGroup(data, id) {
        try {
            const response = await axiosCustom('POST', id ? `/api_web/Api_client/group/${id}?csrf_protection=true` : "/api_web/Api_client/group?csrf_protection=true", data);
            return response.data
        } catch (error) {
            throw error;
        }
    },


}
export default apiGroup