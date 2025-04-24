import React from "react";
import { motion } from "framer-motion";
const LoadingThreeDotsJumping = () => {
    const dotVariants = {
        jump: {
            y: -5,
            transition: {
                duration: 0.8,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
            },
        },
    };

    return (
        <motion.div
            animate="jump"
            transition={{ staggerChildren: -0.2, staggerDirection: -1 }}
            className="flex justify-center gap-x-[2px] w-fit"
        >
            <motion.div
                className="size-1 rounded-full will-change-transform bg-[#919EAB]"
                variants={dotVariants}
            />
            <motion.div
                className="size-1 rounded-full will-change-transform bg-[#637381]"
                variants={dotVariants}
            />
            <motion.div
                className="size-1 rounded-full will-change-transform bg-[#1C252E]"
                variants={dotVariants}
            />
            {/* <StyleSheet /> */}
        </motion.div>
    );
};
export default LoadingThreeDotsJumping;
