import apiRecommendation from "@/Api/popup/apiRecommendation";
import { useMutation } from "@tanstack/react-query";

export const usePostRecommendation = () => {
    const postRecommendation = useMutation({
        mutationFn: async (payload) => {
            const r = await apiRecommendation.apiPostRecommendation(payload);
            return r
        },
    })

    const onSubmit = async (data) => {
        let formData = new FormData();

        formData.append("note", data?.feedbackContent ?? "");

        if (data?.feedbackImages?.length > 0) {
            for (let index = 0; index < data?.feedbackImages?.length; index++) {
                const element = data?.feedbackImages[index];
                formData.append("files[]", element);
            }
        }

        const r = await postRecommendation.mutateAsync(formData);

        return r
    }

    return { isLoading: postRecommendation.isPending, onSubmit }
}