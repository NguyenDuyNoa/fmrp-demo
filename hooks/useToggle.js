import { useState } from "react";

export const useToggle = (initialValue = false) => {
    const [isOpen, sIsOpen] = useState(initialValue);
    const [isId, sIsId] = useState(null);
    const [isIdChild, sIsIdChild] = useState(null);

    const handleToggle = () => sIsOpen((prev) => !prev);

    const handleOpen = (e) => sIsOpen(e);

    const handleQueryId = ({ id, status, idChild }) => {
        sIsId(id);
        sIsIdChild(idChild);
        sIsOpen(status);
    };

    return { isOpen, isId, isIdChild, handleOpen, handleToggle, handleQueryId };
};
