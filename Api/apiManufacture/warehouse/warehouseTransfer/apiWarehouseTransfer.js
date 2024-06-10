import { _ServerInstance as axiosCustom } from "@/services/axios";

const apiWarehouseTransfer = {

    async apiListTransfer(param) {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_transfer/transfer/?csrf_protection=true`, param);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiTransferFilterBar(param) {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_transfer/TransferFilterBar/?csrf_protection=true`, param);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiTransferCombobox(method, data) {
        try {
            const response = await axiosCustom(`${method}`, `/api_web/Api_transfer/TransferCombobox/?csrf_protection=true`, data);
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
    async apiDetailTransfer(id) {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_transfer/transfer/${id}?csrf_protection=true`);
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
    async apiGetTransferDetail(id) {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_transfer/getTransferDetail/${id}?csrf_protection=true`);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiGetSemiItems(method, params) {
        try {
            const response = await axiosCustom(`${method}`, `/api_web/Api_stock/getSemiItems/?csrf_protection=true`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },

    async apiWarehouseCombobox(params) {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_warehouse/warehouseCombobox/?csrf_protection=true`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiwarehouseLocationCombobox(params) {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_warehouse/warehouseLocationCombobox/?csrf_protection=true`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiHandingTransfer(url, data) {
        try {
            const response = await axiosCustom('POST', `${url}`, data);
            return response.data
        } catch (error) {
            throw error;
        }
    },


}
export default apiWarehouseTransfer