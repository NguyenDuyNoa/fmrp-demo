"use client";
import { motion } from "framer-motion";
import React from "react";
const AnimatedGeneraText = ({
    heroPerTitle,
    className,
    delay = 0,
    style,
    children,
}) => {
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

    const wrapWords = (node, keyPrefix = "") => {
        if (typeof node === "string") {
            return node.split(" ").map((word, i) => (
                <motion.span key={`${keyPrefix}-${i}`} variants={child}>
                    {word}{" "}
                </motion.span>
            ));
        }

        if (React.isValidElement(node)) {
            const children = React.Children.map(node.props.children, (child, i) =>
                wrapWords(child, `${keyPrefix}-${i}`)
            );
            return React.cloneElement(node, { key: keyPrefix }, children);
        }

        return null;
    };

    return (
        <motion.span
            className={className}
            variants={container}
            initial="hidden"
            animate="visible"
            style={{ ...style }}
        >
            {React.Children.map(children, (child, i) =>
                wrapWords(child, `text-${i}`)
            )}
        </motion.span>
    );
};

export default AnimatedGeneraText;
