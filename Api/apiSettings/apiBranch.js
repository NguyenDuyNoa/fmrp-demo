import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiBranch = {
    async apiListBranch(param) {
        const response = await axiosCustom('GET', `/api_web/Api_Branch/branch?csrf_protection=true`, param);
        return response.data
    },
    async apiHandingBranch(id, data) {
        const response = await axiosCustom('POST', id ? `/api_web/Api_Branch/branch/${id}?csrf_protection=true` : "/api_web/Api_Branch/branch?csrf_protection=true", data);
        return response.data
    },
}
export default apiBranch