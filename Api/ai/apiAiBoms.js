
import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiAiBoms = {
    async apiSendMessageBOMOpenAI(data) {
        const response = await axiosCustom('POST', `/api_web/Api_OpenAI/sendMessageOpenAI`, data);
        // const response = await axiosCustom('POST', `/api_web/Api_OpenAI/sendMessageBOMOpenAI`, data);
        return response.data
    },
    async apiGetTypeOpenAi() {
        const response = await axiosCustom('GET', `/api_web/Api_OpenAI/getTypeChat`);
        return response.data
    },

}
export default apiAiBoms