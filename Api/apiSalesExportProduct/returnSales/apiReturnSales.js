import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiReturnSales = {
    async apiListReturnSales(params) {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_return_order/return_order/?csrf_protection=true`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiListFilterBar(params) {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_return_order/filterBar/?csrf_protection=true`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiHandingStatus(data) {
        try {
            const response = await axiosCustom('POST', `/api_web/Api_return_order/ConfirmWarehous?csrf_protection=true`, data);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiSearchReturnOrder(params) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_return_order/searchReturnOrder?csrf_protection=true`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiDetailReturnOrder(id) {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_return_order/return_order/${id}?csrf_protection=true`);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiSolution() {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_return_order/comboboxHandlingSolution/?csrf_protection=true`);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiPageDetail(id) {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_return_order/getDetail/${id}?csrf_protection=true`);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiDeliveriItems(data) {
        try {
            const response = await axiosCustom('POST', `/api_web/Api_return_order/getDeliveriItems?csrf_protection=true`, data);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiComboboxLocation(params) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_warehouse/Getcomboboxlocation/?csrf_protection=true`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiHandingReturnSales(id, data) {
        try {
            const response = await axiosCustom('GET', id ? `/api_web/Api_return_order/return_order/${id}?csrf_protection=true` : "/api_web/Api_return_order/return_order/?csrf_protection=true", data);
            return response.data
        } catch (error) {
            throw error;
        }
    },

}
export default apiReturnSales