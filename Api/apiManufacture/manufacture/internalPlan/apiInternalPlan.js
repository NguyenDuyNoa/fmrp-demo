import { _ServerInstance as axiosCustom } from "@/services/axios";

const apiInternalPlan = {
    async apiListInternalPlan(param) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_internal_plan/getInternalPlan?csrf_protection=true`, param);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiPostStatus(id, status) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_internal_plan/agree?id=${id}&status=${status}&csrf_protection=true`,);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiDetailInternalPlan(id) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_internal_plan/detailInternalPlan/${id}?csrf_protection=true`);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    // api luu
    async apiHandlingInternalPlan(url, data) {
        try {
            const response = await axiosCustom('POST', `${url}`, data);
            return response.data
        } catch (error) {
            throw error;
        }
    },
}
export default apiInternalPlan