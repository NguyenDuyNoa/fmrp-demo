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

        console.log('data submit', data);


        formData.append("improve_id", data?.improve_id ?? "");
        formData.append("feeling_id", data?.feeling_id ?? "");
        formData.append("note", data?.note ?? "");

        // if (data?.files?.length > 0) {
        //     formData.append("files", data?.files ?? []);
        // }

        if (data?.files?.length > 0) {
            for (let index = 0; index < data?.files?.length; index++) {
                const element = data?.files[index];
                formData.append("files[]", element);
            }
        }

        const r = await postRecommendation.mutateAsync(formData);

        console.log('r,r', r);


        return r
    }

    return { isLoading: postRecommendation.isPending, onSubmit }
}