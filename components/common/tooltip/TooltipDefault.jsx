"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
const TooltipDefault = ({ children, content, position = "top" }) => {
    const [isHovered, setIsHovered] = useState(false);
    const tooltipPosition = {
        top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
        bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
        left: 'right-full mr-2 top-1/2 -translate-y-1/2',
        right: 'left-full ml-2 top-1/2 -translate-y-1/2',
    };

    const arrowPosition = {
        top: 'top-full left-1/2 -translate-x-1/2',
        bottom: 'bottom-full left-1/2 -translate-x-1/2',
        left: 'right-full top-1/2 -translate-y-1/2',
        right: 'left-full top-1/2 -translate-y-1/2',
    };
    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(true)}
        >
            {children}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className={twMerge(
                            'absolute z-50 px-3 py-1.5  text-sm font-medium text-white bg-black rounded-lg shadow-lg whitespace-nowrap',
                            tooltipPosition[position]
                        )}
                    >
                        {content}
                        <div className={twMerge('absolute w-2 h-2 bg-black rotate-45', arrowPosition[position])} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TooltipDefault;
