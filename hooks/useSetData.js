import { useState } from "react";

export const useSetData = (initialData) => {
    const [isData, sIsData] = useState(initialData);

    const updateData = (newData) => sIsData((prev) => ({ ...prev, ...newData }));

    return { isData, updateData };
};
