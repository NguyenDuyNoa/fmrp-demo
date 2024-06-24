import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiContact = {

    async apiListContact(params) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_supplier/contact/?csrf_protection=true`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiListSupplierContact(params) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_supplier/supplier/?csrf_protection=true`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },

}
export default apiContact