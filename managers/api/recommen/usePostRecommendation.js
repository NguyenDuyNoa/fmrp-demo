import apiRecommendation from "@/Api/popup/apiRecommendation";
import useToast from "@/hooks/useToast";
import ToatstNotifi, { ToastCustomCard } from "@/utils/helpers/alerNotification";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

export const usePostRecommendation = () => {
    const dispatch = useDispatch()
    const toast = useToast({ position: "top" })

    const postRecommendation = useMutation({
        mutationFn: async (payload) => {
            const r = await apiRecommendation.apiPostRecommendation(payload);
            return r
        },
        onSuccess: (data) => {
            if (data.isSuccess) {
                ToastCustomCard('Cảm ơn bạn rất nhiều!', 'Chúng tôi sẽ đọc kỹ từng góp ý để cải tiến sản phẩm.');
                dispatch({
                    type: "statePopupGlobal",
                    payload: { open: false },
                })
            } else {
                toast('error', data.message, 1500, "bottom-right")
            }
        },
        onError: (error) => {
            // setLoading(false);
            throw new Error(error);
        },
    })

    const onSubmit = async (data) => {
        let formData = new FormData();

        formData.append("improve_id", data?.improve_id ?? "");
        formData.append("feeling_id", data?.feeling_id ?? "");
        formData.append("note", data?.note ?? "");

        if (data?.files?.length > 0) {
            for (let index = 0; index < data?.files?.length; index++) {
                const element = data?.files[index];
                formData.append("files[]", element);
            }
        }

        const r = await postRecommendation.mutateAsync(formData);

        return r
    }

    return { isLoading: postRecommendation.isPending, onSubmit }
}