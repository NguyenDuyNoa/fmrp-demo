import { _ServerInstance as axiosCustom } from "@/services/axios";

const apiProductsWarehouse = {

    async apiListProductWarehouse(param) {
        const response = await axiosCustom('GET', `/api_web/Api_product_receipt/productReceipt/?csrf_protection=true`, param);
        return response.data
    },
    async apiListGroupProductWarehouse(param) {
        const response = await axiosCustom('GET', `/api_web/Api_product_receipt/filterBar/?csrf_protection=true`, param);
        return response.data
    },
    async apiComboboxProductWarehouse(method, data) {
        const response = await axiosCustom(method, `/api_web/Api_product_receipt/productReceiptCombobox/?csrf_protection=true`, data);
        return response.data
    },


    async apiHandingStatusWarehouse(data) {
        const response = await axiosCustom('POST', `/api_web/Api_product_receipt/ConfirmWarehous?csrf_protection=true`, data);
        return response.data
    },
    async apiDetailPoductWarehouse(id) {
        const response = await axiosCustom('GET', `/api_web/Api_product_receipt/productReceipt/${id}?csrf_protection=true`,);
        return response.data
    },
    // FORM
    async apiDetailPagePoductWarehouse(id) {
        const response = await axiosCustom('GET', `/api_web/Api_product_receipt/getProductReceiptDetail/${id}?csrf_protection=true`,);
        return response.data
    },
    async apiItemPoductWarehouse(method, data) {
        const response = await axiosCustom(method, `/api_web/Api_product_receipt/getProduct/?csrf_protection=true`, data);
        return response.data
    },

    async apiWarehouseCombobox(param) {
        const response = await axiosCustom('GET', `/api_web/Api_warehouse/warehouseCombobox/?csrf_protection=true`, param);
        return response.data
    },
    async apiWarehouseLocationCombobox(param) {
        const response = await axiosCustom('GET', `/api_web/Api_warehouse/warehouseLocationCombobox/?csrf_protection=true`, param);
        return response.data
    },
    async apiHandingProdcutsWarehouse(id, data) {
        const response = await axiosCustom('POST', id ? `/api_web/Api_product_receipt/productReceipt/${id}?csrf_protection=true` : `/api_web/Api_product_receipt/productReceipt/?csrf_protection=true`, data);
        return response.data
    },

}
export default apiProductsWarehouse