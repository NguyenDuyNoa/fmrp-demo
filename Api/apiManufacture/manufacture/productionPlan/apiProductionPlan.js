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