import apiProductionsOrders from "@/Api/apiManufacture/manufacture/productionsOrders/apiProductionsOrders";
import { useMutation } from "@tanstack/react-query";
export const useLoadOutOfStock = () => {

    const getListLoadOutOfStock = useMutation({
        mutationFn: async (payload) => {
            const r = await apiProductionsOrders.apiLoadOutOfStock(payload);
            return r
        },
    })

    const onGetData = async (data) => {
        const formData = new FormData();

        formData.append("is_product", data?.object?.isProduct ?? "");

        // if (data?.object?.isProduct == 0) {
        formData.append("stage_id", data?.object?.activeStep?.item?.stage_id ?? "");
        formData.append("po_id", data?.object?.poId ?? "");
        formData.append("pp_id", data?.items[0]?.pp_id ?? "");

        // }
        console.log("data?.items", data?.object);
        const arrayMoveBom = data?.object?.arrayMoveBom || []
        if (arrayMoveBom.length > 0) {
            for (let index = 0; index < arrayMoveBom?.length; index++) {
                const item = arrayMoveBom[index];
                formData.append(`removeOutOfStock[]`, item?._id ?? "")
            }
        }
        // removeOutOfStock[] 

        for (let index = 0; index < data?.items?.length; index++) {
            const item = data.items[index];
            formData.append(`items[${index}][bom_id]`, item?.bom_id ?? "");
            formData.append(`items[${index}][poi_id]`, item?.poi_id ?? "");
            formData.append(`items[${index}][pp_id]`, item?.pp_id ?? "");
            formData.append(`items[${index}][parent_id]`, item?.parent_id ?? "");
            formData.append(`items[${index}][item_id]`, item?.item_id ?? "");
            formData.append(`items[${index}][item_code]`, item?.item_code ?? "");
            formData.append(`items[${index}][item_name]`, item?.item_name ?? "");
            formData.append(`items[${index}][reference_no_detail]`, item?.reference_no_detail ?? "");
            formData.append(`items[${index}][quantity]`, item?.quantityEnterClient ?? "");
            formData.append(`items[${index}][quantity_error]`, item?.quantityError ?? "");
            formData.append(`items[${index}][product_variation]`, item?.product_variation ?? "");
            formData.append(`items[${index}][pois_id]`, item?.pois_id ?? "");
            formData.append(`items[${index}][type]`, item?.type ?? "");
            formData.append(`items[${index}][number]`, item?.number ?? "");
            formData.append(`items[${index}][item_variation_id]`, item?.item_variation_id ?? "");
            formData.append(`items[${index}][unit_name]`, item?.unit_name ?? "");
            formData.append(`items[${index}][unit_id]`, item?.unit_id ?? "");
            formData.append(`items[${index}][image]`, item?.images ?? "");
        }

        const r = await getListLoadOutOfStock.mutateAsync(formData);

        const convertBom = r?.data?.boms?.map((e) => {
            return {
                ...e,
                list_warehouse_bom: e?.list_warehouse_bom?.map((i) => {
                    return {
                        ...i,
                        value: i?.id,
                        label: i?.name_warehouse
                    }
                }),
                warehouseId: []
            }
        })

        return {
            ...r,
            data: {
                ...r?.data,
                boms: convertBom,
                bomsClientHistory: convertBom
            }
        }
    }

    return { onGetData, data: getListLoadOutOfStock.data, isLoading: getListLoadOutOfStock.isPending }
}