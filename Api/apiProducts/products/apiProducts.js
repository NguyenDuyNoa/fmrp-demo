import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiProducts = {
    async apiListProducts(params) {
        const response = await axiosCustom('GET', `/api_web/api_product/product/?csrf_protection=true`, params);
        return response.data
    },
    async apiProductTypeProducts() {
        const response = await axiosCustom('GET', `/api_web/api_product/productType/?csrf_protection=true`);
        return response.data
    },

    async apiStageProducts() {
        const response = await axiosCustom('GET', `/api_web/api_product/stage/?csrf_protection=true`);
        return response.data
    },
    async apiDetailProducts(id) {
        const response = await axiosCustom('GET', `/api_web/api_product/product/${id}?csrf_protection=true`);
        return response.data
    },
    async apiDetailStageProducts(id) {
        const response = await axiosCustom('GET', `/api_web/api_product/getDesignStages/${id}?csrf_protection=true`);
        return response.data
    },
    async apiDetailBomProducts(params) {
        const response = await axiosCustom('GET', `/api_web/Api_product/getDesignBOM?csrf_protection=true`, params);
        return response.data
    },
    async apiHandingProducts(id, data) {
        const response = await axiosCustom('POST', id ? `/api_web/api_product/product/${id}?csrf_protection=true` : "/api_web/api_product/product/?csrf_protection=true", data);
        return response.data
    },

}

export default apiProducts