import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiFinance = {
    async apiListFinance(url, param) {
        const response = await axiosCustom('GET', url, param);
        return response.data
    },
    async apiHandingFinance(url, data) {
        const response = await axiosCustom('POST', url, data);
        return response.data
    },

}
export default apiFinance