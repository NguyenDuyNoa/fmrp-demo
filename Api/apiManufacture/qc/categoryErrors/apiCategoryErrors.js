import { _ServerInstance as axiosCustom } from "@/services/axios";

const apiCategoryErrors = {
    async apiCategoryErrors(params) {
        try {
            const response = await axiosCustom('GET', `api_web/Api_category_error/getListCategory?csrf_protection=true`, params);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    // api lưu
    async apiHandingCategoryErrors(data) {
        try {
            const response = await axiosCustom('POST', `api_web/Api_category_error/detailCategoryError?csrf_protection=true`, data);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    // api lấy chi tiết
    async apiGetDetailCategoryErrors(id) {
        try {
            const response = await axiosCustom('GET', `api_web/Api_category_error/getDetailCategoryError/${id}`);
            return response.data
        } catch (error) {
            throw error;
        }
    },

}
export default apiCategoryErrors