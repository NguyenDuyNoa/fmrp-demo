import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiReceipts = {
    async apiListReceipts(params) {
        const response = await axiosCustom('GET', `/api_web/Api_expense_payslips/expenseCoupon/?csrf_protection=true`, params);
        return response.data
    },

    async apiReceiptsDetail(id) {
        const response = await axiosCustom('GET', `/api_web/Api_expense_payslips/expenseCoupon/${id}?csrf_protection=true`);
        return response.data
    },

    async apiHandingReceipts(id, data) {
        const response = await axiosCustom('POST', id ? `/api_web/Api_expense_payslips/expenseCoupon/${id}?csrf_protection=true` : "/api_web/Api_expense_payslips/expenseCoupon/?csrf_protection=true", data);
        return response.data
    },
    async apiPrintReceipts(data) {
        const response = await axiosCustom('POST', `/api_web/Api_print/Print_ReceiptsWeb?csrf_protection=true`, data)
        return response.data
    },  

    async apiPrintPayments(data) {
        const response = await axiosCustom('POST', `/api_web/Api_print/Print_PaymentsWeb?csrf_protection=true`, data)
        return response.data
    },
}
export default apiReceipts