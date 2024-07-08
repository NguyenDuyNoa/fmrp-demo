import { _ServerInstance as axiosCustom } from "@/services/axios";

const apiGeneral = {
    async apiHanding(data) {
        const response = await axiosCustom('POST', `/api_web/api_setting/feature/?csrf_protection=true`, data);
        return response.data
    },
}
export default apiGeneral