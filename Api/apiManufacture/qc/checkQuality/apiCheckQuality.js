import { _ServerInstance as axiosCustom } from "@/services/axios";

const apiCheckQuality = {
    // danh sách
    async apiGetListQc(params) {
        try {
            const response = await axiosCustom('POST', `/api_web/Api_Qc/index`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    // chi tiết
    async apiDetailQc(id) {
        const response = await axiosCustom('GET', `/api_web/Api_Qc/show/${id}`);
        return response.data
    },
}
export default apiCheckQuality