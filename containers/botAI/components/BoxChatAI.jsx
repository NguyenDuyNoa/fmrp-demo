"use client";
import React, { useEffect, useRef, useState } from "react";
import { Drawer } from "antd";
import { IoClose } from "react-icons/io5";
import { twMerge } from "tailwind-merge";
import { PiSparkleBold } from "react-icons/pi";
import { FaArrowUp } from "react-icons/fa6";
import { Input } from "antd";
import CheckIconMessenger from "@/components/icons/common/CheckIconMessenger";
import ErrorIconMessenger from "@/components/icons/common/ErrorIconMessenger";
import AvatarBotAI from "./AvatarBotAI";
import Messenger from "./Messenger";
import SelectAnswer from "./SelectAnswer";
import {
    fetchNewMessageAI,
    useStartMessageAI,
} from "@/managers/api/bot-AI/useMessageAI";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { PRODUCT_ANALYSIS } from "@/constants/TypeChatBot/typeChatBot";
import { handleDelay } from "@/utils/helpers/common";
const { TextArea } = Input;
import { AnimatePresence, motion, useAnimation } from "framer-motion";

const drawerStyles = {
    mask: {
        backdropFilter: "blur(10px)",
    },
};

const BoxChatAI = ({ openChatBox, setOpenChatBox }) => {
    const dispatch = useDispatch();
    const hasFetchedFirstMessage = useRef(false);
    const [isAnimationCompleted, setAnimationCompleted] = useState(false);
    const [isLoadingGeneraAnswer, setIsLoadingGeneraAnswer] = useState(false);
    const [optionSelectAnswer, setOptionSelectAnswer] = useState([]);
    const [selectAnswer, setSelectAnswer] = useState("");

    const [textUser, setTextUser] = useState("");
    const { data: dataNewChatAI, isLoadingNewChatAi } = useStartMessageAI({
        type: PRODUCT_ANALYSIS,
        enable: openChatBox && !hasFetchedFirstMessage.current,
    });

    const { messenger, options, chatScenariosId, sessionId, step, response } =
        useSelector((state) => state.stateBoxChatAi);

    const handleMessageUser = async () => {
        if (!textUser.trim()) return;
        const userText = textUser.trim();
        dispatch({
            type: "chatbot/addUserMessage",
            payload: userText,
        });
        setTextUser("");

        // 2. Gửi tin nhắn lên API và chờ phản hồi AI
        try {
            setIsLoadingGeneraAnswer(true);
            const res = await fetchNewMessageAI({
                type: PRODUCT_ANALYSIS, // hoặc truyền cố định nếu bạn cần
                nextStep: options.stepNext,
                sessionId: sessionId,
                message: userText,
                chatScenariosId: chatScenariosId,
                step: step,
                params: selectAnswer ?? null,
            });
            // console.log("🚀 ~ handleMessageUser ~ res :", res);

            const scenario = res?.chat_scenarios;
            if (scenario) {
                handleDelay({
                    delay: 3000,
                    setIsLoading: setIsLoadingGeneraAnswer,
                    actionFn: () => {
                        dispatch({
                            type: "chatbot/addAiMessageOnly",
                            payload: {
                                text: scenario.message,
                                hasResponse: scenario.response ? true : false,
                            },
                        });

                        dispatch({
                            type: "chatbot/updateScenarioMeta",
                            payload: {
                                chat_scenarios_id: scenario.chat_scenarios_id,
                                session_id: scenario.session_id,
                                step: scenario.step,
                                options: scenario.options,
                                response: scenario.response,
                            },
                        });
                    },
                });
            }
        } catch (err) {
            console.error("Lỗi khi gọi AI:", err);
            setIsLoadingGeneraAnswer(false);
        }
    };

    const handleSelectAnswer = (value) => {
        const findValueProductUser = messenger
            .slice()
            .reverse()
            .find((item, index) => item.sender === "user");
        const valueProduct = findValueProductUser?.text ?? 0;
        const { idSemiProduct, message } = value;
        setTextUser(message);
        setSelectAnswer({
            idSemiProduct,
            valueProduct,
        });
    };

    useEffect(() => {
        if (selectAnswer && textUser) {
            handleMessageUser();
        }
    }, [selectAnswer, textUser]);

    // Reset trạng thái khi messenger thay đổi
    useEffect(() => {
        setAnimationCompleted(false);
    }, [messenger]);

    useEffect(() => {
        if (options?.value) {
            const mapOptions = options?.value.map((item, index) => {
                return {
                    id: index,
                    value: item.value,
                    content: item.label,
                    icon:
                        item.value === 1 ? <CheckIconMessenger /> : <ErrorIconMessenger />,
                };
            });
            setOptionSelectAnswer(mapOptions);
        }
    }, [options?.value]);

    // fetch lời chào đầu tiên
    useEffect(() => {
        if (
            openChatBox &&
            !hasFetchedFirstMessage.current &&
            !isLoadingNewChatAi &&
            dataNewChatAI
        ) {
            hasFetchedFirstMessage.current = true;
            const scenario = dataNewChatAI.chat_scenarios;
            handleDelay({
                delay: 2000,
                setIsLoading: setIsLoadingGeneraAnswer,
                actionFn: () =>
                    dispatch({
                        type: "chatbot/addInitialBotMessage",
                        payload: {
                            message: scenario.message,
                            options: scenario.options,
                            chat_scenarios_id: scenario.chat_scenarios_id,
                            session_id: scenario.session_id,
                            step: scenario.step,
                        },
                    }),
            });
        }
    }, [openChatBox, dataNewChatAI, isLoadingNewChatAi, dispatch]);

    return (
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
                        onClick={() => setOpenChatBox(false)}
                    >
                        <IoClose />
                    </button>
                </div>
            }
            placement="right"
            onClose={() => setOpenChatBox(false)}
            open={openChatBox}
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
                                value={textUser}
                                onChange={(e) => setTextUser(e?.target?.value)}
                                placeholder="VD: Tàu hủ tươi 500g, Áo sơ mi tay dài size S,…"
                                autoSize={{ minRows: 5, maxRows: 6 }}
                                className="w-full placeholder:font-deca font-deca font-normal text-sm text-[#1C252E]"
                            />
                            <div className="absolute bottom-2 right-2 w-fit z-10">
                                <button
                                    className={twMerge(
                                        " rounded-lg p-[10px] text-lg transition-all duration-1000 ease-in-out",
                                        textUser
                                            ? "bg-linear-background-button-send text-white shadow-custom-inner-blue"
                                            : "bg-background-gray-4 text-typo-gray-6 shadow-none"
                                    )}
                                    onClick={() => handleMessageUser()}
                                >
                                    <FaArrowUp />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        >
            <div className="space-y-6 min-h-full  w-full flex flex-col items-start justify-end pb-3">
                <AnimatePresence mode="sync">
                    {messenger.map((msg, index) => (
                        <Messenger
                            key={index}
                            isMe={msg.sender === "user"}
                            isLoading={msg.isPending}
                            onAnimationComplete={() => {
                                if (
                                    index === messenger.length - 1 &&
                                    options?.type === "radio"
                                ) {
                                    setAnimationCompleted(true);
                                }
                            }}
                            ResponseAI={msg?.hasResponse ? response : null}
                        // hasResponseAI={msg?.hasResponse ? response : null}
                        >
                            {msg.text}
                        </Messenger>
                    ))}
                    {optionSelectAnswer.length > 0 &&
                        !isLoadingGeneraAnswer &&
                        isAnimationCompleted && (
                            <div className="flex flex-col gap-y-3">
                                {optionSelectAnswer.map((item, index) => {
                                    return (
                                        <SelectAnswer
                                            key={item.id}
                                            icon={item.icon}
                                            typeAnswer={item.value}
                                            onClick={(value) => handleSelectAnswer(value)}
                                        >
                                            {item.content}
                                        </SelectAnswer>
                                    );
                                })}
                            </div>
                        )}

                    {isLoadingGeneraAnswer && <Messenger isLoading={true} />}
                </AnimatePresence>
            </div>
        </Drawer>
    );
};

export default BoxChatAI;
