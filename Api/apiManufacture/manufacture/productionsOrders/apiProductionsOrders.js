import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiProductionsOrders = {
    async apiProductionOrders(page, limit, param) {
        try {
            // Danh sách LSX tổng
            const response = await axiosCustom('GET', `api_web/api_manufactures/getProductionOrders?page=${page}&limit=${limit}`, param);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    async apiDetailProductionOrders(id) {
        try {
            // api chi tiết danh sách LSX tổng
            const response = await axiosCustom('GET', `/api_web/api_manufactures/getDetailProductionOrder/${id}`);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    // bộ lọc lsx
    async apiComboboxProductionOrders(param) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_manufactures/searchPO`, param);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    // bộ lọc lsx chi tiết
    async apiComboboxProductionOrdersDetail() {
        try {
            const response = await axiosCustom('GET', `/api_web/api_manufactures/searchPODetail`);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    // api chi tiết lsx
    async apiItemOrdersDetail(id) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_manufactures/getPOD/${id}`);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    // Tình hình xuất NVL danh sách giữ liệu
    async apiExportSituation(id) {
        try {
            const response = await axiosCustom('GET', `/api_web/api_manufactures/getListBomPOD/${id}`);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    // api đổi trạng thái sản xuất
    async apiAgreeProcess(data) {
        try {
            const response = await axiosCustom('POST', `/api_web/api_manufactures/agreeProcess`, data);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    // Lấy dữ liệu trước khi nhập sản xuất

    async apiDataProducts(data) {
        try {
            const response = await axiosCustom('POST', `/api_web/api_manufactures/getDataProducts`, data);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    // lấy combobox kho của NVL/BTP xuất
    async apiDataWarehousePo(data) {
        try {
            const response = await axiosCustom('POST', `/api_web/api_manufactures/searchWarehousePOD`, data);
            return response.data
        } catch (error) {
            throw error;
        }
    },
    // /api_web/api_manufactures/searchWarehousePOD

}
export default apiProductionsOrders