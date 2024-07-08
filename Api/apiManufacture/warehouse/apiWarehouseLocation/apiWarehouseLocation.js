import { _ServerInstance as axiosCustom } from "@/services/axios";

const apiLocationWarehouse = {
    async apiLocationWarehouse(param) {
        const response = await axiosCustom('GET', `/api_web/api_warehouse/location/?csrf_protection=true`, param);
        return response.data
    },
    async apiHandingStatus(id, data) {
        const response = await axiosCustom('POST', `/api_web/api_warehouse/locationStatus/${id}?csrf_protection=true`, data);
        return response.data
    },
    async apiHandingLocation(url, data) {
        const response = await axiosCustom('POST', `${url}`, data);
        return response.data
    },

}
export default apiLocationWarehouse