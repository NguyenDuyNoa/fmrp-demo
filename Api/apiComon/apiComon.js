import { _ServerInstance as axiosCustom } from "@/services/axios";

const apiComons = {

    async apiBranchCombobox() {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_Branch/branchCombobox/?csrf_protection=true`,);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiSearchProductsVariant(params) {
        try {
            const response = await axiosCustom('POST', `/api_web/api_internal_plan/searchProductsVariant?csrf_protection=true`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    // dnah sách mặt hàng
    async apiListItemsVariant(params) {
        try {
            const response = await axiosCustom('POST', `/api_web/api_product/searchProductsVariant`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    // thành phố
    async apiListProvince() {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_address/province?limit=0`,);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    // quận huyện
    async apiDistric(param) {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_address/district?limit=0`, param);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    // tinh thanh
    async apiWWard(prams) {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_address/ward?limit=0`, prams);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    // đơn vị tính
    async apiUnit(params) {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_unit/unit/?csrf_protection=true`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },
}
export default apiComons