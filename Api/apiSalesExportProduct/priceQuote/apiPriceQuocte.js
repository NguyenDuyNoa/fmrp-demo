import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiPriceQuocte = {
    async apiListPriceQuocte(params) {
        const response = await axiosCustom('GET', `/api_web/Api_quotation/quotation/?csrf_protection=true`, params);
        return response.data
    },
    async apiListFilterBar(params) {
        const response = await axiosCustom('GET', `/api_web/Api_quotation/filterBar?csrf_protection=true`, params);
        return response.data
    },
    async apiSearchQuocte(params) {
        const response = await axiosCustom('GET', `/api_web/api_quotation/searchQuotes?csrf_protection=true`, params);
        return response.data
    },

    async apiHandingStatus(id, stt, data) {
        const response = await axiosCustom('POST', `/api_web/Api_quotation/changeStatus/${id}/${stt}?csrf_protection=true`, data);
        return response.data
    },
    async apiDetailQuote(id) {
        const response = await axiosCustom('GET', `/api_web/Api_quotation/quotation/${id}?csrf_protection=true`);
        return response.data
    },

    async apiContact(params) {
        const response = await axiosCustom('GET', `/api_web/api_client/contactCombobox/?csrf_protection=true`, params);
        return response.data
    },
    async apiItems(data) {
        const response = await axiosCustom('POST', `/api_web/Api_product/searchItemsVariant/?csrf_protection=true`, data);
        return response.data
    },
    async apiHandingPriceQuote(id, data) {
        const response = await axiosCustom('POST', id ? `/api_web/Api_quotation/quotation/${id}?csrf_protection=true` : "/api_web/Api_quotation/quotation/?csrf_protection=true", data);
        return response.data
    },
}
export default apiPriceQuocte