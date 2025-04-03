import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import apiProductionsOrders from "@/Api/apiManufacture/manufacture/productionsOrders/apiProductionsOrders";
import { optionsQuery } from "@/configs/optionsQuery";

export const useMaterialOutput = ({
    isSearch = "",
    poiId,
    enabled,
    idTabSheet
}) => {
    const fetchMaterialOutput = async () => {
        const { data } = await apiProductionsOrders.apiExportSituation(poiId)

        return data.boms
    };

    return useQuery({
        queryKey: ['apiExportSituation', poiId, isSearch, idTabSheet],
        queryFn: fetchMaterialOutput,
        enabled: enabled,
        placeholderData: keepPreviousData,
        ...optionsQuery
    });
};
