import { _ServerInstance as axiosCustom } from "@/services/axios";

const apiPrefix = {
    async apiListPrefix() {
        const response = await axiosCustom('GET', `/api_web/api_prefix/prefix?limit=0?csrf_protection=true`);
        return response.data
    },
    async apiHandingPrefix(data) {
        const response = await axiosCustom('POST', `/api_web/api_prefix/prefix?csrf_protection=true`, data);
        return response.data
    },
}
export default apiPrefix