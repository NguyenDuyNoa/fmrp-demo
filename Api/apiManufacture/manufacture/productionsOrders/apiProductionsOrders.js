import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiProductionsOrders = {
    async apiProductionOrders(page, limit, param) {
        // Danh sách LSX tổng
        const response = await axiosCustom('GET', `/api_web/api_manufactures/getProductionOrders?page=${page}&limit=${limit}`, param);
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
    async apiComboboxProductionOrdersDetail(param) {
        const response = await axiosCustom('GET', `/api_web/api_manufactures/searchPODetail`, param);
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

    //  lịch sử nhập kho tp
    async apiGetPurchaseProducts(data) {
        const response = await axiosCustom('POST', `/api_web/Api_Purchase_Products/getPurchaseProducts`, data);
        return response.data
    },
    // thu hồi nvl
    async apiGetRecallProduction(data) {
        const response = await axiosCustom('POST', `/api_web/Api_Purchase_Internal/getItems`, data);
        return response.data
    },
    // chi phí nvl
    async apiGetCostProduction(data) {
        const response = await axiosCustom('POST', `/api_web/Api_Suggest_Exporting/getFactoryProductionCost`, data);
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

    // xóa thành phẩm trong công đoạn
    async apiRemovePurchaseProduct(data) {
        const response = await axiosCustom('POST', `/api_web/api_manufactures/removePurchaseProduct`, data);
        return response.data
    },

    // ds công đoạn tp, công đoạn btp

    async apiFinishedStages(id) {
        const response = await axiosCustom('GET', `/api_web/api_manufactures/finished_stages?po_id=${id}`);
        return response.data
    },
    // lấy thông tin mặt hàng cần hoàn thành
    async apiActiveStages(data) {
        const response = await axiosCustom('POST', `/api_web/api_manufactures/activeStages`, data);
        return response.data
    },
    // API lấy thông tin BOM cần xuất
    async apiLoadOutOfStock(data) {
        const response = await axiosCustom('POST', `/api_web/api_manufactures/loadOutOfStock`, data);
        return response.data
    },
    // api lưu hoàn thành
    async apiHandlingFinishedStages(data) {
        const response = await axiosCustom('POST', `/api_web/api_manufactures/handlingFinishedStages`, data);
        return response.data
    },
    // xóa lsx
    async apiDeleteProductionOrders(id) {
        const response = await axiosCustom('DELETE', `/api_web/api_manufactures/deleteProductionOrders/${id}`);
        return response.data
    },
}
export default apiProductionsOrders