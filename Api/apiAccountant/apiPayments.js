import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiPayments = {
    async apiListPayment(params) {
        const response = await axiosCustom('GET', `/api_web/Api_expense_voucher/expenseVoucher/?csrf_protection=true`, params);
        return response.data
    },
    async apiDetailPayment(id) {
        const response = await axiosCustom('GET', `/api_web/Api_expense_voucher/expenseVoucher/${id}?csrf_protection=true`);
        return response.data
    },
    async apiHandingPayment(data, id) {
        const response = await axiosCustom('POST', id ? `/api_web/Api_expense_voucher/expenseVoucher/${id}?csrf_protection=true` : "/api_web/Api_expense_voucher/expenseVoucher/?csrf_protection=true", data)
        return response.data
    },

    async apiDeductDeposit(data) {
        const response = await axiosCustom('POST', `/api_web/Api_expense_voucher/deductDeposit/?csrf_protection=true`, data);
        return response.data
    },

}
export default apiPayments