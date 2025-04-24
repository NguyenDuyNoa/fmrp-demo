"use client";

import { motion } from "framer-motion";
import React from "react";

const AnimatedGeneraText = ({ heroPerTitle, className, delay = 0, style }) => {
    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: delay,
            },
        },
    };

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 15,
                stiffness: 20,
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
            transition: {
                type: "spring",
                damping: 15,
                stiffness: 20,
            },
        },
    };

    return (
        <motion.span
            className={className}
            variants={container}
            initial="hidden"
            animate="visible"
            style={{ ...style }}
        >
            {heroPerTitle.map((e) => (
                <motion.span key={e.id.toString()} variants={child}>
                    {e.letter}{" "}
                </motion.span>
            ))}
        </motion.span>
    );
};

export default AnimatedGeneraText;
