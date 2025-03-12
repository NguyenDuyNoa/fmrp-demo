import apiRecall from "@/Api/apiManufacture/warehouse/recall/apiRecall";
import { optionsQuery } from "@/configs/optionsQuery";
import { useQuery } from "@tanstack/react-query"

export const useRecallItems = (search, idBranch, idProductionOrder) => {
    return useQuery({
        queryKey: ["api_items_recall", search, idProductionOrder],
        queryFn: async () => {
            const converArray = (array) => {
                return array?.map((e) => ({
                    label: `${e.name}
                            <span style={{display: none}}>${e.code}</span>
                            <span style={{display: none}}>${e.product_variation} </span>
                            <span style={{display: none}}>${e.serial} </span>
                            <span style={{display: none}}>${e.lot} </span>
                            <span style={{display: none}}>${e.expiration_date} </span>
                            <span style={{display: none}}>${e.text_type} ${e.unit_name} </span>`,
                    value: e.id,
                    e,
                })) || []
            }
            const { data } = await apiRecall.apiItemsByProductionOrder({
                params: {
                    poi_id: idProductionOrder?.value,
                    search
                }
            });
            return converArray(data?.result)
            // if (idProductionOrder) {
            //     const { data } = await apiRecall.apiItemsByProductionOrder({
            //         params: {
            //             poi_id: idProductionOrder?.value,
            //             search
            //         }
            //     });
            //     return converArray(data?.result)

            // } else {
            //     const { data } = await apiRecall.apiItemsRecall(search ? "POST" : 'GET', {
            //         params: {
            //             "filter[branch_id]": idBranch ? idBranch?.value : null,
            //         },
            //         data: {
            //             term: search,
            //         },
            //     });
            //     return converArray(data?.result)
            // }

        },
        enabled: !!idBranch && !!idProductionOrder,
        ...optionsQuery
    })
}