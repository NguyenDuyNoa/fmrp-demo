import apiContact from "@/Api/apiSuppliers/contacts/apiContact";
import { reTryQuery } from "@/configs/configRetryQuery";
import { useQuery } from "@tanstack/react-query";

export const usseSuppilerContactList = (params, updateTotalItems) => {
    return useQuery({
        queryKey: ["api_supplier_contact_list", { ...params }],
        queryFn: async () => {

            const { rResult, output } = await apiContact.apiListContact({ params: params })

            updateTotalItems(output);

            return { rResult, output }
        },
        ...reTryQuery
    })
}