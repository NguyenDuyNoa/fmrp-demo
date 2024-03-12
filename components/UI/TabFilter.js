import { useRouter } from "next/dist/client/router";
import React from "react";
import { ArrowCircleDown } from "iconsax-react";

const TabFilter = React.memo((props) => {
    const router = useRouter();

    return (
        // <button style={props.style} onClick={props.onClick} className={`${props.className} justify-center 3xl:w-[200px] 2xl:w-[180px] xl:w-[160px] lg:w-[140px] 3xl:text-[16px] 2xl:text-[16.5px] xl:text-[12px] lg:text-[13px] flex gap-2 items-center rounded-md px-2 py-2 outline-none relative`}>
        <button
            style={{
                backgroundColor: props.backgroundColor ? props.backgroundColor : "#e2f0fe",
            }}
            onClick={props.onClick}
            className={`${props.className} mt-3 mb-1 whitespace-nowrap text-[#0F4F9E] justify-center 3xl:w-[200px] 2xl:w-[180px] xl:w-[160px] lg:w-[140px] 3xl:text-[17px] 2xl:text-[15px] xl:text-[12px] lg:text-[11px] flex gap-2 items-center rounded-md px-2 py-2 outline-none relative`}
        // className={`${props.className} text-[#0F4F9E] justify-center 3xl:w-[200px] 2xl:w-[180px] xl:w-[160px] lg:w-[140px] 3xl:h-10 2xl:h-8 xl:h-8 lg:h-7 3xl:text-[17px] 2xl:text-[15px] xl:text-[12px] lg:text-[11px] flex gap-2 items-center rounded-md px-2 py-2 outline-none relative`}
        >
            {router.query?.tab === `${props.active}` && (
                <ArrowCircleDown
                    className="3xl:w-[18px] 2xl:w-[16px] xl:w-[15px] lg:w-[15px] 3xl:h-[18px] 2xl:h-[16px] xl:h-[15px] lg:h-[15px]"
                    color="#0F4F9E"
                />
            )}
            {props.children}
            <span
                className={`${props?.total > 0 &&
                    "absolute 3xl:w-[24px]  2xl:w-[20px] xl:w-[18px] lg:w-[18px] 3xl:h-[24px] 2xl:h-[20px] xl:h-[18px] lg:h-[18px] 3xl:py-1 3xl:px-2  2xl:py-1 2xl:px-2  xl:py-1 xl-px-2  lg:py-1 lg:px-2 3xl:text-[15px] 2xl:text-[13px] xl:text-[11px] lg:text-[11px] top-0 right-0 bg-[#ff6f00]  3xl:translate-x-[30%] 2xl:translate-x-2.5 xl:translate-x-2 lg:translate-x-[40%] 3xl:-translate-y-[50%] 2xl:-translate-y-2  xl:-translate-y-[40%] lg:-translate-y-[40%] text-white rounded-full text-center items-center flex justify-center"
                    } `}
            >
                {props?.total > 0 && props?.total}
            </span>
        </button>
    );
});
export default TabFilter;
