import { _ServerInstance as axiosCustom } from "@/services/axios";

const apiWarehouse = {
    async apiListWarehouse(param) {
        const response = await axiosCustom('GET', `/api_web/api_warehouse/warehouse/?csrf_protection=true`, param);
        return response.data
    },
    async apiHandingWarehouse(url, data) {
        const response = await axiosCustom('POST', `${url}`, data);
        return response.data
    },
    async apiWarehouseDetail(id, param) {
        const response = await axiosCustom('GET', `/api_web/api_warehouse/warehouse_detail/${id}?csrf_protection=true`, param);
        return response.data
    },
    async apiLocationWarehouse(id) {
        const response = await axiosCustom('GET', `/api_web/api_warehouse/location/?csrf_protection=true&filter[warehouse_id]=${id}`);
        return response.data
    },

}
export default apiWarehouse