import { _ServerInstance as axiosCustom } from "@/services/axios";

const apiCategoryErrors = {
    async apiCategoryErrors(params) {
        const response = await axiosCustom('GET', `api_web/Api_category_error/getListCategory?csrf_protection=true`, params);
        return response.data
    },
    // api lưu
    async apiHandingCategoryErrors(data) {
        const response = await axiosCustom('POST', `api_web/Api_category_error/detailCategoryError?csrf_protection=true`, data);
        return response.data
    },
    // api lấy chi tiết
    async apiGetDetailCategoryErrors(id) {
        const response = await axiosCustom('GET', `api_web/Api_category_error/getDetailCategoryError/${id}`);
        return response.data
    },

}
export default apiCategoryErrors