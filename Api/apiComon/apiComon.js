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


}
export default apiComons