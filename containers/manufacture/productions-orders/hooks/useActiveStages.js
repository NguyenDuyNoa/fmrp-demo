import apiProductionsOrders from "@/Api/apiManufacture/manufacture/productionsOrders/apiProductionsOrders";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useActiveStages = () => {
    const convertData = (data) => {
        return {
            ...data,
            data: {
                ...data?.data,
                items: data?.data?.items.map((e) => {
                    return {
                        ...e,
                        quantityError: 0,
                        quantityEnterClient: e?.quantity_enter
                    }
                }),

            }
        }
    }


    const getListActiveStages = useMutation({
        mutationFn: async (data) => {
            const r = await apiProductionsOrders.apiActiveStages(data);
            return convertData(r)
        },
    })

    const onGetData = async (data) => {
        const formData = new FormData();

        formData.append("po_id", data?.id ?? "");
        formData.append("is_product", data?.is_product ?? "");
        formData.append("stage_id", data?.stage_id ?? "");

        const r = await getListActiveStages.mutateAsync(formData);

        return convertData(r)
    }

    return { onGetData, data: getListActiveStages.data, isLoading: getListActiveStages.isPending }
}