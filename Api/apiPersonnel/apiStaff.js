import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiSatff = {
    async apiListStaff(params) {
        const response = await axiosCustom('GET', `/api_web/api_staff/staff/?csrf_protection=true`, params);
        return response.data
    },
    async apiListPositionOption(params) {
        const response = await axiosCustom('GET', `/api_web/api_staff/positionOption`, params);
        return response.data
    },
    async apiHandingStatus(data, id) {
        const response = await axiosCustom('POST', `/api_web/api_staff/change_status_staff/${id}?csrf_protection=true`, data);
        return response.data
    },
    async apiDetailStaff(id) {
        const response = await axiosCustom('GET', `/api_web/api_staff/staff/${id}?csrf_protection=true`,);
        return response.data
    },
    async apiPermissionsStaff(id, params) {
        const response = await axiosCustom('GET', id ? `/api_web/api_staff/getPermissionsStaff/${id}?csrf_protection=true` : `/api_web/api_staff/getPermissionsStaff?csrf_protection=true`, params ?? undefined);
        return response.data
    },
    async apiHandingStaff(id, data) {
        const response = await axiosCustom('POST', id ? `/api_web/api_staff/staff/${id}?csrf_protection=true` : `/api_web/api_staff/staff?csrf_protection=true`, data);
        return response.data
    },
    async apiManageStaff(id) {
        const response = await axiosCustom('GET', `/api_web/api_staff/staffManage/${id}?csrf_protection=true`);
        return response.data
    },
}
export default apiSatff