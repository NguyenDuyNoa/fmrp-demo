import apiChatAI from "@/Api/ai/apiChatAI";
import { useQuery } from "@tanstack/react-query";

export const useStartMessageAI = ({ type, enable }) => {
    const fetchNewMessageAI = async () => {
        try {
            const response = await apiChatAI.apiNewStartChat({
                data: {
                    type: type,
                },
            });
            return response.data;
        } catch (error) {
            throw new Error(error);
        }
    };

    return useQuery({
        queryKey: ["startChatAI"],
        queryFn: fetchNewMessageAI,
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
    console.log("🚀 ~ params:", params)
    try {
        const response = await apiChatAI.apiChatTextBotAI({
            data: {
                type: type,
                step_next: nextStep,
                session_id: sessionId,
                message,
                chat_scenarios_id: chatScenariosId,
                step: step,
                // params: params
                //     ? {
                //         value_product: params.valueProduct,
                //         is_semi_product: params.idSemiProduct,
                //     }
                //     : null,
                params: params ?? null,
            },
        });

        return response.data;
    } catch (error) {
        throw new Error(error);
    }
};
