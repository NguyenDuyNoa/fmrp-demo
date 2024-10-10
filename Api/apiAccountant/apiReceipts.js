import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiReceipts = {
    async apiListReceipts(params) {
        const response = await axiosCustom('GET', `/api_web/Api_expense_payslips/expenseCoupon/?csrf_protection=true`, params);
        return response.data
    },

}
export default apiReceipts