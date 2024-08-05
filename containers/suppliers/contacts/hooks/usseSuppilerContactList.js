import apiContact from "@/Api/apiSuppliers/contacts/apiContact";
import { optionsQuery } from "@/configs/optionsQuery";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const usseSuppilerContactList = (params) => {
    return useQuery({
        queryKey: ["api_supplier_contact_list", { ...params }],
        queryFn: async () => {

            const { rResult, output } = await apiContact.apiListContact({ params: params })

            return { rResult, output }
        },
        placeholderData: keepPreviousData,
        ...optionsQuery
    })
}