import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiLogin = {
    async apiMajior() {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_Login/get_list_data?csrf_protection=true`);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiLoginMain(data) {
        try {
            const response = await axiosCustom('POST', `/api_web/Api_Login/loginMain?csrf_protection=true`, data);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiRegister(data) {
        try {
            const response = await axiosCustom('POST', `/api_web/Api_Login/SignUpMain?csrf_protection=true`, data);
            return response.data
        } catch (error) {
            throw error;
        }
    }
}
export default apiLogin