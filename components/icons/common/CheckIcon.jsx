"use client";

import React from "react";
import { motion } from "framer-motion";

const CheckIcon = ({
    size = 32,
    color = "currentColor",
    className = "",
}) => {
    return (
        <svg fill="#000000"
            viewBox="0 -8 72 72"
            id="Layer_1"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                fill={color}
                d="M61.07,12.9,57,8.84a2.93,2.93,0,0,0-4.21,0L28.91,32.73,19.2,23A3,3,0,0,0,15,23l-4.06,4.07a2.93,2.93,0,0,0,0,4.21L26.81,47.16a2.84,2.84,0,0,0,2.1.89A2.87,2.87,0,0,0,31,47.16l30.05-30a2.93,2.93,0,0,0,0-4.21Z" />
        </svg>
    );
};

export default CheckIcon;
