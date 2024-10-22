import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiProductionsOrders = {
    async apiProductionOrders(page, limit, param) {
        // Danh sách LSX tổng
        const response = await axiosCustom('GET', `api_web/api_manufactures/getProductionOrders?page=${page}&limit=${limit}`, param);
        return response.data
    },
    async apiDetailProductionOrders(id) {
        // api chi tiết danh sách LSX tổng
        const response = await axiosCustom('GET', `/api_web/api_manufactures/getDetailProductionOrder/${id}`);
        return response.data
    },
    // bộ lọc lsx
    async apiComboboxProductionOrders(param) {
        const response = await axiosCustom('GET', `/api_web/api_manufactures/searchPO`, param);
        return response.data
    },
    // bộ lọc lsx chi tiết
    async apiComboboxProductionOrdersDetail() {
        const response = await axiosCustom('GET', `/api_web/api_manufactures/searchPODetail`);
        return response.data
    },
    // api chi tiết lsx
    async apiItemOrdersDetail(id) {
        const response = await axiosCustom('GET', `/api_web/api_manufactures/getPOD/${id}`);
        return response.data
    },
    // Tình hình xuất NVL danh sách giữ liệu
    async apiExportSituation(id) {
        const response = await axiosCustom('GET', `/api_web/api_manufactures/getListBomPOD/${id}`);
        return response.data
    },
    // lịch sử xuất NVL/BTP
    async apiGetSuggestExporting(data) {
        const response = await axiosCustom('POST', `/api_web/Api_Suggest_Exporting/getSuggestExporting`, data);
        return response.data
    },
    // api đổi trạng thái sản xuất
    async apiAgreeProcess(data) {
        const response = await axiosCustom('POST', `/api_web/api_manufactures/agreeProcess`, data);
        return response.data
    },

    async apiHandingProducts(data) {
        const response = await axiosCustom('POST', `/api_web/api_manufactures/handlingProducts`, data);
        return response.data
    },

    // Lấy dữ liệu trước khi nhập sản xuất
    async apiDataProducts(data) {
        const response = await axiosCustom('POST', `/api_web/api_manufactures/getDataProducts`, data);
        return response.data
    },
    // lấy combobox kho của NVL/BTP xuất
    async apiDataWarehousePo(data) {
        const response = await axiosCustom('POST', `/api_web/api_manufactures/searchWarehousePOD`, data);
        return response.data
    },

}
export default apiProductionsOrders