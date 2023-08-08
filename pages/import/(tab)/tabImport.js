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
                router.query?.tab === `${props.active}`
                    ? "bg-blue-400 text-white"
                    : ""
            } justify-center 3xl:w-[230px] 2xl:w-[180px] xl:w-[160px] lg:w-[140px] 3xl:h-10 mb-2 2xl:h-8 xl:h-8 lg:h-7 3xl:text-[16px] 2xl:text-[14px] xl:text-[14px] lg:text-[12px] flex gap-2 items-center rounded-md px-2 py-2 outline-none`}
        >
            {router.query?.tab === `${props.active}` && (
                <TiTick size="20" color="white" />
            )}
            {props.children}
        </button>
    );
});
export default TabClient;
