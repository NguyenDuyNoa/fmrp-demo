import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiDashboard = {
    async apiLang(langDefault) {
        const response = await axiosCustom('GET', `/api_web/Api_Lang/language/${langDefault}`);
        return response.data
    },
    async apiSettings() {
        const response = await axiosCustom('GET', `/api_web/api_setting/getSettings?csrf_protection=true`);
        return response.data
    },
    async apiFeature() {
        const response = await axiosCustom('GET', `/api_web/api_setting/feature/?csrf_protection=true`);
        return response.data
    },
    async apiAuthentication() {
        const response = await axiosCustom('GET', `/api_web/Api_Authentication/authentication?csrf_protection=true`);
        return response.data
    },
    async apiLogOut() {
        const response = await axiosCustom('POST', `/api_web/Api_Login/logout?csrf_protection=true`);
        return response.data
    },

}
export default apiDashboard