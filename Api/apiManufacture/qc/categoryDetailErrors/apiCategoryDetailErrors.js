import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiCategoryDetailErrors = {
    async apiListDetailError(param) {
        try {
            const response = await axiosCustom('GET', `api_web/Api_category_error/getListDetailError?csrf_protection=true`, param);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiHandingDetailError(data) {
        try {
            const response = await axiosCustom('POST', `api_web/Api_category_error/detailError?csrf_protection=true`, data);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiCategoryDetailError(param) {
        try {
            const response = await axiosCustom('GET', `api_web/Api_category_error/getListSelectCategoryError?csrf_protection=true`, param);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiEditDetailError(id) {
        try {
            const response = await axiosCustom('GET', `api_web/Api_category_error/getDetailError/${id}?csrf_protection=true`,);
            return response.data
        } catch (error) {
            throw error;
        }
    },
}
export default apiCategoryDetailErrors