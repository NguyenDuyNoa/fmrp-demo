"use client";
import TooltipDefault from "@/components/common/tooltip/TooltipDefault";
import { useAnimation, motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Drawer } from "antd";
import { IoClose } from "react-icons/io5";
import { twMerge } from "tailwind-merge";
import { PiSparkleBold } from "react-icons/pi";
import { FaArrowUp } from "react-icons/fa6";
import { Input } from "antd";
import CheckIconMessenger from "@/components/icons/common/CheckIconMessenger";
import SendMessengerIcon from "@/components/icons/common/SendMessengerIcon";
import ErrorIconMessenger from "@/components/icons/common/ErrorIconMessenger";
import AvatarBotAI from "./AvatarBotAI";
import Messenger from "./Messenger";
import SelectAnswer from "./SelectAnswer";
import { useSettingApp } from "@/hooks/useAuth";
import { useStartMessageAI } from "@/managers/api/bot-AI/useMessageAI";
const { TextArea } = Input;

const DataAIAnswer = [
    {
        id: 1,
        type: "yes",
        content: "Có, tôi muốn quản lý bán thành phẩm!",
        icon: <CheckIconMessenger />,
    },
    {
        id: 2,
        type: "no",
        content: "Không, tạm thời tôi chưa cần đến.",
        icon: <ErrorIconMessenger />,
    },
];

const ToggleBotAI = () => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const [isLoadingGeneraAnswer, setIsLoadingGeneraAnswer] = useState(false);
    const [selectAnswer, setSelectAnswer] = useState("");
    const controls = useAnimation();
    const [value, setValue] = useState("");
    const drawerStyles = {
        mask: {
            backdropFilter: "blur(10px)",
        },
    };

    const { data: dataSetting, isLoading } = useSettingApp();
    const { data: dataNewChatAI, isLoadingNewChatAi } = useStartMessageAI({
        type: "PRODUCT_ANALYSIS",
        openAI: openDrawer,
    });
    console.log("🚀 ~ ToggleBotAI ~ dataNewChatAI:", dataNewChatAI);

    useEffect(() => {
        const interval = setInterval(() => {
            controls.start({
                rotate: [0, 5, -5, 5, -5, 0],
                transition: { duration: 1.2, ease: "easeInOut" },
            });
        }, 3000); // 2 giây

        return () => clearInterval(interval);
    }, [controls]);

    const handleSelectAnswer = ({ answer }) => {
        setIsLoadingGeneraAnswer(true);
        setTimeout(() => {
            setIsLoadingGeneraAnswer(false);
            setSelectAnswer(answer.content);
        }, 2000);
    };

    useEffect(() => { }, []);

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
            <Drawer
                title={
                    <div className="flex items-center justify-between gap-3 pt-3 pb-4 border-b border-[#919EAB] relative border-opacity-25 w-full">
                        <div className="flex items-center gap-3 ">
                            <AvatarBotAI />
                            <p className="text-xl font-semibold text-typo-blue-5 font-deca">
                                Trợ lý AI Fimo
                            </p>
                        </div>

                        <button
                            className="!bg-white p-1 rounded-full shadow hover:bg-gray-100"
                            onClick={() => setOpenDrawer(false)}
                        >
                            <IoClose />
                        </button>
                    </div>
                }
                placement="right"
                onClose={() => setOpenDrawer(false)}
                open={openDrawer}
                styles={drawerStyles}
                width={720}
                closable={false}
                className="!bg-opacity-90 !bg-[#ffffff]"
                headerStyle={{
                    background: "transparent",
                    borderBottom: "none",
                    padding: "12px 24px",
                }}
                footerStyle={{
                    background: "transparent",
                    borderTop: "none",
                    padding: "0px 0px",
                }}
                footer={
                    <div className="px-6 pb-6 pt-2">
                        <div className="rounded-xl p-5 bg-linear-background-chat space-y-3">
                            <div className="text-typo-blue-5 font-medium text-base flex flex-row items-center gap-x-2">
                                <PiSparkleBold />
                                <p className="text-typo-black-4 font-deca">
                                    Xây dựng nhà xưởng xịn hơn cùng Fimo
                                </p>
                            </div>
                            <div className="relative w-full">
                                <TextArea
                                    value={value}
                                    onChange={(e) => setValue(e?.target?.value)}
                                    placeholder="VD: Tàu hủ tươi 500g, Áo sơ mi tay dài size S,…"
                                    autoSize={{ minRows: 5, maxRows: 6 }}
                                    className="w-full placeholder:font-deca"
                                />
                                <div className="absolute bottom-2 right-2 w-fit z-10">
                                    <button
                                        className={twMerge(
                                            " rounded-lg p-[10px] text-lg transition-all duration-1000 ease-in-out",
                                            value
                                                ? "bg-linear-background-button-send text-white shadow-custom-inner-blue"
                                                : "bg-background-gray-4 text-typo-gray-6 shadow-none"
                                        )}
                                    >
                                        <FaArrowUp />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            >
                <div className="space-y-6 overflow-y-auto w-full h-full flex flex-col items-start justify-end pb-3">
                    <Messenger isMe={false}>
                        Xin chào An Nguyễn, mình là Fimo - Trợ lý AI tại FMRP. Bạn có muốn
                        Fimo phân tích sản phẩm của nhà xưởng mình chứ? Hãy cho Fimo biết
                        tên sản phẩm của bạn nhé!
                    </Messenger>
                    <Messenger isMe={true}>Áo sơ mi tay dài size L</Messenger>
                    {isLoadingGeneraAnswer && (
                        <Messenger isLoading={isLoadingGeneraAnswer} />
                    )}
                    {selectAnswer && <Messenger isMe={true}>{selectAnswer}</Messenger>}

                    {DataAIAnswer.map((answer, index) => (
                        <SelectAnswer
                            className={twMerge(
                                "group   hover:bg-background-gray-3  ",
                                answer.type === "yes"
                                    ? "hover:border-typo-green-3 hover:text-typo-green-3 "
                                    : "hover:border-typo-red-1 hover:text-typo-red-1"
                            )}
                            typeAnswer={answer.type}
                            onClick={() => handleSelectAnswer({ answer: answer })}
                            key={answer.id}
                        >
                            <div
                                className={twMerge(
                                    "flex items-center flex-row gap-x-2 text-[#141522] ",
                                    answer.type === "yes"
                                        ? "group-hover:text-typo-green-3"
                                        : "group-hover:text-typo-red-1"
                                )}
                            >
                                {answer.icon}
                                <p className="font-deca text-sm  font-normal">
                                    {answer.content}
                                </p>
                            </div>
                        </SelectAnswer>
                    ))}
                </div>
            </Drawer>
        </>
    );
};

export default ToggleBotAI;
