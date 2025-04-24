import SendMessengerIcon from "@/components/icons/common/SendMessengerIcon";
import React from "react";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

const SelectAnswer = ({ className, children, typeAnswer, onClick }) => {
    return (
        <div
            className={twMerge(
                "rounded-xl border border-[#919EAB] border-opacity-20 py-4 px-3 flex flex-row justify-between min-w-[370px] shadow-md cursor-pointer",
                className
            )}
            onClick={onClick}
        >
            {children}
            {/* <SendMessengerIcon /> */}
            <motion.div className="transform transition-transform duration-300 ease-in-out group-hover:translate-x-2">
                <SendMessengerIcon />
            </motion.div>
        </div>
    );
};

export default SelectAnswer;
