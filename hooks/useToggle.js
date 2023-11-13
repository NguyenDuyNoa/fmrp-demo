import { useState } from "react";

export const useToggle = (initialValue = false) => {
    const [isOpen, sIsOpen] = useState(initialValue);

    const handleToggle = () => sIsOpen((prev) => !prev);

    const handleOpen = (e) => sIsOpen(e);

    return [isOpen, handleOpen, handleToggle];
};
