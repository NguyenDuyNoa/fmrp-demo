import { _ServerInstance as axiosCustom } from "@/services/axios";

const apiInformation = {
    async apiInfo() {
        const response = await axiosCustom('GET', `/api_web/Api_setting/companyInfo?csrf_protection=true`);
        return response.data
    },
    async apiHandingInfo(data) {
        const response = await axiosCustom('POST', `/api_web/Api_setting/companyInfo?csrf_protection=true`, data);
        return response.data
    },
}
export default apiInformation