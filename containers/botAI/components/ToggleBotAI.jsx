"use client";
import TooltipDefault from "@/components/common/tooltip/TooltipDefault";
import { useAnimation, motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useSettingApp } from "@/hooks/useAuth";
import BoxChatAI from "./BoxChatAI";
import LoadingThreeDotsJumping from "./LoadingThreeDotsJumping";
import AnimatedGeneraText from "@/components/animations/animation/AnimatedGeneraText";
import AnimatedGeneraDiv from "@/components/animations/animation/AnimatiedGeneraDiv";

const ToggleBotAI = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [showText, setShowText] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const timeoutRef = useRef(null);

  const { data: dataSetting, isLoading } = useSettingApp();
  useEffect(() => {
    let interval;
    let timeoutText;
    let timeoutHide;

    const runCycle = () => {
      setShowBubble(true);
      setShowText(false);

      timeoutText = setTimeout(() => {
        setShowText(true);
      }, 3000);

      timeoutHide = setTimeout(() => {
        setShowBubble(false);
      }, 8000);
    };

    if (!isHovering) {
      runCycle(); // chỉ chạy nếu không hover
      interval = setInterval(runCycle, 15000);
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timeoutText);
      clearTimeout(timeoutHide);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isHovering]);

  return (
    <>
      <div
        className="fixed bottom-6 right-6 z-50 cursor-pointer"
        onClick={() => setOpenDrawer(true)}
        onMouseEnter={() => {
          setIsHovering(true);
          setShowBubble(true);
          setShowText(true);
        }}
        onMouseLeave={() => {
          setShowBubble(false);
          // Clear timeout cũ nếu có
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }

          // Sau 3s mới set lại isHovering = false
          timeoutRef.current = setTimeout(() => {
            setIsHovering(false);
          }, 3000);
        }}
      >
        <div className="relative flex flex-col items-center w-fit justify-center">
          {/* ✅ BUBBLE */}
          <AnimatePresence>
            {showBubble && (
              <div className="absolute top-[-10px] left-0 -translate-x-[calc(100%-20px)] w-fit h-fit bg-transparent">
                <motion.div
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0.3 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  {showText ? (
                    <AnimatedGeneraDiv
                      className=" px-3 py-3 rounded-l-xl rounded-tr-xl bg-[#EBFEF2] border border-[#064E3B] shadow-md"
                      classNameWrapper="rounded-l-xl rounded-tr-xl"
                    >
                      <p className="font-deca text-xs font-normal text-[#064E3B] whitespace-nowrap">
                        Xin chào,<b>Fimo</b> có thể hỗ trợ gì cho bạn?
                      </p>
                    </AnimatedGeneraDiv>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0.3 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0.9 }}
                      transition={{ duration: 0.6 }}
                      className=" px-3 py-3 rounded-l-xl rounded-tr-xl bg-[#EBFEF2] border border-[#064E3B]"
                    >
                      <LoadingThreeDotsJumping
                        classNameDot1="bg-[#54E79E]"
                        classNameDot2="bg-[#21B972]"
                        classNameDot3="bg-[#027A48]"
                      />
                    </motion.div>
                  )}
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* background */}
          <div className="absolute left-1/2 -translate-x-1/2  bottom-[10px] z-[-1]">
            <div className="rounded-full bg-linear-border-toggle-bot p-[6px] w-[78px] h-[78px] aspect-1">
              <div className="bg-linear-background-toggle-bot rounded-full size-full"></div>
            </div>
          </div>

          {/* Bot Mascot */}
          <div className="w-[90px] h-[90px] rounded-full ">
            <Image
              alt="bot"
              src="/bot-ai/toggle.gif"
              width={900}
              height={680}
              className="w-[90px] h-[90px] bg-transparent rounded-full"
              quality={100}
              loading="eager"
            />
          </div>
          {/* Label Text */}
          <div className="relative rounded-2xl bg-linear-border-toggle-bot p-[2px]  h-fit w-fit">
            <div className="bg-linear-background-toggle-bot rounded-2xl size-full py-[6px] px-2 w-fit">
              <p className="text-white font-normal font-deca text-xs whitespace-nowrap">
                Trợ lý AI Fimo
              </p>
            </div>
          </div>
        </div>
      </div>
      <BoxChatAI openChatBox={openDrawer} setOpenChatBox={setOpenDrawer} />
    </>
  );
};

export default ToggleBotAI;
