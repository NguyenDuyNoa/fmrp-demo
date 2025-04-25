"use client";
import TooltipDefault from "@/components/common/tooltip/TooltipDefault";
import { useAnimation, motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSettingApp } from "@/hooks/useAuth";
import BoxChatAI from "./BoxChatAI";

const ToggleBotAI = () => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const controls = useAnimation();
    const { data: dataSetting, isLoading } = useSettingApp();

    //xử lý toggle animation
    useEffect(() => {
        const interval = setInterval(() => {
            controls.start({
                rotate: [0, 5, -5, 5, -5, 0],
                transition: { duration: 1.2, ease: "easeInOut" },
            });
        }, 3000); // 2 giây

        return () => clearInterval(interval);
    }, [controls]);

    return (
        <>
            <div
                className="size-20 aspect-1  relative "
                onClick={() => setOpenDrawer(true)}
            >
                <TooltipDefault
                    id="bot-ai"
                    content={dataSetting?.assistant_fmrp || "Trợ lý AI Fimo"}
                    place="top-end"
                    delayHide={0}
                    autoOpen={true}
                >
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
            <BoxChatAI openChatBox={openDrawer} setOpenChatBox={setOpenDrawer} />
        </>
    );
};

export default ToggleBotAI;
