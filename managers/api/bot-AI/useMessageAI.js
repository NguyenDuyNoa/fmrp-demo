import apiChatAI from "@/Api/ai/apiChatAI";
import { useQuery } from "@tanstack/react-query";

export const useStartMessageAI = ({ type, openAI }) => {
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
        enabled: openAI,
    });
};
