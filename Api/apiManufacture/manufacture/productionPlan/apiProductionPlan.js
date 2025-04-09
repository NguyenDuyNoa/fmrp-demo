import { _ServerInstance as axiosCustom } from "@/services/axios";

const apiProductionPlan = {
    async apiListOrderPlan(url, param) {
        const response = await axiosCustom('GET', `${url}`, param);
        return response.data
    },

    async apiHandlingManufacture(data) {
        const response = await axiosCustom('POST', `/api_web/api_manufactures/getDataHandlingManufacture?csrf_protection=true`, data);
        return response.data
    },
    async apiHandlingProductionPlans(data) {
        const response = await axiosCustom('POST', `/api_web/api_manufactures/handlingProductionPlans?csrf_protection=true`, data);
        return response.data
    },
     // plan bán thành phẩm 
     async apiListBom(id) {
        const response = await axiosCustom('GET', `/api_web/Api_Production_Plans/getListBom/${id}`);
        return response.data
    },

}

export default apiProductionPlan