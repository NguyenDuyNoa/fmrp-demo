import { useState } from "react";

export const useToggle = (initialValue = false) => {
    const [isOpen, sIsOpen] = useState(initialValue);
    const [isId, sIsId] = useState(null);

    const handleToggle = () => sIsOpen((prev) => !prev);

    const handleOpen = (e) => sIsOpen(e);

    const handleQueryId = ({ id, status }) => {
        sIsId(id);
        sIsOpen(status);
    };

    return { isOpen, isId, handleOpen, handleToggle, handleQueryId };
};
