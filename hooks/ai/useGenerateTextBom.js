import apiAiBoms from "@/Api/ai/apiAiBoms";
import { useMutation } from "@tanstack/react-query";
import useToast from "../useToast";

export const usePostGenerateTextBom = () => {
    const isShow = useToast()

    const generateContentMutation = useMutation({
        mutationFn: (data) => {
            return apiAiBoms.apiSendMessageBOMOpenAI(data);
        },

        onSuccess(data, variables, context) {
            if (!data?.isSuccess) {
                isShow("error", data?.message);
            }

            return data;
        },
        onError(error, variables, context) {
            const errorMessage = error?.response?.data?.message
            isShow("error", errorMessage);
        },
        gcTime: 5000,
        retry: 8
    });

    const onSubmit = async (data) => {
        try {
            let formData = new FormData();
            formData.append("content", data?.content);
            formData.append("type_ai", 'openai');
            formData.append("type_chat", data?.typeChat);

            const r = await generateContentMutation.mutateAsync(formData);

            return r
        } catch (error) {
            throw error
        }
    };
    return { onSubmit, isLoading: generateContentMutation.isPending, data: generateContentMutation?.data?.data };
};
