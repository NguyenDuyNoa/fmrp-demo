import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiFinance = {
    async apiListFinance(url, param) {
        try {
            const response = await axiosCustom('GET', url, param);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiHandingFinance(url, data) {
        try {
            const response = await axiosCustom('POST', url, data);
            return response.data
        } catch (error) {
            throw error;
        }
    },

}
export default apiFinance