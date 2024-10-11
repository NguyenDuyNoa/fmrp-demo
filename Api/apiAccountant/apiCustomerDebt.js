
import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiCustomerDebt = {
    async apiListCustomerDebt(params) {
        const response = await axiosCustom('GET', `/api_web/Api_debt_client/debtClient?csrf_protection=true`, params);
        return response.data
    },
    async apiCustomerDebtDetailArises(params, id, type) {
        const response = await axiosCustom('GET', `/api_web/Api_debt_client/debtDetail/${id}/${type}?csrf_protection=true`, params);
        return response.data
    },
    async apiCustomerDebtDetailFirst(params, id) {
        const response = await axiosCustom('GET', `/api_web/Api_debt_client/debtDetail/${id}/no_thu_start?csrf_protection=true`, params);
        return response.data
    },
}
export default apiCustomerDebt