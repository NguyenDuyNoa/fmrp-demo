import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiDashboard = {
    async apiLang(langDefault) {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_Lang/language/${langDefault}`);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiSettings() {
        try {
            const response = await axiosCustom('GET', `/api_web/api_setting/getSettings?csrf_protection=true`);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiFeature() {
        try {
            const response = await axiosCustom('GET', `/api_web/api_setting/feature/?csrf_protection=true`);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiAuthentication() {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_Authentication/authentication?csrf_protection=true`);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiLogOut() {
        try {
            const response = await axiosCustom('POST', `/api_web/Api_Login/logout?csrf_protection=true`);
            return response.data
        } catch (error) {
            throw error;
        }
    },

}
export default apiDashboard