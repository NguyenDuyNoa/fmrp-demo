import apiDeliveryReceipt from "@/Api/apiSalesExportProduct/deliveryReceipt/apiDeliveryReceipt";
import { useQuery } from "@tanstack/react-query";

const fetchDeliveryReceip = async (search) => {
    try {
        const { data } = await apiDeliveryReceipt.apiSearchDeliveries({
            params: {
                search: search ? search : "",
            }
        })
        return data?.orders?.map((e) => ({ label: e?.reference_no, value: e?.id })) || []
    } catch (error) {

    }
};
export const useDeliveryReceipCombobox = (search) => {
    return useQuery({
        queryKey: ["api_delivery_receip_combobox", search],
        queryFn: () => fetchDeliveryReceip(search)
    })
}
