import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiRoles = {
    async apiListRoles(params) {
        const response = await axiosCustom('GET', `/api_web/api_staff/position/?csrf_protection=true`, params);
        return response.data
    },
    async apiPositionOption() {
        const response = await axiosCustom('GET', `/api_web/api_staff/positionOption?csrf_protection=true`);
        return response.data
    },

    async apiPermissions(id) {
        const response = await axiosCustom('GET', id ? `/api_web/api_staff/getPermissions/${id}?csrf_protection=true` : `/api_web/api_staff/getPermissions?csrf_protection=true`);
        return response.data
    },

    async apiHandingRoles(data, id) {
        const response = await axiosCustom('POST', id ? `/api_web/api_staff/position/${id}?csrf_protection=true` : "/api_web/api_staff/position?csrf_protection=true", data);
        return response.data
    },

    async apiPosition(id) {
        const response = await axiosCustom('GET', `/api_web/api_staff/position/${id}?csrf_protection=true`);
        return response.data
    },
    async apiDetailPositionOption(id) {
        const response = await axiosCustom('GET', `/api_web/api_staff/positionOption/${id}?csrf_protection=true`);
        return response.data
    },

}
export default apiRoles