import { useState } from "react";

export const useChangeValue = (initialState) => {
    const [isValue, sIsValue] = useState(initialState);

    const onChangeValue = (key) => (event) => sIsValue((prev) => ({ ...prev, [key]: event }));

    return { isValue, onChangeValue };
};
