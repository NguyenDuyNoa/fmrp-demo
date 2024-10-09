import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiContact = {
    async apiListContact(params) {
        const response = await axiosCustom('GET', `/api_web/api_client/contact/?csrf_protection=true`, params);
        return response.data

    },

}
export default apiContact