import { _ServerInstance as axiosCustom } from "@/services/axios";

const apiMaterialsPlanning = {
    async apiProductionPlans(page, limit, param) {
        const response = await axiosCustom('POST', `/api_web/api_manufactures/getProductionPlans?csrf_protection=true&page=${page}&limit=${limit}`, param);
        return response.data
    },
    async apiDetailProductionPlans(id) {
        const response = await axiosCustom('GET', `/api_web/api_manufactures/getDetailProductionPlans/${id}?csrf_protection`,);
        return response.data
    },
    async apiSearchOrders(param) {
        const response = await axiosCustom('GET', `/api_web/api_internal_plan/searchOrders?csrf_protection=true`, param);
        return response.data
    },
    async apiSearchInternalPlans(param) {
        const response = await axiosCustom('GET', `/api_web/api_internal_plan/searchInternalPlans?csrf_protection=true`, param);
        return response.data
    },
    async apiDeleteProductionPlans(id) {
        const response = await axiosCustom('DELETE', `/api_web/api_manufactures/deleteProductionPlans/${id}?csrf_protection=true`);
        return response.data

    },
    async apiDeletePurchasesTransfer(url) {
        const response = await axiosCustom('DELETE', `${url}`);
        return response.data
    },
    //them giu kho
    async apiHandlingKeepProductionsPlan(data) {
        const response = await axiosCustom('POST', `/api_web/api_manufactures/handlingKeepProductionsPlan`, data);
        return response.data
    },
    // danh sach kho,
    async apiKeepItemsWarehouses(data) {
        const response = await axiosCustom('POST', `/api_web/api_manufactures/keepItemsWarehouses`, data);
        return response.data
    },
    // vi tri kho
    async apiLocationItemsWarehouse(data) {
        const response = await axiosCustom('POST', `/api_web/api_manufactures/getLocationItemsWarehouse`, data);
        return response.data
    },
    // them ycmh
    async apiHandlingPurchaseProductionPlan(data) {
        const response = await axiosCustom('POST', `/api_web/api_manufactures/handlingPurchaseProductionPlan`, data);
        return response.data
    },

}
export default apiMaterialsPlanning