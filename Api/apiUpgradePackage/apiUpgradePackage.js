import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiUpgradePackage = {
    async apiGetUpgradePackage() {
        const response = await axiosCustom('POST', `/api_web/Api_upgrade_package/get_upgrade_package?csrf_protection=true`);
        return response.data
    },
    async apiGetPackage(data) {
        const response = await axiosCustom('POST', `/api_web/Api_upgrade_package/get_package/?csrf_protection=true`, data);
        return response.data
    },
    async apiGetServiceAdd(data) {
        const response = await axiosCustom('POST', `/api_web/Api_upgrade_package/get_service_add?csrf_protection=true`, data);
        return response.data
    },
    async apiUpgradePackage(id, data) {
        const response = await axiosCustom('POST', `/api_web/Api_upgrade_package/upgrade_package/${id}?csrf_protection=true`, data);
        return response.data
    }
}
export default apiUpgradePackage