"use client";
import React from "react";
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
}) => {
    return (
        <>
            <a
                data-tooltip-id={id}
                data-tooltip-content={content}
            >
                {children}
            </a>
            <Tooltip
                id={id}
                place={place}
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
