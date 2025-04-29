import Image from 'next/image';
import React from 'react'
import { twMerge } from 'tailwind-merge';

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

export default AvatarBotAI