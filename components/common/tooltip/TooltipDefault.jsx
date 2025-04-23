"use client";
import React, { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { twMerge } from "tailwind-merge";

const TooltipDefault = ({
    id,
    children,
    content,
    place = "top",
    className,
    delayHide = 0,
    autoOpen = false,
}) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!autoOpen) return;

        const toggleTooltip = () => {
            setIsVisible(true);
            setTimeout(() => setIsVisible(false), 2000); // ẩn sau 3s
        };

        toggleTooltip(); // chạy lần đầu

        const interval = setInterval(toggleTooltip, 10000); // lặp lại mỗi 5s

        return () => clearInterval(interval);
    }, [autoOpen]);

    return (
        <>
            <a data-tooltip-id={id} data-tooltip-content={content}>
                {children}
            </a>
            <Tooltip
                id={id}
                place={place}
                isOpen={autoOpen ? isVisible : undefined}
                className={twMerge(
                    "!z-[9999] !bg-black !text-white !text-[13px] !font-medium !px-4 !py-2 !rounded-lg  after:!bg-black !opacity-100",
                    className
                )}
                render={({ content }) => <div className="relative">{content}</div>}
                classNameArrow="!rounded-[2px]"
                delayHide={delayHide}
            />
        </>
    );
};

export default TooltipDefault;
