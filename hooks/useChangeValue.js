import { useState } from "react";

export const useChangeValue = (initialValue) => {
    const [isValue, sIsValue] = useState(initialValue);

    const onChangeValue = (key) => (event) => sIsValue((prev) => ({ ...prev, [key]: event }));

    return { isValue, onChangeValue };
};
