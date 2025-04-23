"use client";
import TooltipDefault from "@/components/common/tooltip/TooltipDefault";
import { useAnimation, motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect } from "react";

const ToggleBotAI = () => {
    const controls = useAnimation();

    useEffect(() => {
        const interval = setInterval(() => {
            controls.start({
                rotate: [0, 5, -5, 5, -5, 0],
                transition: { duration: 1.2, ease: "easeInOut" },
            });
        }, 2000); // 2 giây

        return () => clearInterval(interval);
    }, [controls]);

    return (
        <div className="size-20 aspect-1  relative ">
            <TooltipDefault id="bot-ai" content="Trợ lý AI Fimo" place="top-end" delayHide={0}>
                <motion.div
                    className="size-20 rounded-full bg-white shadow-custom-blue"
                    animate={controls}
                >
                    <Image
                        alt="bot"
                        src="/bot-ai/bot.png"
                        width={900}
                        height={680}
                        className="size-20 bg-transparent rounded-full"
                        quality={100}
                        loading="eager"
                    />
                </motion.div>
                <div className="bg-[#22C55E] w-[10px] h-[10px] border border-red-50 rounded-full absolute bottom-[2px] right-[11px] z-10 " />
            </TooltipDefault>
        </div>
    );
};

export default ToggleBotAI;
