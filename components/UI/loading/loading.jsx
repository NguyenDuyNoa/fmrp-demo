import Image from "next/image";
import React from "react";

export default function Loading(props) {
    return (
        <div
            className={
                "relative bg-slate-50/50 w-full 3xl:h-[516px] 2xl:h-[356px] xl:h-[286px] h-[352px] flex flex-col justify-center items-center rounded " +
                props.className
            }
        >
            <Image
                alt="loading"
                width={400}
                height={400}
                src="/loading-test.gif"
                className="3xl:h-44 h-36 w-auto aspect-1"
                priority
            />
        </div>
    );
}
