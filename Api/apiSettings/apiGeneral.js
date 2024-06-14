import { _ServerInstance as axiosCustom } from "@/services/axios";

const apiGeneral = {
    async apiHanding(data) {
        try {
            const response = await axiosCustom('POST', `/api_web/api_setting/feature/?csrf_protection=true`, data);
            return response.data
        } catch (error) {
            throw error;
        }
    },
}
export default apiGeneral