import apiComons from "@/Api/apiComon/apiComon";
import { reTryQuery } from "@/configs/configRetryQuery";
import { useQuery } from "@tanstack/react-query";

export const useTreatmentList = (dataLang) => {
    return useQuery({
        queryKey: ["api_treatment_list"],
        queryFn: async () => {

            const data = await apiComons.apiListTreatment();

            return data?.map((e) => ({
                label: dataLang[e?.name],
                value: e?.id,
            }))

        },
        ...reTryQuery
    })

}