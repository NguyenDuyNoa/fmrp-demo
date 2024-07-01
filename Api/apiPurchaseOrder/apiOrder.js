import { _ServerInstance as axiosCustom } from "@/services/axios";

const apiOrder = {
    async apiListOrder(param) {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_purchase_order/purchase_order/?csrf_protection=true`, param);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiListFilterBar(param) {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_purchase_order/filterBar/?csrf_protection=true`, param);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiPurchaseOrder() {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_purchase_order/purchase_order/?csrf_protection=true`);
            return response.data
        } catch (error) {
            throw error;
        }
    },

}
export default apiOrder