import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiGroups = {
    async apiListGroup(params) {
        const response = await axiosCustom('GET', `/api_web/api_supplier/group/?csrf_protection=true`, params);
        return response.data
    },
    async apiHandingGroup(data, id) {
        const response = await axiosCustom('POST', id ? `/api_web/api_supplier/group/${id}?csrf_protection=true` : "/api_web/api_supplier/group/?csrf_protection=true", data);
        return response.data
    }
}

export default apiGroups