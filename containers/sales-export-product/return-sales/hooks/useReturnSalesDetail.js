import apiReturnSales from "@/Api/apiSalesExportProduct/returnSales/apiReturnSales";
import { optionsQuery } from "@/configs/optionsQuery";
import { useQuery } from "@tanstack/react-query";

export const useReturnSalesDetail = (open, id) => {
    return useQuery({
        queryKey: ["api_detail_return_order", id],
        queryFn: async () => {
            const db = await apiReturnSales.apiDetailReturnOrder(id)

            return db
        },
        ...optionsQuery,
        enabled: open && !!id
    })
}