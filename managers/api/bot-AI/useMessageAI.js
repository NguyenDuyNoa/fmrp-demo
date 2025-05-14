import apiChatAI from "@/Api/ai/apiChatAI";
import { useQuery } from "@tanstack/react-query";

export const fetchStartMessageAI = async (type) => {
    try {
        const response = await apiChatAI.apiNewStartChat({
            data: { type },
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API bắt đầu chat:", error);
        throw error;
    }
};

export const useStartMessageAI = ({ type, enable, authState }) => {

    return useQuery({
        queryKey: ["startChatAI", authState?.user_email || ""],
        queryFn: () => fetchStartMessageAI(type),
        enabled: enable,
    });
};

export const fetchNewMessageAI = async ({
    type,
    nextStep,
    sessionId,
    message,
    chatScenariosId,
    step,
    params,
}) => {
    try {
        const response = await apiChatAI.apiChatTextBotAI({
            data: {
                type: type,
                step_next: nextStep,
                session_id: sessionId,
                message,
                chat_scenarios_id: chatScenariosId,
                step: step,
                params: params ?? null,
            },
        });

        return response.data;
    } catch (error) {
        throw new Error(error);
    }
};

export const completeStepChatBot = async ({ data, api }) => {
    try {
        const response = await apiChatAI.apiCompleteChatBot({ data, api });
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
};
