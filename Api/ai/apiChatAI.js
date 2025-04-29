import { _ServerInstance as axiosCustom } from "@/services/axios";

const apiChatAI = {
  async apiNewStartChat(data) {
    const response = await axiosCustom(
      "POST",
      `/api_web/Api_OpenAI/startChat`,
      data
    );

    return response.data;
  },

  async apiChatTextBotAI(data) {
    console.log("🚀 ~ apiChatTextBotAI ~ data:", data);

    const response = await axiosCustom(
      "POST",
      `/api_web/Api_OpenAI/message`,
      data
    );

    return response.data;
  },
};

export default apiChatAI;
