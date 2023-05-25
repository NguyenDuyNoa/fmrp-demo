import { useRouter } from "next/dist/client/router";
import React from 'react'
import { ArrowCircleDown } from "iconsax-react";

const TabFilter = React.memo((props) => {
    const router = useRouter();

    return (
        <button style={props.style} onClick={props.onClick} className={`${props.className} justify-center min-w-[180px] flex gap-2 2xl:text-sm xl:text-sm text-xs items-center rounded-[5.5px] px-2 py-2 outline-none relative`}>
            {router.query?.tab === `${props.active}` && <ArrowCircleDown size="20" color="#0F4F9E" />}
            {props.children}
            <span className={`${props?.total > 0 && "absolute min-w-[29px] top-0 right-0 bg-[#ff6f00]  translate-x-2.5 -translate-y-2 text-white rounded-[100%] px-2 text-center items-center flex justify-center 2xl:py-1 py-1"} `}>
                {props?.total > 0 && props?.total}
            </span>
        </button>
    )

})
export default TabFilter