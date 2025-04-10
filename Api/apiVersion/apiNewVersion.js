import { _ServerInstance as axiosCustom } from "@/services/axios";
const apiVersionApplication = {
  // lấy phiên bản update mới
  async apiGetNewVersion() {
    const response = await axiosCustom("GET", `/api_web/Api_Versions/show`);
    return response.data;
  },

  //cập nhật phiên bản
  async apiPostUpdateNewVersion() {
    const response = await axiosCustom("POST", `/api_web/Api_Versions/update`);

    console.log("🚀 ~ apiPostUpdateNewVersion ~ response:", response);
    return response.data;
  },
};

export default apiVersionApplication;
