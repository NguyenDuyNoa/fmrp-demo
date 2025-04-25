import React, { useEffect, useMemo, useRef } from "react";
import { twMerge } from "tailwind-merge";
import LoadingThreeDotsJumping from "./LoadingThreeDotsJumping";
import AvatarBotAI from "./AvatarBotAI";
import AnimatedGeneraText from "@/components/animations/animation/AnimatedGeneraText";
import parse from "html-react-parser";
import { useDispatch } from "react-redux";

const Messenger = ({
    className,
    children,
    isMe = false,
    isLoading = false,
}) => {


    const parsedMessage = useMemo(() => {
        if (!children) return null;
        return parse(children);
    }, [children]);

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
                    {isLoading ? (
                        <LoadingThreeDotsJumping />
                    ) : isMe ? (
                        <p>{children}</p>
                    ) : (
                        <AnimatedGeneraText>{parsedMessage}</AnimatedGeneraText>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Messenger;
