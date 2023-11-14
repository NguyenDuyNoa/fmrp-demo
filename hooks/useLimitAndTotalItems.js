import { useState } from "react";

export const useLimitAndTotalItems = (initialLimit = 15, initialTotalItems = {}) => {
    const [limit, sLimit] = useState(initialLimit);

    const [totalItems, sTotalItems] = useState(initialTotalItems);

    const updateLimit = (newLimit) => sLimit(newLimit);

    const updateTotalItems = (newTotalItems) => sTotalItems(newTotalItems);

    return { limit, totalItems, updateLimit, updateTotalItems };
};
