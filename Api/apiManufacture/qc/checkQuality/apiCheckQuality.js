import { _ServerInstance as axiosCustom } from "@/services/axios";

const apiCheckQuality = {
    async apiGetListQc(params) {
        try {
            const response = await axiosCustom('POST', `/api_web/Api_Qc/index`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },
}
export default apiCheckQuality