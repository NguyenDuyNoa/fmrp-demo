import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiProducts = {
    async apiListProducts(params) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_product/product/?csrf_protection=true`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiProductTypeProducts() {
        try {
            const response = await axiosCustom('GET', `/api_web/api_product/productType/?csrf_protection=true`);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiUnitProducts() {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_unit/unit/?csrf_protection=true`);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiVariationProducts() {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_variation/variation?csrf_protection=true`);
            return response.data
        } catch (error) {
            throw error;
        }
    },

    async apiCategoryOptionProducts(params) {
        try {
            const response = await axiosCustom('GET', `api_web/api_product/categoryOption/?csrf_protection=true`, params || undefined);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiStageProducts() {
        try {
            const response = await axiosCustom('GET', `/api_web/api_product/stage/?csrf_protection=true`);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiDetailProducts(id) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_product/product/${id}?csrf_protection=true`);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiDetailStageProducts(id) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_product/getDesignStages/${id}?csrf_protection=true`);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiDetailBomProducts(params) {
        try {
            const response = await axiosCustom('GET', `/api_web/Api_product/getDesignBOM?csrf_protection=true`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiHandingProducts(id, data) {
        try {
            const response = await axiosCustom('POST', id ? `/api_web/api_product/product/${id}?csrf_protection=true` : "/api_web/api_product/product/?csrf_protection=true", data);
            return response.data
        } catch (error) {
            throw error;
        }
    },

}

export default apiProducts