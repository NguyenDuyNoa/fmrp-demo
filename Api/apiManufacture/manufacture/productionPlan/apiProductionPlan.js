import { _ServerInstance as axiosCustom } from "@/services/axios";

const apiProductionPlan = {
    async apiListOrderPlan(url, param) {
        try {
            const response = await axiosCustom('GET', `${url}`, param);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiClientOption() {
        try {
            const response = await axiosCustom('GET', `/api_web/api_client/client_option/?csrf_protection=true`,);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiCategoryOption() {
        try {
            const response = await axiosCustom('GET', `api_web/api_product/categoryOption/?csrf_protection=true`,);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiSearchProductsVariant(param) {
        try {
            const response = await axiosCustom('POST', `/api_web/api_internal_plan/searchProductsVariant?csrf_protection=true`, param);
            return response.data
        } catch (error) {
            throw error;
        }
    },

    async apiHandlingManufacture(data) {
        try {
            const response = await axiosCustom('POST', `/api_web/api_manufactures/getDataHandlingManufacture?csrf_protection=true`, data);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiHandlingProductionPlans(data) {
        try {
            const response = await axiosCustom('POST', `/api_web/api_manufactures/handlingProductionPlans?csrf_protection=true`, data);
            return response.data
        } catch (error) {
            throw error;
        }
    }

}

export default apiProductionPlan