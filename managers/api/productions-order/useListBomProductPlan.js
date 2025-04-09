import apiProductionPlan from "@/Api/apiManufacture/manufacture/productionPlan/apiProductionPlan";
import { useQueries, useQuery } from "@tanstack/react-query";

export const useListBomProductPlan = ({ id }) => {
    const fetchListBomProductPlan = async () => {
        try {
            const response = await apiProductionPlan.apiListBom(id);

            return response;
        } catch (error) {
            throw new Error(error);
        }
    };

    return useQuery({
        queryKey: ["apiListBomProductPlan", id],
        queryFn: fetchListBomProductPlan,
        enabled: !!id
    });
};
