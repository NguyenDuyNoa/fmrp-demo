import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiSatff = {

    async apiListStaff(params) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_staff/staff/?csrf_protection=true`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiListPositionOption(params) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_staff/positionOption`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiHandingStatus(data, id) {
        try {
            const response = await axiosCustom('POST', `/api_web/api_staff/change_status_staff/${id}?csrf_protection=true`, data);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiDetailStaff(id) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_staff/staff/${id}?csrf_protection=true`,);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiPermissionsStaff(id, params) {
        try {
            const response = await axiosCustom('GET', id ? `/api_web/api_staff/getPermissionsStaff/${id}?csrf_protection=true` : `/api_web/api_staff/getPermissionsStaff?csrf_protection=true`, params ?? undefined);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiHandingStaff(id, data) {
        try {
            const response = await axiosCustom('POST', id ? `/api_web/api_staff/getPermissionsStaff/${id}?csrf_protection=true` : `/api_web/api_staff/getPermissionsStaff?csrf_protection=true`, data);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiManageStaff(id) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_staff/staffManage/${id}?csrf_protection=true`);
            return response.data
        } catch (error) {
            throw error;
        }
    },
}
export default apiSatff