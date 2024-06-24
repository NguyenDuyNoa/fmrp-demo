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
    async apiListProvinceSuppliers() {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_address/province?limit=0`);
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
    async apiDistricSuppliers(param) {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_address/district?limit=0`, param);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiWardSuppliers(param) {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_address/ward?limit=0`, param);
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