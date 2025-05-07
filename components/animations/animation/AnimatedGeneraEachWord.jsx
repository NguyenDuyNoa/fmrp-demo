import React, { useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";
import LoadingThreeDotsJumping from "@/containers/botAI/components/LoadingThreeDotsJumping";

const AnimatedGeneraEachWord = ({
    className = "",
    delay = 0,
    style = {},
    children,
    classNameWrapper = "",
}) => {
    const fullText = Array.isArray(children) ? children.join(" ") : `${children}`;
    const words = fullText.split(" ");
    const [visibleCount, setVisibleCount] = useState(0);
    const [showDots, setShowDots] = useState(true);
    // const wordVariant = {
    //     hidden: { opacity: 0, x: 20 },
    //     visible: {
    //         opacity: 1,
    //         x: 0,
    //         transition: { duration: 0.5, ease: "easeOut" },
    //     },
    // };
    // const wordVariant = {
    //     hidden: { opacity: 0, x: 20 },
    //     visible: (i) => ({
    //         opacity: 1,
    //         x: 0,
    //         transition: {
    //             duration: 0.4,
    //             ease: "easeOut",
    //             delay: i * 0.1, // từng chữ cách nhau 0.1s
    //         },
    //     }),
    // };
    useEffect(() => {
        const timeout = setTimeout(() => {
            const interval = setInterval(() => {
                setVisibleCount((prev) => {
                    const next = prev + 1;
                    if (next >= words.length) {
                        clearInterval(interval);
                        setShowDots(false);
                    }
                    return next;
                });
            }, 400);
        }, delay * 1000);

        return () => clearTimeout(timeout);
    }, [words, delay]);

    const visibleWords = words.slice(0, visibleCount);

    return (
        <div
            className={twMerge(
                "relative inline-flex items-center whitespace-nowrap",
                classNameWrapper
            )}
            style={style}
        >
            <div
                // initial={{ width: 0 }}
                // animate={{ width: `${(visibleCount / words.length) * 100}%` }}
                // transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute inset-0 bg-transparent z-0 rounded-l-xl rounded-tr-xl w-fit"
            />
            <h2
                className={twMerge(
                    "relative z-10 inline-flex flex-row justify-end whitespace-nowrap gap-x-[6px] items-end font-deca text-xs font-normal w-fit",
                    className
                )}
            >
                {visibleWords.map((word, i) => (
                    <motion.span
                        key={`${word}-${i}`}
                    // variants={wordVariant}
                    // initial="hidden"
                    // animate="visible"
                    // custom={i}
                    >
                        {word}
                    </motion.span>
                ))}

                {showDots && (
                    <motion.div
                        className="inline-block"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 1.2 }}
                    >
                        <LoadingThreeDotsJumping
                            classNameDot1="bg-[#54E79E]"
                            classNameDot2="bg-[#21B972]"
                            classNameDot3="bg-[#027A48]"
                        />
                    </motion.div>
                )}
            </h2>
        </div>
    );
};

export default AnimatedGeneraEachWord;
