import apiProductionsOrders from "@/Api/apiManufacture/manufacture/productionsOrders/apiProductionsOrders";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useLoadOutOfStock = () => {
    const convertData = (data) => {
        return {
            ...data,
            data: {
                ...data?.data,
                items: data?.data?.items.map((e) => {
                    return {
                        ...e,
                        quantityError: 0
                    }
                }),

            }
        }
    }


    const getListLoadOutOfStock = useMutation({
        mutationFn: async (payload) => {
            const r = await apiProductionsOrders.apiLoadOutOfStock(payload);
            return r
        },
    })

    const onGetData = async (data) => {
        const formData = new FormData();

        formData.append("is_product", data?.is_product ?? "");

        for (let index = 0; index < data?.items?.length; index++) {
            const item = data.items[index];
            formData.append(`items[${index}][bom_id]`, item?.bom_id ?? "");
            formData.append(`items[${index}][poi_id]`, item?.poi_id ?? "");
            formData.append(`items[${index}][parent_id]`, item?.parent_id ?? "");
            formData.append(`items[${index}][item_id]`, item?.item_id ?? "");
            formData.append(`items[${index}][item_code]`, item?.item_code ?? "");
            formData.append(`items[${index}][item_name]`, item?.item_name ?? "");
            formData.append(`items[${index}][reference_no_detail]`, item?.reference_no_detail ?? "");
            formData.append(`items[${index}][quantity]`, item?.quantity ?? "");
            formData.append(`items[${index}][quantity_error]`, item?.quantityError ?? "");
            formData.append(`items[${index}][product_variation]`, item?.product_variation ?? "");
            formData.append(`items[${index}][pois_id]`, item?.pois_id ?? "");
            formData.append(`items[${index}][type]`, item?.type ?? "");
            formData.append(`items[${index}][number]`, item?.number ?? "");
            formData.append(`items[${index}][item_variation_id]`, item?.item_variation_id ?? "");
        }

        const r = await getListLoadOutOfStock.mutateAsync(formData);

        return r
    }

    return { onGetData, data: getListLoadOutOfStock.data, isLoading: getListLoadOutOfStock.isPending }
}