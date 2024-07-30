import apiComons from "@/Api/apiComon/apiComon";
import { useQuery } from "@tanstack/react-query";

export const useClientCombobox = (search) => {
    return useQuery({
        queryKey: ["api_client_combobox", search],
        queryFn: async () => {

            const { data } = await apiComons.apiSearchClient({
                params: {
                    search: search ? search : "",
                    limit: 0
                }
            })

            return data?.clients?.map((e) => ({ label: e.name, value: e.id }))
        }
    })

}