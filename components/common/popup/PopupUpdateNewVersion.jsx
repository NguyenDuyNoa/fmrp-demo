import { Lexend_Deca } from "@next/font/google";
import React from "react";
import { PiSparkleFill } from "react-icons/pi";
import { useDispatch } from "react-redux";
import { Add as IconClose } from "iconsax-react";
import SealCheck from "@/components/icons/SealCheck";
import Image from "next/image";

const deca = Lexend_Deca({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
const PopupUpdateNewVersion = ({ children }) => {
    const dispatch = useDispatch();
    return (
        <div className="">
            <div
                style={{
                    boxShadow: `0px 20px 40px -8px rgba(16, 24, 40, 0.1)`,
                }}
                className={`bg-[#ffffff] pb-8 pt-[80px] px-[64px] rounded-2xl w-fit h-fit max-w-[570px] relative flex flex-col gap-y-8 ${deca.className} items-center justify-center`}
            >
                {/* title */}
                <div className="w-full flex flex-col justify-center items-center gap-y-5">
                    <h3 className="font-semibold text-[28px] text-typo-black-2 leading-9 text-center">
                        Cập nhật phiên bản mới v3.0 - Trải nghiệm mượt hơn!
                    </h3>
                    <p className="font-medium text-base text-typo-gray-1 w-[70%] text-center">
                        Chúng tôi vừa phát hành Phiên bản v3.0 với nhiều cải tiến quan
                        trọng:
                    </p>
                </div>

                {/* content */}
                <div className="flex flex-col rounded-2xl bg-background-blue-3 w-full h-fit gap-y-5 p-6">
                    {/* {children} */}
                    <div className="flex flex-row gap-x-2 items-center justify-center">
                        <SealCheck />
                        <p className="flex-1 text-sm font-medium text-typo-gray-3">
                            Tăng tốc hiệu suất, giúp thao tác nhanh và mượt hơn.
                        </p>
                    </div>
                    <div className="flex flex-row gap-x-2 items-center justify-center">
                        <SealCheck />
                        <p className="flex-1 text-sm font-medium text-typo-gray-3">
                            Tăng tốc hiệu suất, giúp thao tác nhanh và mượt hơn.
                        </p>
                    </div>
                    <div className="flex flex-row gap-x-2 items-center justify-center">
                        <SealCheck />
                        <p className="flex-1 text-sm font-medium text-typo-gray-3">
                            Tăng tốc hiệu suất, giúp thao tác nhanh và mượt hơn.
                        </p>
                    </div>
                    <div className="flex flex-row gap-x-2 items-center justify-center">
                        <SealCheck />
                        <p className="flex-1 text-sm font-medium text-typo-gray-3">
                            Tăng tốc hiệu suất, giúp thao tác nhanh và mượt hơn.
                        </p>
                    </div>
                </div>

                {/* button */}
                <button
                    className="rounded-lg text-white bg-background-blue-4 py-[10px] px-[18px] w-fit border border-transparent 
             hover:bg-white hover:text-background-blue-4 hover:border-background-blue-4 transition-all duration-200 text-base font-normal"
                >
                    Cập nhật ngay
                </button>

                <div className="absolute top-0  -translate-y-1/2 select-none">
                    <Image
                        alt="rocket"
                        src="/popup/rocket.png"
                        width={600}
                        height={600}
                        quality={100}
                        className="h-[130px] w-[140px] select-none"
                        draggable={false}
                    />
                </div>
            </div>
        </div>
    );
};

export default PopupUpdateNewVersion;
