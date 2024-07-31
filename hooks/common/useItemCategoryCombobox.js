import apiCategory from "@/Api/apiMaterial/category/apiCategory";
import { reTryQuery } from "@/configs/configRetryQuery";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

// danh sánh danh mục nvl
export const useItemCategoryCombobox = () => {
    const dispatch = useDispatch();
    return useQuery({
        queryKey: ["api_category_option_combobox"],
        queryFn: async () => {

            const { rResult } = await apiCategory.apiCategoryOptionCategory({});

            const newData = rResult.map((x) => ({
                label: `${x.name + " " + "(" + x.code + ")"}`,
                value: x.id,
                level: x.level,
                code: x.code,
                parent_id: x.parent_id,
            })) || []

            dispatch({
                type: "categoty_finishedProduct/update",
                payload: newData
            });

            return newData
        },
        ...reTryQuery
    })
}