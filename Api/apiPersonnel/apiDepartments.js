import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiDepartments = {
    async apiListDepartment(params) {
        const response = await axiosCustom('GET', `/api_web/api_staff/department/?csrf_protection=true`, params);
        return response.data
    },
    async apiHandingDepartment(data, id) {
        const response = await axiosCustom('POST', id ? `/api_web/api_staff/department/${id}?csrf_protection=true` : "/api_web/api_staff/department/?csrf_protection=true", data);
        return response.data
    },
}
export default apiDepartments