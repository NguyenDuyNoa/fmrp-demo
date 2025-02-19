import apiDashboard from "@/Api/apiDashboard/apiDashboard";
import { optionsQuery } from "@/configs/optionsQuery";
import { CookieCore } from "@/utils/lib/cookie";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query"
import { useDispatch } from "react-redux";

export const useAuththentication = (auth) => {
    const dispatch = useDispatch()
    return useQuery({
        queryKey: ["api_authentication"],
        queryFn: async () => {
            const { isSuccess, info } = await apiDashboard.apiAuthentication();
            dispatch({ type: "auth/update", payload: isSuccess ? info : false });
            return info || false
        },
        placeholderData: keepPreviousData,
        enabled: auth == null,
        ...optionsQuery
    })
}

// thông tin tài khoản
export const useGetInfo = ({ open }) => {
    return useQuery({
        queryKey: ["api_get_info", open],
        queryFn: async () => {
            const res = await apiDashboard.apiGetInfo();
            return res
        },
        placeholderData: keepPreviousData,
        enabled: open,
        ...optionsQuery
    })
}

// đổi ảnh tài khoản
export const useUpdateAvatar = () => {
    const submitMutation = useMutation({
        mutationFn: (data) => {
            return apiDashboard.apiUpdateAvatarInfo(data)
        },
        retry: 5,
        retryDelay: 5000
    })
    const onSubmit = async (image) => {
        let formtData = new FormData();
        formtData.append('profile_image', image)
        const r = await submitMutation.mutateAsync(formtData)
        return r
    }
    return { onSubmit, isLoading: submitMutation.isPending }
}
// đổi mk
export const useChangePassword = () => {
    const submitMutation = useMutation({
        mutationFn: (data) => {
            return apiDashboard.apiChangePassword(data)
        },
        retry: 5,
        retryDelay: 5000
    })
    const onSubmit = async (data) => {
        let formtData = new FormData();
        formtData.append('password', data?.newPassword)
        formtData.append('password_confirm', data?.confirmPassword)
        const r = await submitMutation.mutateAsync(formtData)
        return r
    }
    return { onSubmit, isLoading: submitMutation.isPending }
}

export const useLanguage = (lang) => {
    return useQuery({
        queryKey: ["api_Language", lang],
        queryFn: async () => {
            const res = await apiDashboard.apiLang(lang);

            if (typeof res.isSuccess == "boolean" && !res.isSuccess) {
                CookieCore.remove('tokenFMRP')
                CookieCore.remove('databaseappFMRP')
            }
            return res
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })
}

export const useSetings = () => {
    const dispatch = useDispatch()
    return useQuery({
        queryKey: ["api_settings"],
        queryFn: async () => {
            const res = await apiDashboard.apiSettings();
            dispatch({ type: "setings/server", payload: res?.settings });
            const fature = await apiDashboard.apiFeature();
            const newData = {
                dataMaterialExpiry: fature.find((x) => x.code == "material_expiry"),
                dataProductExpiry: fature.find((x) => x.code == "product_expiry"),
                dataProductSerial: fature.find((x) => x.code == "product_serial"),
            };
            dispatch({ type: "setings/feature", payload: newData });
            return newData
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })
}