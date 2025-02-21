import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiRecommendation = {
    // api 5 ô nhưng hiện tại chỉ có data 3 ô
    async apiPostRecommendation(data) {
        const response = await axiosCustom('POST', `/api_web/Api_Comments/handling`, data);
        return response.data
    },
}
export default apiRecommendation