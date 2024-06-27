import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiSalesOrder = {
    async apiListSalesOrder(params) {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_sale_order/saleOrder/?csrf_protection=true`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiListFilterbar(params) {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_sale_order/filterBar?csrf_protection=true`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiSearchOrder(params) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_sale_order/searchOrders?csrf_protection=true`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiHandingStatus(id, stt, data) {
        try {
            const response = await axiosCustom('POST', `/api_web/Api_sale_order/confirm/${id}/${stt}?csrf_protection=true`, data);
            return response.data
        } catch (error) {
            throw error;
        }
    },

    async apiDetail(id) {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_sale_order/saleOrder/${id}?csrf_protection=true`);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiListKeepOrder(id, params) {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_sale_order/GetListKeepOrder/${id}/?csrf_protection=true`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiListTransferCombobox() {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_transfer/TransferCombobox/?csrf_protection=true`);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiWarehouseComboboxFindBranch() {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_warehouse/warehouseComboboxFindBranch/?csrf_protection=true`);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiHandingTransferCombobox(data) {
        try {
            const response = await axiosCustom('POST', `/api_web/Api_sale_order/EditKeepStockOrder?csrf_protection=true`, data);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiDeleteTransferKeep(id) {
        try {
            const response = await axiosCustom('DELETE', `/api_web/Api_transfer/deletetransferKeep/${id}?csrf_protection=true`);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiDetailKeepStockOrder(id, params) {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_sale_order/KeepStockOrder/${id}`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiWarehouseComboboxNotSystem() {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_warehouse/warehouseCombobox_not_system/?csrf_protection=true`);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiHanDingKeepStook(data) {
        try {
            const response = await axiosCustom('POST', `/api_web/Api_sale_order/AddKeepStockOrder?csrf_protection=true`, data);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiSearchContact(params) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_client/searchContact?csrf_protection=true`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiStaffBranch(params) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_client/getStaffBranch?csrf_protection=true`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiQuotationNotOrdered(params) {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_quotation/quotationNotOrderedCombobox/?csrf_protection=true`, params);
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
    async apiQuotaItems(prams) {
        try {
            const response = await axiosCustom('POST', `/api_web/Api_quotation/searchItemsVariant/?csrf_protection=true`, prams);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiHandingSalesOrder(id, data) {
        try {
            const response = await axiosCustom('POST', IDBObjectStore ? `/api_web/Api_sale_order/saleOrder/${id}?csrf_protection=true` : "/api_web/Api_sale_order/saleOrder/?csrf_protection=true", data);
            return response.data
        } catch (error) {
            throw error;
        }
    },

}
export default apiSalesOrder