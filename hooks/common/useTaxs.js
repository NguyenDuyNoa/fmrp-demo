import apiComons from "@/Api/apiComon/apiComon";
import { optionsQuery } from "@/configs/optionsQuery";
import { useQuery } from "@tanstack/react-query";

export const useTaxList = () => {
    return useQuery({
        queryKey: ["api_tax"],
        queryFn: async () => {

            const { rResult } = await apiComons.apiListTax({});

            return rResult?.map((e) => ({
                label: e.name,
                value: e.id,
                tax_rate: e.tax_rate,
            }))
        },
        ...optionsQuery
    });

}