import { _ServerInstance as axiosCustom } from "@/services/axios";

const apiInformation = {
    async apiInfo() {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_setting/companyInfo?csrf_protection=true`);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiHandingInfo(data) {
        try {
            const response = await axiosCustom('POST', `/api_web/Api_setting/companyInfo?csrf_protection=true`, data);
            return response.data
        } catch (error) {
            throw error;
        }
    },
}
export default apiInformation