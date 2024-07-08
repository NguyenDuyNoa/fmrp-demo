import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiDeliveryReceipt = {
    async apiListDeliveryReceipt(params) {
        const response = await axiosCustom('GET', `/api_web/api_delivery/getDeliveries?csrf_protection=true`, params);
        return response.data
    },
    async apiListFilterBar(params) {
        const response = await axiosCustom('GET', `/api_web/api_delivery/statusDelivery?csrf_protection=true`, params);
        return response.data
    },
    async apiSearchDeliveries(params) {
        const response = await axiosCustom('GET', `api_web/api_delivery/searchDeliveries?csrf_protection=true`, params);
        return response.data
    },
    async apiHandingWarehouse(data) {
        const response = await axiosCustom('POST', `/api_web/Api_delivery/confirmWarehouse?csrf_protection=true`, data);
        return response.data
    },
    async apiDetail(id) {
        const response = await axiosCustom('GET', `/api_web/Api_delivery/get/${id}?csrf_protection=true`);
        return response.data
    },
    async apiAddShippingClient(data) {
        const response = await axiosCustom('GET', `/api_web/api_delivery/AddShippingClient?csrf_protection=true`, data);
        return response.data
    },
    async apiDetailPage(id) {
        const response = await axiosCustom('GET', `/api_web/Api_delivery/getDeliveryDetail/${id}?csrf_protection=true`,);
        return response.data
    },
    async apiPageItems(params) {
        const response = await axiosCustom('POST', `/api_web/api_delivery/searchItemsVariant/?csrf_protection=true`, params);
        return response.data
    },
    async apiContactCombobox(params) {
        const response = await axiosCustom('GET', `/api_web/api_client/contactCombobox/?csrf_protection=true`, params);
        return response.data
    },
    async apiSearchOrdersToCustomer(data) {
        const response = await axiosCustom('POST', `/api_web/api_delivery/searchOrdersToCustomer?csrf_protection=true`, data);
        return response.data
    },
    async apiGetShippingClient(data) {
        const response = await axiosCustom('POST', `/api_web/api_delivery/GetShippingClient?csrf_protection=true`, data);
        return response.data
    },
    async apiHangdingDeliveryReceipt(id, data) {
        const response = await axiosCustom('POST', id ? `/api_web/Api_delivery/updateDelivery/${id}?csrf_protection=true` : "/api_web/Api_delivery/AddDelivery/?csrf_protection=true", data);
        return response.data
    },
}
export default apiDeliveryReceipt