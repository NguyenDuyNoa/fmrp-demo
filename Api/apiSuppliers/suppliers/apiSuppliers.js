import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiSuppliers = {
    async apiListSuppliers(params) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_supplier/supplier/?csrf_protection=true`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiListGroupSuppliers(params) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_supplier/group_count/?csrf_protection=true`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },

    async apiDetailSuppliers(id) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_supplier/supplier/${id}?csrf_protection=true`);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiGroupSuppliers(param) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_supplier/group/?csrf_protection=true`, param);
            return response.data
        } catch (error) {
            throw error;
        }
    },

    async apiHandingSuppliers(data, id) {
        try {
            const response = await axiosCustom('POST', id ? `/api_web/api_supplier/supplier/${id}?csrf_protection=true` : "/api_web/api_supplier/supplier/?csrf_protection=true", data);
            return response.data
        } catch (error) {
            throw error;
        }
    },


}
export default apiSuppliers