import apiComons from "@/Api/apiComon/apiComon";
import { useQuery } from "@tanstack/react-query";

export const useSolutionList = (dataLang) => {
    return useQuery({
        queryKey: ["api_list_solution"],
        queryFn: async () => {

            const data = await apiComons.apiSolution();

            return data?.map((e) => ({
                label: dataLang[e?.name] ? dataLang[e?.name] : e?.name,
                value: e?.id,
            }))
        },
    });
}