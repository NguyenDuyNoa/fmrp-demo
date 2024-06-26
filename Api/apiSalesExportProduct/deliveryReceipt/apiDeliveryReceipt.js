import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiDeliveryReceipt = {
    async apiListDeliveryReceipt(params) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_delivery/getDeliveries?csrf_protection=true`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiListFilterBar(params) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_delivery/statusDelivery?csrf_protection=true`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiSearchDeliveries(params) {
        try {
            const response = await axiosCustom('GET', `api_web/api_delivery/searchDeliveries?csrf_protection=true`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiHandingWarehouse(data) {
        try {
            const response = await axiosCustom('POST', `/api_web/Api_delivery/confirmWarehouse?csrf_protection=true`, data);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiDetail(id) {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_delivery/get/${id}?csrf_protection=true`);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiAddShippingClient(data) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_delivery/AddShippingClient?csrf_protection=true`, data);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiDetailPage(id) {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_delivery/getDeliveryDetail/${id}?csrf_protection=true`,);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiPageItems(params) {
        try {
            const response = await axiosCustom('POST', `/api_web/api_delivery/searchItemsVariant/?csrf_protection=true`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiContactCombobox(params) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_client/contactCombobox/?csrf_protection=true`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiSearchOrdersToCustomer(data) {
        try {
            const response = await axiosCustom('POST', `/api_web/api_delivery/searchOrdersToCustomer?csrf_protection=true`, data);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiGetShippingClient(data) {
        try {
            const response = await axiosCustom('POST', `/api_web/api_delivery/GetShippingClient?csrf_protection=true`, data);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiHangdingDeliveryReceipt(id, data) {
        try {
            const response = await axiosCustom('POST', id ? `/api_web/Api_delivery/updateDelivery/${id}?csrf_protection=true` : "/api_web/Api_delivery/AddDelivery/?csrf_protection=true", data);
            return response.data
        } catch (error) {
            throw error;
        }
    },
}
export default apiDeliveryReceipt