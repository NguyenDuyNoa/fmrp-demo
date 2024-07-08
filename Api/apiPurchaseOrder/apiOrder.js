import { _ServerInstance as axiosCustom } from "@/services/axios";

const apiOrder = {
    async apiListOrder(param) {
        const response = await axiosCustom('GET', `/api_web/Api_purchase_order/purchase_order/?csrf_protection=true`, param);
        return response.data
    },
    async apiListFilterBar(param) {
        const response = await axiosCustom('GET', `/api_web/Api_purchase_order/filterBar/?csrf_protection=true`, param);
        return response.data
    },
    async apiPurchaseOrder() {
        const response = await axiosCustom('GET', `/api_web/Api_purchase_order/purchase_order/?csrf_protection=true`);
        return response.data
    },

}
export default apiOrder