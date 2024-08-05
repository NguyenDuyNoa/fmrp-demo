import apiRecall from "@/Api/apiManufacture/warehouse/recall/apiRecall";
import { optionsQuery } from "@/configs/optionsQuery";
import { useQuery } from "@tanstack/react-query"

export const useRecallItems = (search, idBranch) => {
    return useQuery({
        queryKey: ["api_items_recall", search, idBranch],
        queryFn: async () => {
            const { data } = await apiRecall.apiItemsRecall(search ? "POST" : 'GET', {
                params: {
                    "filter[branch_id]": idBranch ? idBranch?.value : null,
                },
                data: {
                    term: search,
                },
            });
            return data?.result?.map((e) => ({
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
        },
        enabled: !!idBranch,
        ...optionsQuery
    })
}