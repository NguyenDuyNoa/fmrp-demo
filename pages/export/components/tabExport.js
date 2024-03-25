import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { TiTick } from "react-icons/ti";
const TabClient = React.memo((props) => {
    const router = useRouter();
    return (
        <button
            style={props.style}
            onClick={props.onClick}
            className={`${props.className} ${
                router.query?.tab === `${props.active}` ? "bg-blue-400 text-white" : ""
            } justify-center 3xl:w-[293px] xxl:w-[207px] 2xl:w-[230px] xl:w-[187px] lg:w-[144px] md:w-[140px] w-[180px] 3xl:h-10 3xl:mb-3.5 2xl:mb-2 xxl:mb-3 mb-3   2xl:h-8 xl:h-8 lg:h-7 3xl:text-base 2xl:text-[14px] 2xl:text-sm xl:text-[14px] lg:text-[12px] flex gap-2 items-center rounded-md outline-none`}
        >
            {router.query?.tab === `${props.active}` && <TiTick size="20" color="white" />}
            {props.children}
        </button>
    );
});
export default TabClient;
