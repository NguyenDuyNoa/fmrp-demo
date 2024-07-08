import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiCategoryDetailErrors = {
    async apiListDetailError(param) {
        const response = await axiosCustom('GET', `api_web/Api_category_error/getListDetailError?csrf_protection=true`, param);
        return response.data
    },
    async apiHandingDetailError(data) {
        const response = await axiosCustom('POST', `api_web/Api_category_error/detailError?csrf_protection=true`, data);
        return response.data
    },
    async apiCategoryDetailError(param) {
        const response = await axiosCustom('GET', `api_web/Api_category_error/getListSelectCategoryError?csrf_protection=true`, param);
        return response.data
    },
    async apiEditDetailError(id) {
        const response = await axiosCustom('GET', `api_web/Api_category_error/getDetailError/${id}?csrf_protection=true`,);
        return response.data
    },
}
export default apiCategoryDetailErrors