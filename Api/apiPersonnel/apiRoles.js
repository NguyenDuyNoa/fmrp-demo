import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiRoles = {
    async apiListRoles(params) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_staff/department/?csrf_protection=true`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiPositionOption() {
        try {
            const response = await axiosCustom('GET', `/api_web/api_staff/positionOption?csrf_protection=true`);
            return response.data
        } catch (error) {
            throw error;
        }
    },

    async apiPermissions(id) {
        try {
            const response = await axiosCustom('GET', id ? `/api_web/api_staff/getPermissions/${id}?csrf_protection=true` : `/api_web/api_staff/getPermissions?csrf_protection=true`);
            return response.data
        } catch (error) {
            throw error;
        }
    },

    async apiHandingRoles(data, id) {
        try {
            const response = await axiosCustom('POST', id ? `/api_web/api_staff/position/${id}?csrf_protection=true` : "/api_web/api_staff/position?csrf_protection=true", data);
            return response.data
        } catch (error) {
            throw error;
        }
    },

    async apiPosition(id) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_staff/position/${id}?csrf_protection=true`);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiDetailPositionOption(id) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_staff/positionOption/${id}?csrf_protection=true`);
            return response.data
        } catch (error) {
            throw error;
        }
    },

}
export default apiRoles