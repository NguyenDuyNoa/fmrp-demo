"use client";

import React from "react";
import { motion } from "framer-motion";

// /icon/new/MagnifyingGlass

const KanbanIcon = ({
    size = 32,
    color = "currentColor",
    className = "",
    ...props
}) => {
    return (
        <svg
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            {...props}
        >
            <path
                d="M13.5 3H2.5C2.36739 3 2.24021 3.05268 2.14645 3.14645C2.05268 3.24021 2 3.36739 2 3.5V13C2 13.2652 2.10536 13.5196 2.29289 13.7071C2.48043 13.8946 2.73478 14 3 14H5.5C5.76522 14 6.01957 13.8946 6.20711 13.7071C6.39464 13.5196 6.5 13.2652 6.5 13V10H9.5V11C9.5 11.2652 9.60536 11.5196 9.79289 11.7071C9.98043 11.8946 10.2348 12 10.5 12H13C13.2652 12 13.5196 11.8946 13.7071 11.7071C13.8946 11.5196 14 11.2652 14 11V3.5C14 3.36739 13.9473 3.24021 13.8536 3.14645C13.7598 3.05268 13.6326 3 13.5 3ZM5.5 13H3V8H5.5V13ZM5.5 7H3V4H5.5V7ZM9.5 9H6.5V4H9.5V9ZM13 11H10.5V8H13V11ZM13 7H10.5V4H13V7Z"
                fill={color}
            />
        </svg>
    );
};

export default KanbanIcon;
