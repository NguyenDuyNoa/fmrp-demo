"use client";
import TooltipDefault from "@/components/common/tooltip/TooltipDefault";
import { useAnimation, motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {  Drawer,  } from "antd";
import { IoClose } from "react-icons/io5";
import { twMerge } from "tailwind-merge";
import { PiSparkleBold } from "react-icons/pi";
import { FaArrowUp } from "react-icons/fa6";
import { Input } from "antd";
import CheckIconMessenger from "@/components/icons/common/CheckIconMessenger";
import SendMessengerIcon from "@/components/icons/common/SendMessengerIcon";
import ErrorIconMessenger from "@/components/icons/common/ErrorIconMessenger";
const { TextArea } = Input;

const SelectAnswer = ({ className, children }) => {
    return (
        <div
            className={twMerge(
                "rounded-xl border border-[#919EAB] border-opacity-20 py-4 px-3 flex flex-row justify-between min-w-[370px]",
                className
            )}
        >
            {children}
            <div className="text-[#25387A]">
                <SendMessengerIcon />
            </div>
        </div>
    );
};

const AvatarBotAI = ({ className, classNameDot }) => {
    return (
        <div className="relative w-fit">
            <div
                className={twMerge(
                    "relative size-12 aspect-1 rounded-full bg-white shrink-0 overflow-hidden",
                    className
                )}
            >
                <Image
                    src="/bot-ai/bot.png"
                    alt="Fimo"
                    width={80}
                    height={80}
                    className="size-full object-cover"
                // quality={100}
                />
            </div>
            <div
                className={twMerge(
                    "bg-[#22C55E] w-[10px] h-[10px] border border-white rounded-full absolute bottom-[1px] right-[1px] z-10 ",
                    classNameDot
                )}
            />
        </div>
    );
};

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

const Messenger = ({
    className,
    children,
    isMe = false,
    isLoading = false,
}) => {
    return (
        <div
            className={twMerge(
                "flex items-start gap-2 w-full flex-row ",
                isMe ? "justify-end" : "justify-start"
            )}
        >
            {!isMe && (
                <AvatarBotAI
                    className="size-6"
                    classNameDot="w-[8px] h-[8px] bottom-0 right-0"
                />
            )}

            <div
                className={twMerge(
                    "max-w-[80%] flex flex-col gap-y-1 justify-start",
                    className
                )}
            >
                {!isMe && (
                    <div className="flex flex-row items-center gap-x-[6px]">
                        <span className="font-semibold font-deca text-typo-black-5 text-sm">
                            Fimo
                        </span>
                        <div className="h-[10px] w-[1px] bg-[#E5E5EA]" />
                        <span className="text-sm font-deca font-normal text-typo-gray-7">
                            Trợ lý AI
                        </span>
                    </div>
                )}
                <div
                    className={twMerge(
                        "p-3 font-deca text-base font-normal w-fit",
                        isMe
                            ? "rounded-l-xl rounded-br-xl bg-[#0375F3] text-white"
                            : "text-typo-black-4  bg-[#F2F2F7] border-2 rounded-r-xl rounded-bl-xl border-[#919EAB] border-opacity-20"
                    )}
                >
                    {isLoading ? <LoadingThreeDotsJumping /> : <p>{children}</p>}
                </div>
            </div>
        </div>
    );
};

const ToggleBotAI = () => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const controls = useAnimation();
    const [value, setValue] = useState("");
    const drawerStyles = {
        mask: {
            backdropFilter: "blur(10px)",
        },
    };

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
        <>
            <div
                className="size-20 aspect-1  relative "
                onClick={() => setOpenDrawer(true)}
            >
                <TooltipDefault
                    id="bot-ai"
                    content="Trợ lý AI Fimo"
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
                                            " rounded-lg p-[10px] text-lg transition-all duration-500 ease-in-out",
                                            value
                                                ? "bg-linear-background-button-send text-white shadow-custom-inner-blue"
                                                : "bg-background-gray-4 text-typo-gray-6"
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
                <div className="space-y-6 overflow-y-auto w-full h-full flex flex-col items-start justify-end">
                    <Messenger isMe={false}>
                        Xin chào <b>An Nguyễn</b>, mình là Fimo - Trợ lý AI tại FMRP. Bạn có
                        muốn Fimo phân tích sản phẩm của nhà xưởng mình chứ? Hãy cho Fimo
                        biết tên sản phẩm của bạn nhé!
                    </Messenger>
                    <Messenger isMe={true}>Áo sơ mi tay dài size L</Messenger>
                    <Messenger isLoading={true} />
                    <SelectAnswer>
                        <div className="flex items-center flex-row gap-x-2">
                            <CheckIconMessenger />{" "}
                            <p className="font-deca text-sm text-[#141522] font-normal">
                                Có, tôi muốn quản lý bán thành phẩm!
                            </p>
                        </div>
                    </SelectAnswer>
                    <SelectAnswer>
                        <div className="flex items-center flex-row gap-x-2">
                            <ErrorIconMessenger />{" "}
                            <p className="font-deca text-sm text-[#141522] font-normal">
                                Không, tạm thời tôi chưa cần đến.
                            </p>
                        </div>
                    </SelectAnswer>
                </div>
            </Drawer>
        </>
    );
};

export default ToggleBotAI;
