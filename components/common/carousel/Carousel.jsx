import Image from "next/image";
import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaArrowRight } from "react-icons/fa6";
import { FaArrowLeft } from "react-icons/fa6";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
// import required modules
import { Navigation, Pagination } from "swiper/modules";
import { twMerge } from "tailwind-merge";
const Carousel = () => {
    const swiperRef = useRef(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    //xử lý custom-swiper-pagination 
    const updateNavState = (swiper) => {
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
    };

    return (
        <div className="relative">
            {/* Custom arrows */}
            <div className="swiper-button-prev-custom left-4 absolute top-[40%] z-10 -translate-y-1/2 transition-all">
                <button
                    className={twMerge(
                        "p-2 bg-[#EBF5FF] rounded-full text-[#25387A] disabled:opacity-50",
                        isBeginning ? "opacity-50 pointer-events-none" : "opacity-100"
                    )}
                >
                    <FaArrowLeft />
                </button>
            </div>
            <div className="swiper-button-next-custom right-4 absolute top-[40%] z-10 -translate-y-1/2 transition-all ">
                <button
                    className={twMerge(
                        "p-2 bg-[#EBF5FF] rounded-full text-[#25387A] disabled:opacity-50",
                        isEnd ? "opacity-50 pointer-events-none" : "opacity-100"
                    )}
                >
                    <FaArrowRight />
                </button>
            </div>
            <Swiper
                slidesPerView={1}
                spaceBetween={30}
                loop={false}
                pagination={{
                    // clickable: true,
                    el: ".custom-swiper-pagination",
                    clickable: true,
                    renderBullet: (index, className) => {
                        return `<span class="${className} custom-dot"></span>`;
                    },
                }}
                // navigation={true}
                navigation={{
                    prevEl: ".swiper-button-prev-custom",
                    nextEl: ".swiper-button-next-custom",
                }}
                modules={[Pagination, Navigation]}
                className="mySwiper"

                //xử lý custom-swiper-pagination
                onInit={(swiper) => {
                    swiperRef.current = swiper;
                    updateNavState(swiper); // initial state
                }}
                onSlideChange={(swiper) => {
                    updateNavState(swiper);
                }}
            >
                <SwiperSlide>
                    <div className="w-full flex flex-row justify-center">
                        <div className="flex flex-row justify-center gap-x-3 rounded-lg border border-[#DDDDE2] px-2 py-6 max-w-[500px]">
                            <div className="flex flex-col justify-start  items-center gap-y-2">
                                <div className="h-auto aspect-1 w-[100px]">
                                    <Image
                                        src="/qrCode/QR.png"
                                        width={600}
                                        height={600}
                                        quality={100}
                                        alt="QR"
                                    />
                                </div>
                                <p className="text-xs font-normal text-[#003DA0]">
                                    LSXCT13032519
                                </p>
                            </div>

                            <div className="flex flex-col gap-y-2">
                                <div className="flex flex-col gap-y-[6px]">
                                    <p className="font-semibold text-sm text-black">
                                        Công ty Dệt may Happy Polla adasdas
                                    </p>
                                    <p className="font-light text-xs text-black">
                                        67 Lê Văn Tám, khu phố 9, phường 10, quận 11, TP HCM.
                                        adadasda ljdalkj alkdjalksdj asdjasldj
                                    </p>
                                    <p className="font-light text-xs text-black">0987456231</p>
                                </div>
                                <div className="flex-1 border-t border-dashed border-black"></div>
                                <div className="flex flex-col gap-y-[6px]">
                                    <p className="font-semibold text-sm text-black">Áo ba lỗ</p>
                                    <p className="font-normal text-xs text-black">Đen - S</p>
                                    <p className="font-normal text-xs text-[#003DA0]">
                                        Serial: XYZ7896542310
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="w-full flex flex-row justify-center pb-8">
                        <div className="flex flex-row justify-center gap-x-[6px] rounded-lg border border-[#DDDDE2] px-2 py-6">
                            <div className="flex flex-col justify-center  items-center">
                                <div className="h-auto aspect-1 w-[100px]">
                                    <Image
                                        src="/qrCode/QR.png"
                                        width={600}
                                        height={600}
                                        quality={100}
                                        alt="QR"
                                    />
                                </div>
                                <p className="text-xs font-normal text-typo-[#003DA0]">
                                    LSXCT13032519
                                </p>
                            </div>

                            <div className="flex flex-col gap-y-[4px]">
                                <div className="flex flex-col gap-y-[2px]">
                                    <p className="font-semibold text-sm text-black">
                                        Công ty Dệt may Happy Polla
                                    </p>
                                    <p className="font-light text-xs text-black">
                                        67 Lê Văn Tám, khu phố 9, phường 10, quận 11, TP HCM.
                                    </p>
                                    <p className="font-light text-xs text-black">0987456231</p>
                                </div>
                                <div className="flex-1 border-t border-dashed border-black"></div>
                                <div className="flex flex-col gap-y-[2px]">
                                    <p className="font-semibold text-sm text-black">Áo ba lỗ</p>
                                    <p className="font-normal text-xs text-black">Đen - S</p>
                                    <p className="font-normal text-xs text-[#003DA0]">
                                        Serial: XYZ7896542310
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="w-full flex flex-row justify-center pb-8">
                        <div className="flex flex-row justify-center gap-x-[6px] rounded-lg border border-[#DDDDE2] px-2 py-6">
                            <div className="flex flex-col justify-center  items-center">
                                <div className="h-auto aspect-1 w-[100px]">
                                    <Image
                                        src="/qrCode/QR.png"
                                        width={600}
                                        height={600}
                                        quality={100}
                                        alt="QR"
                                    />
                                </div>
                                <p className="text-xs font-normal text-typo-[#003DA0]">
                                    LSXCT13032519
                                </p>
                            </div>

                            <div className="flex flex-col gap-y-[4px]">
                                <div className="flex flex-col gap-y-[2px]">
                                    <p className="font-semibold text-sm text-black">
                                        Công ty Dệt may Happy Polla
                                    </p>
                                    <p className="font-light text-xs text-black">
                                        67 Lê Văn Tám, khu phố 9, phường 10, quận 11, TP HCM.
                                    </p>
                                    <p className="font-light text-xs text-black">0987456231</p>
                                </div>
                                <div className="flex-1 border-t border-dashed border-black"></div>
                                <div className="flex flex-col gap-y-[2px]">
                                    <p className="font-semibold text-sm text-black">Áo ba lỗ</p>
                                    <p className="font-normal text-xs text-black">Đen - S</p>
                                    <p className="font-normal text-xs text-[#003DA0]">
                                        Serial: XYZ7896542310
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>
            <div className="custom-swiper-pagination flex justify-center gap-1 mt-2" />
        </div>
    );
};

export default Carousel;
