import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiContact = {
    async apiListContact(params) {
        const response = await axiosCustom('GET', `/api_web/api_supplier/contact/?csrf_protection=true`, params);
        return response.data
    },

}
export default apiContact