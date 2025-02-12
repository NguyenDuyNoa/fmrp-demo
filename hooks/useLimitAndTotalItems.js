import { useState } from "react";
import useSetingServer from "./useConfigNumber";

export const useLimitAndTotalItems = (initialLimit = 15, initialTotalItems = {}) => {
    const dataSeting = useSetingServer()

    const [limit, sLimit] = useState(dataSeting?.tables_pagination_limit);

    const [totalItems, sTotalItems] = useState(initialTotalItems);

    const updateLimit = (newLimit) => sLimit(newLimit);

    const updateTotalItems = (newTotalItems) => sTotalItems(newTotalItems);

    return { limit, totalItems, updateLimit, updateTotalItems };
};
