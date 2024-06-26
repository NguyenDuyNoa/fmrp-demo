import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiPriceQuocte = {
    async apiListPriceQuocte(params) {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_quotation/quotation/?csrf_protection=true`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiListFilterBar(params) {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_quotation/filterBar?csrf_protection=true`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiSearchQuocte(params) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_quotation/searchQuotes?csrf_protection=true`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiSearchClients(params) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_client/searchClients?csrf_protection=true`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiHandingStatus(id, stt, data) {
        try {
            const response = await axiosCustom('POST', `/api_web/Api_quotation/changeStatus/${id}/${stt}?csrf_protection=true`, data);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiDetailQuote(id) {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_quotation/quotation/${id}?csrf_protection=true`);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiListTax() {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_tax/tax?csrf_protection=true`);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiClientOption(params) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_client/client_option/?csrf_protection=true`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiContact(params) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_client/contactCombobox/?csrf_protection=true`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiItems(data) {
        try {
            const response = await axiosCustom('POST', `/api_web/Api_product/searchItemsVariant/?csrf_protection=true`, data);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiHandingPriceQuote(id, data) {
        try {
            const response = await axiosCustom('POST', id ? `/api_web/Api_quotation/quotation/${id}?csrf_protection=true` : "/api_web/Api_quotation/quotation/?csrf_protection=true", data);
            return response.data
        } catch (error) {
            throw error;
        }
    },
}
export default apiPriceQuocte