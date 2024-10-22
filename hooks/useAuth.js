import apiDashboard from "@/Api/apiDashboard/apiDashboard";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useDispatch } from "react-redux";

export const useAuththentication = (auth) => {
    const dispatch = useDispatch()
    return useQuery({
        queryKey: ["api_authentication"],
        queryFn: async () => {
            const { isSuccess, info } = await apiDashboard.apiAuthentication();
            if (isSuccess) {
                dispatch({ type: "auth/update", payload: info });
            } else {
                dispatch({ type: "auth/update", payload: false });
            }
            return info || false
        },
        placeholderData: keepPreviousData,
        enabled: auth == null,
        ...optionsQuery
    })
}

export const useLanguage = (lang) => {
    return useQuery({
        queryKey: ["api_Language", lang],
        queryFn: async () => {
            const res = await apiDashboard.apiLang(lang);
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