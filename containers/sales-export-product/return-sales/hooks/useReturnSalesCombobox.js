import apiReturnSales from "@/Api/apiSalesExportProduct/returnSales/apiReturnSales";
import { reTryQuery } from "@/configs/configRetryQuery";
import { useQuery } from "@tanstack/react-query";

const fetChListCode = async (search) => {
    try {
        const { data } = await apiReturnSales.apiSearchReturnOrder({ data: { term: search } });
        return data?.return_order.map((e) => ({ label: e.reference_no, value: e.id }))
    } catch (error) {

    }
}

export const useReturnSalesCombobox = (search) => {
    return useQuery({
        queryKey: ["api_search_return_order", search],
        queryFn: () => fetChListCode(search),
        ...reTryQuery
    });
}