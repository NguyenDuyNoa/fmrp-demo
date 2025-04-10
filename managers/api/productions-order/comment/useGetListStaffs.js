import { keepPreviousData, useQuery } from "@tanstack/react-query";
import apiProductionsOrders from "@/Api/apiManufacture/manufacture/productionsOrders/apiProductionsOrders";
import { optionsQuery } from "@/configs/optionsQuery";

export const useGetListStaffs = ({
    limit = 500,
    enabled,
}) => {
    const fetchListStaffs = async ({ pageParam = 1 }) => {
        const { data } = await apiProductionsOrders.apiGetListStaffs({ limit: limit })

        console.log('data data data: ', data);


        return data.staffs
    };

    return useQuery({
        queryKey: ['apiGetListStaffs', limit],
        queryFn: fetchListStaffs,
        enabled: enabled,
        placeholderData: keepPreviousData,
        staleTime: 2 * 60 * 1000, // ← không refetch trong vòng 5 phút (tuỳ chọn)
        ...optionsQuery
    });
};
