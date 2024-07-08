import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiGroup = {
    async apiListGroup(params) {
        const response = await axiosCustom('GET', `/api_web/Api_client/group?csrf_protection=true`, params);
        return response.data
    },
    async apiHandingGroup(data, id) {
        const response = await axiosCustom('POST', id ? `/api_web/Api_client/group/${id}?csrf_protection=true` : "/api_web/Api_client/group?csrf_protection=true", data);
        return response.data
    },


}
export default apiGroup