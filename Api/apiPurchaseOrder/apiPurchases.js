import { _ServerInstance as axiosCustom } from "@/services/axios";

const apiPurchases = {
    async apiListPurchases(param) {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_purchases/purchases/?csrf_protection=true`, param);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiComboboxPurchases() {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_purchases/purchases/?csrf_protection=true`);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiStaffOptionPurchases() {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_staff/staffOption?csrf_protection=true`);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiGroupPurchases(param) {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_purchases/purchasesFilterBar/?csrf_protection=true`, param);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiHandingStatusPurchases(id, newStatus) {
        try {
            const response = await axiosCustom('POST', `/api_web/Api_purchases/updateStatus/${id}/${newStatus}?csrf_protection=true`,);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiDetailPurchases(id) {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_purchases/purchases/${id}?csrf_protection=true`,);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    // form
    async apiItemsVariantPurchases(prams) {
        try {
            const response = await axiosCustom('POST', `/api_web/api_product/searchItemsVariant?csrf_protection=true`, prams);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiDetailPagePurchases(id) {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_purchases/purchases/${id}?csrf_protection=true`);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiHandingPurchases(id, data) {
        try {
            const response = await axiosCustom('POST', id ? `/api_web/Api_purchases/purchases/${id}?csrf_protection=true` : `/api_web/Api_purchases/purchases/?csrf_protection=true`, data);
            return response.data
        } catch (error) {
            throw error;
        }
    },
}
export default apiPurchases