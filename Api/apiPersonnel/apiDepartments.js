import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiDepartments = {
    async apiListDepartment(params) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_staff/department/?csrf_protection=true`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiHandingDepartment(data, id) {
        try {
            const response = await axiosCustom('POST', id ? `/api_web/api_staff/department/${id}?csrf_protection=true` : "/api_web/api_staff/department/?csrf_protection=true", data);
            return response.data
        } catch (error) {
            throw error;
        }
    },
}
export default apiDepartments