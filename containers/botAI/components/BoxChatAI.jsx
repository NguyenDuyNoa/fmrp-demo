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
    completeStepChatBot,
    fetchNewMessageAI,
    fetchStartMessageAI,
    useStartMessageAI,
} from "@/managers/api/bot-AI/useMessageAI";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { PRODUCT_ANALYSIS } from "@/constants/TypeChatBot/typeChatBot";
import { handleDelay } from "@/utils/helpers/common";
const { TextArea } = Input;
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import LoadingDataChatBot from "@/components/icons/common/LoadingDataChatBot";
import ResultChatBot from "./ResultChatBot";
import { useRouter } from "next/router";

const drawerStyles = {
    mask: {
        backdropFilter: "blur(10px)",
    },
};

const BoxChatAI = ({ openChatBox, setOpenChatBox }) => {
    const endRef = useRef(null);
    const router = useRouter();
    const dispatch = useDispatch();
    const hasFetchedFirstMessage = useRef(false);
    const [isAnimationCompleted, setAnimationCompleted] = useState(false);
    console.log("🚀 ~ BoxChatAI ~ isAnimationCompleted:", isAnimationCompleted);
    const [isLoadingGeneraAnswer, setIsLoadingGeneraAnswer] = useState(false);
    const [optionSelectAnswer, setOptionSelectAnswer] = useState([]);
    const [resultDataChatBot, setResultDataChatBot] = useState(false);
    const [textUser, setTextUser] = useState("");
    const [productAnalysis, setProductAnalysis] = useState({});
    const [isLastMessageAnimationDone, setIsLastMessageAnimationDone] =
        useState(false);
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

        // ✅ Nếu yêu cầu chọn option và user cố gõ tay => chặn & cảnh báo
        if (options.required && options.type === "radio") {
            dispatch({
                type: "chatbot/addAiMessageOnly",
                payload: {
                    text: "Vui lòng chọn một trong các lựa chọn bên dưới để tiếp tục.",
                    hasResponse: false,
                },
            });
            setTextUser("");
            return;
        }

        // ✅ Nếu yêu cầu chọn option và user cố gõ tay => chặn & cảnh báo
        if (options.isFinished) {
            dispatch({
                type: "chatbot/addAiMessageOnly",
                payload: {
                    text: "Vui lòng đợi AI khởi tạo dữ liệu",
                    hasResponse: false,
                },
            });
            setTextUser("");
            return;
        }

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
            });

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

    const handleSelectAnswer = async (value) => {
        const findValueProductUser = messenger
            .slice()
            .reverse()
            .find((item, index) => item.sender === "user");
        const valueProduct = findValueProductUser?.text ?? 0;
        const { idSemiProduct, message, stepNext } = value;

        dispatch({
            type: "chatbot/addUserMessage",
            payload: message,
        });

        let dynamicParams = null;

        if (step === "2") {
            dynamicParams = {
                [options.keyValue]: idSemiProduct,
                value_product: valueProduct,
            };
        }

        if (step === "3") {
            dynamicParams = {
                [options.keyValue]: idSemiProduct,
            };
        }
        // 2. Gửi tin nhắn lên API và chờ phản hồi AI
        try {
            setIsLoadingGeneraAnswer(true);
            const res = await fetchNewMessageAI({
                type: PRODUCT_ANALYSIS, // hoặc truyền cố định nếu bạn cần
                nextStep: stepNext ? stepNext : options.stepNext,
                sessionId: sessionId,
                message: message,
                chatScenariosId: chatScenariosId,
                step: step === "3" ? "4" : step,
                params: dynamicParams,
            });

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

    const onRedirect = () => {
        setOpenChatBox(false);
        router.push("/products");
    };

    const onRetry = async () => {
        setResultDataChatBot(false);
        setTextUser("");
        setOptionSelectAnswer([]);
        setAnimationCompleted(false);
        setProductAnalysis({});

        // Reset Redux chatbot
        dispatch({ type: "chatbot/reset" });

        // Bắt đầu lại lời chào như lúc mở chat box
        try {
            const res = await fetchStartMessageAI(PRODUCT_ANALYSIS); // gọi API giống hook
            const scenario = res?.chat_scenarios;

            if (scenario) {
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
        } catch (err) {
            console.error("Lỗi khi khởi tạo lại đoạn chat mới:", err);
        }
    };

    // Reset trạng thái khi messenger thay đổi
    useEffect(() => {
        setAnimationCompleted(false);
        setIsLastMessageAnimationDone(false);
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
                    stepNext: item?.step_next ?? null,
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

    useEffect(() => {
        const handleCompleteStep = async () => {
            if (options?.isFinished) {
                setResultDataChatBot(false);
                try {
                    const payload = {
                        data: {
                            stages: response.stages,
                            materials_primary: response.materialsPrimary,
                            semi_products: response.semiProducts,
                            product: response.product,
                        },
                        api: options.api,
                    };
                    const res = await completeStepChatBot(payload);

                    if (res) {
                        setProductAnalysis(res);
                        setTimeout(() => {
                            dispatch({ type: "chatbot/reset" });
                            setResultDataChatBot(true);
                        }, 10000);
                    }
                } catch (err) {
                    setResultDataChatBot(false);
                    console.error("Lỗi khi gọi completeStepChatBot:", err);
                }
            }
        };

        handleCompleteStep();
    }, [options?.isFinished]);

    useEffect(() => {
        const lastMessage = messenger[messenger.length - 1];
        if (lastMessage?.sender === "user" && endRef.current) {
            endRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messenger]);

    //scroll tới vị trí loading
    useEffect(() => {
        if (endRef.current) {
            endRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messenger, isLoadingGeneraAnswer]);

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
            width={820}
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
                            <p className="text-typo-black-4 font-deca text-base">
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
                            // disabled={options.required && options.type === "radio"}
                            />
                            <div className="absolute bottom-2 right-2 w-fit z-10">
                                <button
                                    // disabled={options.required && options.type === "radio"}
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
            <div
                className={twMerge(
                    "space-y-6 min-h-full  w-full flex flex-col items-start",
                    resultDataChatBot ? " justify-center" : "justify-end"
                )}
            >
                <AnimatePresence mode="sync">
                    {messenger.map((msg, index) => (
                        <Messenger
                            key={index}
                            isMe={msg.sender === "user"}
                            isLoading={msg.isPending}
                            onAnimationComplete={() => {
                                const isLast = index === messenger.length - 1;

                                if (isLast && options?.type === "radio") {
                                    setAnimationCompleted(true);
                                }
                                // ✅ kiểm tra khi message cuối là AI và KHÔNG có response
                                if (isLast && msg.sender === "ai" && !msg.hasResponse) {
                                    setIsLastMessageAnimationDone(true);
                                }
                            }}
                            ResponseAI={msg?.hasResponse ? response : null}
                            options={options}
                            isAnimationCompleted={isAnimationCompleted}
                        >
                            {msg.text}
                        </Messenger>
                    ))}

                    {optionSelectAnswer.length > 0 &&
                        !isLoadingGeneraAnswer &&
                        isAnimationCompleted && (
                            <div className="flex flex-col gap-y-3 pl-[40px]">
                                {optionSelectAnswer.map((item, index) => {
                                    return (
                                        <SelectAnswer
                                            key={index}
                                            icon={item.icon}
                                            typeAnswer={item.value}
                                            onClick={(value) => handleSelectAnswer(value)}
                                            stepNext={item?.stepNext ?? null}
                                        >
                                            {item.content}
                                        </SelectAnswer>
                                    );
                                })}
                            </div>
                        )}
                    {options.isFinished &&
                        !resultDataChatBot &&
                        isLastMessageAnimationDone && (
                            <Messenger
                                isMe={false}
                                isLoading={false}
                                icon={<LoadingDataChatBot />}
                                nextText={true}
                            >
                                Dữ liệu đang được khởi tạo, vui lòng không tắt pop-up...
                            </Messenger>
                        )}
                    <div key="end-marker" ref={endRef} />
                    {isLoadingGeneraAnswer && (
                        <div>
                            <Messenger isLoading={true} />
                        </div>
                    )}
                </AnimatePresence>
                {resultDataChatBot && (
                    <ResultChatBot
                        productAnalysis={productAnalysis}
                        onRedirect={onRedirect}
                        onRetry={onRetry}
                    />
                )}
            </div>
        </Drawer>
    );
};

export default BoxChatAI;
