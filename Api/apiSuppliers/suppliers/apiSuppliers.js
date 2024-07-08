import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiSuppliers = {
    async apiListSuppliers(params) {
        const response = await axiosCustom('GET', `/api_web/api_supplier/supplier/?csrf_protection=true`, params);
        return response.data
    },
    async apiListGroupSuppliers(params) {
        const response = await axiosCustom('GET', `/api_web/api_supplier/group_count/?csrf_protection=true`, params);
        return response.data
    },

    async apiDetailSuppliers(id) {
        const response = await axiosCustom('GET', `/api_web/api_supplier/supplier/${id}?csrf_protection=true`);
        return response.data
    },
    async apiGroupSuppliers(param) {
        const response = await axiosCustom('GET', `/api_web/api_supplier/group/?csrf_protection=true`, param);
        return response.data
    },

    async apiHandingSuppliers(data, id) {
        const response = await axiosCustom('POST', id ? `/api_web/api_supplier/supplier/${id}?csrf_protection=true` : "/api_web/api_supplier/supplier/?csrf_protection=true", data);
        return response.data
    },


}
export default apiSuppliers