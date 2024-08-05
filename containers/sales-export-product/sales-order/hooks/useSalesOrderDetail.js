import apiSalesOrder from "@/Api/apiSalesExportProduct/salesOrder/apiSalesOrder";
import { optionsQuery } from "@/configs/optionsQuery";
import { useQuery } from "@tanstack/react-query";

export const useSalesOrderDetail = (open, id) => {
    return useQuery({
        queryKey: ["api_detail_sales_order", id],
        queryFn: async () => {

            const db = await apiSalesOrder.apiDetail(id)

            return db
        },
        enabled: open && !!id,
        ...optionsQuery
    })

}