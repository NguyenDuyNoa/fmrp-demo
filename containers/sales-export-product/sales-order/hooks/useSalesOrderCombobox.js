import apiSalesOrder from "@/Api/apiSalesExportProduct/salesOrder/apiSalesOrder";
import { optionsQuery } from "@/configs/optionsQuery";
import { useQuery } from "@tanstack/react-query";

export const useSalesOrderCombobox = (search) => {
    return useQuery({
        queryKey: ["api_search_orders", search],
        queryFn: async () => {

            const { data } = await apiSalesOrder.apiSearchOrder({
                params: {
                    search: search ? search : "",
                }
            });

            return data?.orders?.map(({ reference_no, id }) => ({ label: reference_no, value: id }))
        },
        ...optionsQuery
    });

}