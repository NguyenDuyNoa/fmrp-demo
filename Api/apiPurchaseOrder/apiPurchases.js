import { _ServerInstance as axiosCustom } from "@/services/axios";

const apiPurchases = {
    async apiListPurchases(param) {
        const response = await axiosCustom('GET', `/api_web/Api_purchases/purchases/?csrf_protection=true`, param);
        return response.data
    },
    async apiComboboxPurchases() {
        const response = await axiosCustom('GET', `/api_web/Api_purchases/purchases/?csrf_protection=true`);
        return response.data
    },

    async apiGroupPurchases(param) {
        const response = await axiosCustom('GET', `/api_web/Api_purchases/purchasesFilterBar/?csrf_protection=true`, param);
        return response.data
    },
    async apiHandingStatusPurchases(id, newStatus) {
        const response = await axiosCustom('POST', `/api_web/Api_purchases/updateStatus/${id}/${newStatus}?csrf_protection=true`,);
        return response.data
    },
    async apiDetailPurchases(id) {
        const response = await axiosCustom('GET', `/api_web/Api_purchases/purchases/${id}?csrf_protection=true`,);
        return response.data
    },
    // form
    async apiItemsVariantPurchases(prams) {
        const response = await axiosCustom('POST', `/api_web/api_product/searchItemsVariant?csrf_protection=true`, prams);
        return response.data
    },
    async apiDetailPagePurchases(id) {
        const response = await axiosCustom('GET', `/api_web/Api_purchases/purchases/${id}?csrf_protection=true`);
        return response.data
    },
    async apiHandingPurchases(id, data) {
        const response = await axiosCustom('POST', id ? `/api_web/Api_purchases/purchases/${id}?csrf_protection=true` : `/api_web/Api_purchases/purchases/?csrf_protection=true`, data);
        return response.data
    },
}
export default apiPurchases