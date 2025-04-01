import { Inter } from '@next/font/google';
import React from 'react';
import { PiSparkleFill } from 'react-icons/pi';
import { useDispatch } from 'react-redux';
import { Add as IconClose } from "iconsax-react";
import Image from 'next/image';
import { motion } from 'framer-motion';

const inter = Inter({ subsets: ['latin'] });

const PopupRequestUpdateVersion = () => {
    const dispatch = useDispatch();
    return (
        <div className="">
            <div
                style={{
                    boxShadow: `0px 20px 40px -8px rgba(16, 24, 40, 0.1)`
                }}
                className={`bg-[#ffffff] p-9 rounded-[24px] w-fit h-fit max-w-[455px] relative flex flex-col gap-1 ${inter.className}`}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <PiSparkleFill className='text-[21px]' size={21} color='#3A3E4C' />
                        <p className="3xl:text-lg text-base font-normal leading-6 text-[#3A3E4C] capitalize ">
                            Quản Lý Chuyên Sâu Hơn
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            dispatch({
                                type: "statePopupGlobal",
                                payload: {
                                    open: false
                                }
                            });
                        }}
                        className="flex flex-col items-center justify-center transition rounded-full outline-none hover:opacity-80 hover:scale-105"
                    >
                        <IconClose
                            className="rotate-45"
                            color='#9295A4'
                            size={34}
                        />
                    </button>
                </div>

                <div className="flex justify-center my-4">
                    <div className="w-[266px] h-[200px]">
                        <Image
                            width={1280}
                            height={1024}
                            src={'/popup/illustration.webp'}
                            alt="Illustration"
                            priority
                            unoptimized
                            className="object-cover size-full"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <p className="text-start text-2xl leading-[32px] font-semibold text-[#141522]">
                        Theo dõi đơn hàng theo nhà cung cấp để nguyên vật liệu luôn <span className='text-[#0375F3]'>đúng và đủ</span>.
                    </p>
                    <motion.a
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.985 }}
                        transition={{
                            duration: 0.25,
                            ease: 'easeOut'
                        }}
                        href='https://zalo.me/fososoft'
                        target='_blank'
                        style={{
                            background: `linear-gradient(-7deg, #1F9285 0%, #1FC583 100%)`
                        }}
                        className="w-full  text-center h-[52px] text-white text-[20px] font-medium rounded-[8px] flex items-center justify-center"
                    >
                        Nâng cấp
                    </motion.a>
                </div>
            </div>
        </div>
    );
};

export default PopupRequestUpdateVersion;