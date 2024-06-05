import { _ServerInstance as axiosCustom } from "@/services/axios";

const apiMaterialsPlanning = {
    async apiProductionPlans(page, limit, param) {
        try {
            const response = await axiosCustom('POST', `/api_web/api_manufactures/getProductionPlans?csrf_protection=true&page=${page}&limit=${limit}`, param);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiDetailProductionPlans(id) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_manufactures/getDetailProductionPlans/${id}?csrf_protection`,);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiSearchOrders(param) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_internal_plan/searchOrders?csrf_protection=true`, param);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiSearchInternalPlans(param) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_internal_plan/searchInternalPlans?csrf_protection=true`, param);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiDeleteProductionPlans(id) {
        try {
            const response = await axiosCustom('DELETE', `/api_web/api_manufactures/deleteProductionPlans/${id}?csrf_protection=true`, param);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiDeletePurchasesTransfer(url) {
        try {
            const response = await axiosCustom('DELETE', `${url}`);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    //them giu kho
    async apiHandlingKeepProductionsPlan(data) {
        try {
            const response = await axiosCustom('POST', `/api_web/api_manufactures/handlingKeepProductionsPlan`, data);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    // danh sach kho,
    async apiKeepItemsWarehouses(data) {
        try {
            const response = await axiosCustom('POST', `/api_web/api_manufactures/keepItemsWarehouses`, data);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    // vi tri kho
    async apiLocationItemsWarehouse(data) {
        try {
            const response = await axiosCustom('POST', `/api_web/api_manufactures/getLocationItemsWarehouse`, data);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    // them ycmh
    async apiHandlingPurchaseProductionPlan(data) {
        try {
            const response = await axiosCustom('POST', `/api_web/api_manufactures/handlingPurchaseProductionPlan`, data);
            return response.data
        } catch (error) {
            throw error;
        }
    },

}
export default apiMaterialsPlanning