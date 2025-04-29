import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiRecommendation = {
    // api 5 ô nhưng hiện tại chỉ có data 3 ô
    async apiPostRecommendation(data) {
        const response = await axiosCustom('POST', `/api_web/Api_Comments/handling_v2`, data);
        // const response = await axiosCustom('POST', `/api_web/Api_Comments/handling`, data);
        return response.data
    },
    async apiGetEmojiAndImprove(data) {
        const response = await axiosCustom('GET', `/api_web/Api_Comments/getDataComment`, data);
        return response.data
    },
    // async apiPostRecommendation(data) {
    //     const response = await axiosCustom('POST', `/api_web/Api_Comments/handling`, data);
    //     return response.data
    // },
}
export default apiRecommendation