import { _ServerInstance as axiosCustom } from "@/services/axios";

const apiComons = {
    async apiBranchCombobox() {
        const response = await axiosCustom('GET', `/api_web/Api_Branch/branchCombobox/?csrf_protection=true`,);
        return response.data
    },
    async apiSearchProductsVariant(params) {
        const response = await axiosCustom('POST', `/api_web/api_internal_plan/searchProductsVariant?csrf_protection=true`, params);
        return response.data

    },
    // dnah sách mặt hàng
    async apiListItemsVariant(params) {
        const response = await axiosCustom('POST', `/api_web/api_product/searchProductsVariant`, params);
        return response.data

    },
    // thành phố
    async apiListProvince() {
        const response = await axiosCustom('GET', `/api_web/Api_address/province?limit=0`,);
        return response.data
    },
    // quận huyện
    async apiDistric(param) {
        const response = await axiosCustom('GET', `/api_web/Api_address/district?limit=0`, param);
        return response.data
    },
    // tinh thanh
    async apiWWard(prams) {
        const response = await axiosCustom('GET', `/api_web/Api_address/ward?limit=0`, prams);
        return response.data
    },
    // đơn vị tính
    async apiUnit(params) {
        const response = await axiosCustom('GET', `/api_web/Api_unit/unit/?csrf_protection=true`, params);
        return response.data
    },
    async apiSearchClient(params) {
        const response = await axiosCustom('GET', `/api_web/api_client/searchClients?csrf_protection=true`, params);
        return response.data
    },

    async apiListTax(params) {
        const response = await axiosCustom('GET', `/api_web/Api_tax/tax?csrf_protection=true`, params);
        return response.data

    },
}
export default apiComons