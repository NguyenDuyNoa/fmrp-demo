import { _ServerInstance as axiosCustom } from "@/services/axios";

const apiSuppliersDebt = {
    async apiSupplierDebtList(params) {
        const response = await axiosCustom('GET', `/api_web/Api_debt_supplier/GetDebtSuppliers?csrf_protection=true&cong=true`, params);
        return response.data
    },

    async apiSupplierDetailArises(params, id, type) {
        const response = await axiosCustom('GET', `/api_web/Api_debt_supplier/debtDetail/${id}/${type}?csrf_protection=true`, params);
        return response.data
    },
    async apiSupplierDetailFirst(params, id) {
        const response = await axiosCustom('GET', `/api_web/Api_debt_supplier/debtDetail/${id}/no_chi_start?csrf_protection=true`, params);
        return response.data
    },

}
export default apiSuppliersDebt