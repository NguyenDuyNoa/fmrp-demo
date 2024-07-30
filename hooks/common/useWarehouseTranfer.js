import apiSalesOrder from "@/Api/apiSalesExportProduct/salesOrder/apiSalesOrder";
import { reTryQuery } from "@/configs/configRetryQuery";
import { useQuery } from "@tanstack/react-query";

export const useWarehouseTranfer = () => {
    return useQuery({
        queryKey: ['api_list_transfer'],
        queryFn: async () => {
            const { result } = await apiSalesOrder.apiListTransferCombobox()

            return result?.map(({ code, id }) => ({ label: code, value: id }))
        },
        ...reTryQuery
    })
}