"use client";
import { motion } from "framer-motion";
import React, { useEffect } from "react";
const AnimatedGeneraText = ({
    heroPerTitle,
    className,
    delay = 0,
    style,
    children,
    onAnimationComplete,
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
    const words = [];

    const wrapWords = (node) => {
        if (typeof node === "string") {
            node.split(" ").forEach((word) => words.push(word));
        } else if (React.isValidElement(node)) {
            React.Children.forEach(node.props.children, wrapWords);
        }
    };
    wrapWords(children);

    //xử lý thời gian hiện phần tử tiếp sau khi animation hoàn thành 
    useEffect(() => {
        // Tính toán thời gian chủ động animation
        const totalAnimationTime = delay + words.length * 0.05 + 0.5; // thêm 0.5 giây buffer
        const timer = setTimeout(() => {
            onAnimationComplete && onAnimationComplete();
        }, totalAnimationTime * 1000); // đổi thành milliseconds

        return () => clearTimeout(timer);
    }, [words.length, delay, onAnimationComplete]);

    const renderWords = (node, keyPrefix = "") => {
        if (typeof node === "string") {
            return node.split(" ").map((word, i) => (
                <motion.span key={`${keyPrefix}-${i}`} variants={child}>
                    {word}{" "}
                </motion.span>
            ));
        }

        if (React.isValidElement(node)) {
            const children = React.Children.map(node.props.children, (child, i) =>
                renderWords(child, `${keyPrefix}-${i}`)
            );
            return React.cloneElement(node, { key: keyPrefix }, children);
        }

        return null;
    };

    // const wrapWords = (node, keyPrefix = "") => {
    //     if (typeof node === "string") {
    //         return node.split(" ").map((word, i) => (
    //             <motion.span key={`${keyPrefix}-${i}`} variants={child}>
    //                 {word}{" "}
    //             </motion.span>
    //         ));
    //     }

    //     if (React.isValidElement(node)) {
    //         const children = React.Children.map(node.props.children, (child, i) =>
    //             wrapWords(child, `${keyPrefix}-${i}`)
    //         );
    //         return React.cloneElement(node, { key: keyPrefix }, children);
    //     }

    //     return null;
    // };

    return (
        <motion.span
            className={className}
            variants={container}
            initial="hidden"
            animate="visible"
            style={{ ...style }}
            onAnimationComplete={onAnimationComplete}
        >
            {React.Children.map(children, (child, i) =>
                renderWords(child, `text-${i}`)
            )}
        </motion.span>
    );
};
{
    /* wrapWords(child, `text-${i}`) */
}
export default AnimatedGeneraText;
