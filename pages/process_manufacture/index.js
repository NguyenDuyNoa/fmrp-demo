import React from 'react'
import Head from 'next/head';
import Image from 'next/image';

import { ArrowRight2 as IconRight } from "iconsax-react";

const Index = () => {
    return (
        <React.Fragment>
            <Head>
                <title>Quy trình quản lý sản xuất</title>
            </Head>
            <div className='xl:px-10 xl:pt-[74px] px-3 pt-[88px] pb-10 space-y-2.5 lg:h-screen overflow-hidden flex flex-col justify-between'>
                <div className='space-y-3 overflow-hidden p-4'>
                    <div className='flex space-x-3 xl:text-[14.5px] text-[12px]'>
                        <h6 className='text-[#141522]/40'>Trang chủ</h6>
                        <span className='text-[#141522]/40'>/</span>
                        <h6 className='text-[#141522]/40'>Quy trình</h6>
                        <span className='text-[#141522]/40'>/</span>
                        <h6 >Quy trình quản lý sản xuất</h6>
                    </div>
                    <h2 className='xl:text-3xl lg:text-2xl text-xl font-medium'>Quy Trình Quản Lý Sản Xuất</h2>
                </div>

                <div className='3xl:h-[88%] 2xl:h-[84%] xl:h-[80%] lg:h-[84%] w-[100%] 3xl:px-[50px] 2xl:px-16 overflow-hidden pt-2 relative border border-slate-100 flex-col flex'>
                    <div className='h-full w-full rounded-lg relative z-10 px-10 space-y-1 flex flex-row'>
                        <div class="basis-full">
                            <div className='3xl:w-[200px] 2xl:w-[100px] xl:w-[88px] w-[88px] flex justify-center'>
                                <div className=' 3xl:h-[80px] 3xl:w-[80px] 2xl:h-[54px] 2xl:w-[54px] xl:h-[48px] xl:w-[48px] lg:h-14 lg:w-14 rounded-full flex flex-col justify-center items-center bg-[#3276FA] text-white'>
                                    <h5 className='3xl:text-[16px] 2xl:text-[10px] xl:text-[10px] lg:text-[10px] text-center'>Bắt đầu</h5>
                                </div>
                            </div>

                            <div className='3xl:w-[200px] 2xl:w-[100px] xl:w-[88px] lg:w-[88px] flex justify-center'>
                                <div className='3xl:h-12 2xl:h-[28px] xl:h-[24px] lg:h-[20px] lg:w-14 flex flex-col justify-center items-center '>
                                    <div className="relative">
                                        <IconRight
                                            className="bottom-[0%] 3xl:-translate-x-[47%] 3xl:translate-y-[35%] 3xl:scale-110 2xl:-translate-x-[46%] 2xl:translate-y-[35%] 2xl:scale-95 xl:-translate-x-[47%] xl:translate-y-[40%] xl:scale-75 lg:-translate-x-[47%] lg:-translate-y-[6%] lg:scale-50 text-[#3276FA] absolute rotate-90"
                                        />
                                        <div className="w-[2px] bg-[#3276FA] 3xl:h-10 2xl:h-5 xl:h-4 lg:h-8" />
                                    </div>
                                </div>
                            </div>

                            <div className='flex'>
                                <div>
                                    <div className="flex items-center space-1">
                                        <div className='3xl:h-[80px] 3xl:w-[200px] 2xl:h-[50px] 2xl:w-[100px] xl:h-[44px] xl:w-[88px] lg:h-[60px] lg:w-[130px] flex border-none bg-[#E2F0FE] rounded-[8px] items-center justify-center relative'>
                                            <h5 className='3xl:max-w-[140px] 3xl:text-base 2xl:max-w-[80px] 2xl:text-[12px] xl:max-w-[140px] xl:text-[10px] lg:max-w-[120px] p-1 text-center lg:text-[10px] '>
                                                Kế hoạch sản xuất
                                            </h5>
                                            <h5 className='3xl:h-4 3xl:w-4 2xl:h-3 2xl:w-3 xl:h-2 xl:w-2 3xl:text-[10px] 2xl:text-[8px] xl:text-[6px] lg:text-[6px] 3xl:top-[4%] xl:top-[4%] lg:top-[6%] 3xl:left-[2%] 2xl:left-[4%] xl:left-[4%] lg:-left-[6%] rounded-full flex flex-col justify-center items-center bg-[#3276FA] absolute text-white '>
                                                1
                                            </h5>

                                            <div className="flex flex-col items-center absolute  3xl:top-[80%] 3xl:left-[50%] 2xl:top-[60%] 2xl:left-[48%] xl:top-[80%] xl:left-[50%] lg:top-[80%] lg:left-[50%]">
                                                <div className="3xl:w-[155px] 3xl:h-[218px] 2xl:w-[100px] 2xl:h-[200px] xl:w-[120px] xl:h-44 lg:w-[100px] lg:h-44 border rounded-t-none rounded-r-none rounded-bl-[20px] border-dashed border-[#B2B9C8] border-t-0 border-r-0 rounded 2xl:mt-6 xl:mt-4 lg:mt-3">
                                                    <div className="border border-b rounded-bl-[20px] 3xl:w-[155px] 2xl:w-[100px] xl:w-[155px] lg:w-[155px] border-x-0 border-t-0 h-20 border-dashed border-[#B2B9C8] text-center absolute  3xl:top-[20%] 2xl:top-[15%] xl:top-[28%] lg:top-[32%]" />
                                                    <IconRight
                                                        className="text-[#B2B9C8] absolute top-0 -left-[16%] 3xl:translate-x-[50%] 3xl:translate-y-[55%] 2xl:translate-x-[18%] 2xl:translate-y-[55%] xl:translate-x-[50%] xl:translate-y-[55%] lg:translate-x-[50%] lg:translate-y-[55%] -rotate-90"
                                                        size="24"
                                                        variant="Outline"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className='3xl:w-14 2xl:w-12 xl:w-10 lg:w-8 flex flex-col justify-center items-center '>
                                            <div className="flex items-center -space-x-4">
                                                <div className="h-[2px] bg-[#3276FA] 3xl:w-10 2xl:w-9 xl:w-6 lg:w-4" />
                                                <IconRight className="text-[#3276FA] 3xl:scale-90 2xl:scale-100 xl:scale-100 lg:scale-100" />
                                            </div>
                                        </div>

                                        <div className='3xl:h-[80px] 3xl:w-[200px] 2xl:h-[50px] 2xl:w-[120px] xl:h-[44px] xl:w-[130px] lg:h-[60px] lg:w-[130px] flex border-none bg-[#E2F0FE] rounded-[8px] items-center justify-center relative'>
                                            <h5 className='3xl:max-w-[140px] 3xl:text-base 2xl:max-w-[100px] 2xl:text-[12px] xl:text-[10px] lg:text-[10px] xl:max-w-[140px] lg:max-w-[120px] p-1 text-center'>
                                                Kế hoạch nguyên vật liệu
                                            </h5>
                                            <h5 className='3xl:h-4 3xl:w-4 2xl:h-3 2xl:w-3 xl:h-2 xl:w-2 3xl:text-[10px] 2xl:text-[8px] xl:text-[6px] lg:text-[6px] 3xl:top-[4%] xl:top-[4%] lg:top-[6%] 3xl:left-[2%] 2xl:left-[4%] xl:left-[4%] lg:-left-[6%] rounded-full flex flex-col justify-center items-center bg-[#3276FA] absolute text-white '>
                                                2
                                            </h5>

                                            <div className="absolute 3xl:top-[170%] 2xl:top-[220%] xl:-top-[150%] lg:-top-[160%] ">
                                                <Image
                                                    alt=""
                                                    src="/process_products/Subtract.png"
                                                    width={600}
                                                    height={220}
                                                    className="object-contain 3xl:h-[100px] 2xl:h-[60px] xl:h-[60px] lg:h-[60px] 3xl:-left-[30%] 2xl:-left-[30%] xl:-left-[6%] lg:-left-[6%] relative"
                                                    loading="lazy"
                                                    crossOrigin="anonymous"
                                                    placeholder="blur"
                                                    blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                                />
                                                <span
                                                    className="transform 3xl:translate-x-[-120%] 3xl:translate-y-[-60%] 2xl:translate-x-[-124%] 2xl:translate-y-[-50%] xl:translate-x-[-72%] xl:translate-y-[-60%] lg:translate-x-[-72%] lg:translate-y-[-60%] absolute select-none pointer-events-none font-bold 3xl:top-[30%] 2xl:top-[20%] xl:top-[32%] lg:top-[30%] left-[52%] 3xl:text-[10px] 2xl:text-[6px] xl:text-[8px] lg:text-[7px] 3xl:p-4 2xl:p-3 xl:p-2 lg:p-1"
                                                >
                                                    <span className='uppercase '>
                                                        Đơn đặt hàng
                                                    </span>
                                                    <Image
                                                        alt=""
                                                        src="/process_products/Frame.png"
                                                        width={600}
                                                        height={220}
                                                        className="3xl:h-[30px] 2xl:h-[18px] xl:h-[18px] lg:h-[18px] 3xl:-bottom-[50%] 2xl:-bottom-[40%] xl:-bottom-[70%] lg:-bottom-[100%] 3xl:left-[2%] 2xl:left-[6%] xl:left-[2%] lg:left-[2%] absolute object-contain"
                                                        loading="lazy"
                                                        crossOrigin="anonymous"
                                                        placeholder="blur"
                                                        blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                                    />
                                                </span>
                                            </div>

                                            <div className="absolute 3xl:top-[310%] 2xl:top-[440%] xl:-top-[460%] lg:-top-[460%] ">
                                                <Image
                                                    alt=""
                                                    src="/process_products/Subtract.png"
                                                    width={600}
                                                    height={220}
                                                    className="object-contain 3xl:h-[100px] 2xl:h-[60px] xl:h-[60px] lg:h-[60px] 3xl:-left-[30%] 2xl:-left-[30%] xl:-left-[30%] lg:-left-[30%] relative"
                                                    loading="lazy"
                                                    crossOrigin="anonymous"
                                                    placeholder="blur"
                                                    blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                                />
                                                <span
                                                    className="transform 3xl:translate-x-[-120%] 3xl:translate-y-[-60%] 2xl:translate-x-[-124%] 2xl:translate-y-[-50%] xl:translate-x-[-72%] xl:translate-y-[-60%] lg:translate-x-[-72%] lg:translate-y-[-60%] absolute select-none pointer-events-none font-bold 3xl:top-[30%] 2xl:top-[20%] xl:top-[32%] lg:top-[30%] left-[52%] 3xl:text-[10px] 2xl:text-[6px] xl:text-[8px] lg:text-[7px] 3xl:p-4 2xl:p-3 xl:p-2 lg:p-1"
                                                >
                                                    <span className='uppercase '>
                                                        Kế hoạch nội bộ
                                                    </span>
                                                    <Image
                                                        alt=""
                                                        src="/process_products/Frame.png"
                                                        width={600}
                                                        height={220}
                                                        className="3xl:h-[30px] 2xl:h-[18px] xl:h-[18px] lg:h-[18px] 3xl:-bottom-[50%] 2xl:-bottom-[40%] xl:-bottom-[70%] lg:-bottom-[100%] 3xl:left-[2%] 2xl:left-[6%] xl:left-[2%] lg:left-[2%] absolute object-contain"
                                                        loading="lazy"
                                                        crossOrigin="anonymous"
                                                        placeholder="blur"
                                                        blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                                    />
                                                </span>
                                            </div>

                                        </div>

                                        <div className='3xl:w-14 2xl:w-12 xl:w-10 lg:w-8 flex flex-col justify-center items-center '>
                                            <div className="flex items-center -space-x-4">
                                                <div className="h-[2px] bg-[#3276FA] 3xl:w-10 2xl:w-9 xl:w-6 lg:w-4" />
                                                <IconRight className="text-[#3276FA] 3xl:scale-90 2xl:scale-100 xl:scale-100 lg:scale-100" />
                                            </div>
                                        </div>

                                        <div className='3xl:h-[80px] 3xl:w-[200px] 2xl:h-[50px] 2xl:w-[140px] xl:h-[44px] xl:w-[130px] lg:h-[60px] lg:w-[130px] flex border-none bg-[#E2F0FE] rounded-[8px] items-center justify-center relative'>
                                            <h5 className='3xl:max-w-[140px] 3xl:text-base 2xl:max-w-[100px] 2xl:text-[12px] xl:max-w-[140px] xl:text-[10px] lg:max-w-[120px] lg:text-[12px] p-1 text-center'>
                                                Kiểm tra tình trạng kho
                                            </h5>
                                            <h5 className='3xl:h-4 3xl:w-4 2xl:h-3 2xl:w-3 xl:h-2 xl:w-2 3xl:text-[10px] 2xl:text-[8px] xl:text-[6px] lg:text-[6px] 3xl:top-[4%] xl:top-[4%] lg:top-[6%] 3xl:left-[2%] 2xl:left-[4%] xl:left-[4%] lg:-left-[6%] rounded-full flex flex-col justify-center items-center bg-[#3276FA] absolute text-white '>
                                                2.1
                                            </h5>
                                        </div>

                                        <div className='3xl:w-14 2xl:w-12 xl:w-10 lg:w-8 flex flex-col justify-center items-center '>
                                            <div className="flex items-center -space-x-4">
                                                <div className="h-[2px] bg-[#3276FA] 3xl:w-10 2xl:w-9 xl:w-6 lg:w-4" />
                                                <IconRight className="text-[#3276FA] 3xl:scale-90 2xl:scale-100 xl:scale-100 lg:scale-100" />
                                            </div>
                                        </div>
                                        <div className='flex justify-center items-center relative'>
                                            <div className='3xl:w-[40px] 3xl:h-[40px] 2xl:w-[32px] 2xl:h-[32px] bg-[#3276FA] rotate-45 relative rounded-[4px]' />

                                            <div className="flex flex-col items-center absolute -top-[230%] left-[48%]">
                                                <div className="3xl:w-[35px] 3xl:h-[80px] 2xl:w-[34px] 2xl:h-[60px] xl:w-[28px] xl:h-[44px] lg:w-[26px] lg:h-[74px] rounded-tl-[20px] border-[2px] border-[#B2B9C8] rounded-b-none rounded-r-none border-b-0 border-r-0 rounded " />
                                                <div className='absolute -top-[20%] left-[100%] w-[80px] h-10 3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] lg:text-[10px] text-center'>
                                                    Đủ 1 phần kho NVL
                                                </div>
                                            </div>
                                            <div className="flex items-center -space-x-4 absolute 3xl:-top-[255%] 3xl:left-[330%] 2xl:-top-[255%] 2xl:left-[400%] xl:-top-[255%] xl:left-[400%] lg:-top-[255%] lg:left-[400%]">
                                                <div className="h-0.5 bg-[#B2B9C8] 3xl:w-6 2xl:w-6 xl:w-6 lg:w-6" />
                                                <IconRight className="text-[#B2B9C8] scale-90" />
                                            </div>

                                            <div className='3xl:h-[80px] 3xl:w-[200px] 2xl:h-[50px] 2xl:w-[140px] xl:h-[44px] xl:w-[130px] lg:h-[60px] lg:w-[130px] 2xl:-top-[290%] 2xl:left-[510%] xl:-top-[330%] xl:left-[410%]  lg:-top-[330%] lg:left-[410%] 3xl:-top-[330%] 3xl:left-[410%]  flex border rounded-[8px] items-center justify-center absolute'>
                                                <h5 className='3xl:max-w-[140px] 3xl:text-base 2xl:max-w-[140px] 2xl:text-[12px] xl:max-w-[140px] xl:text-[10px] lg:max-w-[120px] lg:text-[10px] p-1 text-center'>
                                                    Giữ kho
                                                </h5>
                                            </div>

                                            <div className="flex flex-col items-center absolute top-[130%] left-[48%]">
                                                <div className="3xl:w-[35px] 3xl:h-[120px] 2xl:w-[34px] 2xl:h-[60px] xl:w-[28px] xl:h-[44px] lg:w-[26px] lg:h-[74px] border-[2px] border-[#B2B9C8] rounded-l-none border-y-0 border-r-0 rounded " />
                                                <div className='absolute 3xl:top-[100%] 3xl:-left-[115%] top-[110%] -left-[115%] w-[80px] h-10 3xl:text-[14px] 2xl:text-[14px] xl:text-[10px] lg:text-[10px] text-center text-[#EE1E1E] font-[500]'>
                                                    Hết kho NVL
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-center absolute top-[535%] left-[48%]">
                                                <div className="3xl:w-[140px] 3xl:h-[80px] 2xl:w-[140px] 2xl:h-[60px] xl:w-[28px] xl:h-[44px] lg:w-[26px] lg:h-[74px] rounded-bl-[20px] border-[2px] border-[#B2B9C8] rounded-t-none rounded-r-none border-t-0 border-r-0 rounded ">
                                                    <IconRight
                                                        className="text-[#B2B9C8] absolute bottom-0 right-0 translate-x-[30%] translate-y-[45%]"
                                                        size="24"
                                                        variant="Outline"
                                                    />
                                                </div>
                                            </div>

                                            <div className='3xl:w-[200px] 2xl:w-[200px] xl:w-[200px] lg:w-[200px] flex justify-center absolute 3xl:top-[150%] 3xl:left-[420%] 2xl:top-[120%] 2xl:left-[420%] xl:top-[150%] xl:left-[420%] lg:top-[150%] lg:left-[420%]'>
                                                <div className='3xl:h-14 3xl:w-24 2xl:h-14 2xl:w-[60px] xl:h-[54px] xl:w-[54px] lg:h-14 lg:w-14 flex flex-col justify-center items-center '>
                                                    <div className="relative">
                                                        <IconRight className=" top-0 3xl:-translate-x-[46%] 3xl:-translate-y-[20%] 3xl:scale-110 2xl:-translate-x-[46%] 2xl:translate-y-[-20%] 2xl:scale-125 xl:-translate-x-[47%] xl:-translate-y-[6%] lg:-translate-x-[47%] lg:-translate-y-[6%] text-[#B2B9C8] absolute -rotate-90" />
                                                        <div className="w-0.5 bg-[#B2B9C8] 3xl:h-12 2xl:h-12 xl:h-8 lg:h-8 scale-90" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='3xl:h-[80px] 3xl:w-[200px] 2xl:h-[50px] 2xl:w-[140px] xl:h-[44px] xl:w-[130px] lg:h-[60px] lg:w-[130px] 3xl:top-[280%] 3xl:left-[410%] 2xl:top-[290%] 2xl:left-[510%] xl:top-[290%] xl:left-[410%] lg:top-[290%] lg:left-[410%] flex border rounded-[8px] items-center justify-center absolute'>
                                                <h5 className='3xl:max-w-[140px] 3xl:text-base 2xl:max-w-[140px] 2xl:text-[12px] xl:max-w-[140px] xl:text-[10px] lg:max-w-[120px] lg:text-[10px] p-1 text-center'>
                                                    Nhập hàng
                                                </h5>
                                            </div>

                                            <div className='3xl:w-[200px] 2xl:w-[200px] xl:w-[200px] lg:w-[200px] flex justify-center absolute 3xl:top-[490%] 3xl:left-[420%] 2xl:top-[450%] 2xl:left-[420%] xl:top-[490%] xl:left-[420%] lg:top-[490%] lg:left-[420%]'>
                                                <div className='3xl:h-14 3xl:w-24 2xl:h-14 2xl:w-[60px] xl:h-[54px] xl:w-[54px] lg:h-14 lg:w-14 flex flex-col justify-center items-center '>
                                                    <div className="relative">
                                                        <IconRight className=" top-0 3xl:-translate-x-[46%] 3xl:-translate-y-[20%] 3xl:scale-110 2xl:-translate-x-[46%] 2xl:translate-y-[-20%] 2xl:scale-125 xl:-translate-x-[47%] xl:-translate-y-[6%] lg:-translate-x-[47%] lg:-translate-y-[6%] text-[#B2B9C8] absolute -rotate-90" />
                                                        <div className="w-0.5 bg-[#B2B9C8] 3xl:h-12 2xl:h-12 xl:h-8 lg:h-8 scale-90" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='3xl:h-[80px] 3xl:w-[200px] 2xl:h-[50px] 2xl:w-[140px] xl:h-[44px] xl:w-[130px] lg:h-[60px] lg:w-[130px] 3xl:top-[640%] 3xl:left-[410%] 2xl:top-[630%] 2xl:left-[510%] xl:top-[290%] xl:left-[410%] lg:top-[290%] lg:left-[410%] flex border rounded-[8px] items-center justify-center absolute'>
                                                <h5 className='3xl:max-w-[140px] 3xl:text-base 2xl:max-w-[140px] 2xl:text-[12px] xl:max-w-[140px] xl:text-[10px] lg:max-w-[120px] lg:text-[10px] p-1 text-center'>
                                                    Yêu cầu mua hàng
                                                </h5>
                                            </div>

                                        </div>

                                        <div className="flex items-center -space-x-4 pl-4 ">
                                            <div className="h-0.5 bg-[#3276FA] 3xl:w-4 2xl:w-2  xl:w-12 lg:w-8" />
                                        </div>
                                        <div className='flex items-center text-center max-w-[60px] text-[14px]'>
                                            Đủ kho NVL
                                        </div>
                                        <div className='3xl:w-8 2xl:w-12 xl:w-10 lg:w-8 flex flex-col justify-center items-center '>
                                            <div className="flex items-center -space-x-4">
                                                <div className="h-[2px] bg-[#3276FA] 3xl:w-6 2xl:w-9 xl:w-6 lg:w-4" />
                                                <IconRight className="text-[#3276FA] 3xl:scale-90 2xl:scale-100 xl:scale-100 lg:scale-100" />
                                            </div>
                                        </div>

                                        <div className='3xl:h-[80px] 3xl:w-[200px] 2xl:h-[50px] 2xl:w-[140px] xl:h-[44px] xl:w-[130px] lg:h-[60px] lg:w-[130px] flex border-none bg-[#E2F0FE] rounded-[8px] items-center justify-center relative'>
                                            <h5 className='3xl:max-w-[140px] 3xl:text-base 2xl:max-w-[160px] 2xl:text-[12px] xl:max-w-[140px] xl:text-[10px] lg:max-w-[120px] lg:text-[10px] p-1 text-center'>
                                                Sản xuất
                                            </h5>
                                            <h5 className='3xl:h-4 3xl:w-4 2xl:h-3 2xl:w-3 xl:h-2 xl:w-2 3xl:text-[10px] 2xl:text-[8px] xl:text-[6px] lg:text-[6px] 3xl:top-[4%] xl:top-[4%] lg:top-[6%] 3xl:left-[2%] 2xl:left-[4%] xl:left-[4%] lg:-left-[6%] rounded-full flex flex-col justify-center items-center bg-[#3276FA] absolute text-white '>
                                                3
                                            </h5>

                                        </div>

                                        <div className='3xl:w-14 2xl:w-12 xl:w-10 lg:w-8 flex flex-col justify-center items-center '>
                                            <div className="flex items-center -space-x-4">
                                                <div className="h-[2px] bg-[#3276FA] 3xl:w-10 2xl:w-9 xl:w-6 lg:w-4" />
                                                <IconRight className="text-[#3276FA] 3xl:scale-90 2xl:scale-100 xl:scale-100 lg:scale-100" />
                                            </div>
                                        </div>
                                        <div className='3xl:h-[80px] 3xl:w-[200px] 2xl:h-[50px] 2xl:w-[140px] xl:h-[44px] xl:w-[130px] lg:h-[60px] lg:w-[130px] flex border-none bg-[#E2F0FE] rounded-[8px] items-center justify-center relative'>
                                            <h5 className='3xl:max-w-[140px] 3xl:text-base 2xl:max-w-[160px] 2xl:text-[12px] xl:max-w-[140px] xl:text-[10px] lg:max-w-[120px] lg:text-[10px] p-1 text-center'>
                                                Lệnh sản xuất tổng
                                            </h5>
                                            <h5 className='3xl:h-4 3xl:w-4 2xl:h-3 2xl:w-3 xl:h-2 xl:w-2 3xl:text-[10px] 2xl:text-[8px] xl:text-[6px] lg:text-[6px] 3xl:top-[4%] xl:top-[4%] lg:top-[6%] 3xl:left-[2%] 2xl:left-[4%] xl:left-[4%] lg:-left-[6%] rounded-full flex flex-col justify-center items-center bg-[#3276FA] absolute text-white '>
                                                3.1
                                            </h5>
                                        </div>
                                        <div className='3xl:w-14 2xl:w-12 xl:w-10 lg:w-8 flex flex-col justify-center items-center '>
                                            <div className="flex items-center -space-x-4">
                                                <div className="h-[2px] bg-[#3276FA] 3xl:w-10 2xl:w-9 xl:w-6 lg:w-4" />
                                                <IconRight className="text-[#3276FA] 3xl:scale-90 2xl:scale-100 xl:scale-100 lg:scale-100" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <div className='3xl:h-[80px] 3xl:w-[200px] 2xl:h-[50px] 2xl:w-[200px] xl:h-[44px] xl:w-[130px] lg:h-[60px] lg:w-[130px] flex border-none bg-[#E2F0FE] rounded-[8px] items-center justify-center relative'>
                                        <h5 className='3xl:max-w-[140px] 3xl:text-base 2xl:max-w-[160px] 2xl:text-[12px] xl:max-w-[140px] xl:text-[10px] lg:max-w-[120px] lg:text-[10px] p-1 text-center'>
                                            Lệnh sản xuất chi tiết
                                        </h5>
                                        <h5 className='3xl:h-4 3xl:w-4 2xl:h-3 2xl:w-3 xl:h-2 xl:w-2 3xl:text-[10px] 2xl:text-[8px] xl:text-[6px] lg:text-[6px] 3xl:top-[4%] xl:top-[4%] lg:top-[6%] 3xl:left-[2%] 2xl:left-[4%] xl:left-[4%] lg:-left-[6%] rounded-full flex flex-col justify-center items-center bg-[#3276FA] absolute text-white '>
                                            3.2
                                        </h5>
                                    </div>

                                    <div className='3xl:w-[200px] 2xl:w-[200px] xl:w-[130px] lg:w-[130px] flex justify-center'>
                                        <div className='3xl:h-12 3xl:w-24 2xl:h-[34px] 2xl:w-[60px] xl:h-[32px] xl:w-[54px] lg:h-14 lg:w-14 flex flex-col justify-center items-center '>
                                            <div className="relative">
                                                <IconRight size='20' className="scale-50 bottom-[0%] 3xl:-translate-x-[46%] 3xl:translate-y-[28%] 3xl:scale-110 2xl:-translate-x-[46%] 2xl:translate-y-[22%] 2xl:scale-125 xl:-translate-x-[47%] xl:translate-y-[38%] xl:scale-95 lg:-translate-x-[47%] lg:translate-y-[22%] lg:scale-50 text-[#3276FA] absolute rotate-90" />
                                                <div className="w-[2px] bg-[#3276FA] 3xl:h-10 2xl:h-5 xl:h-6 lg:h-6" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className='3xl:h-[80px] 3xl:w-[200px] 2xl:h-[50px] 2xl:w-[200px] xl:h-[44px] xl:w-[130px] lg:h-[60px] lg:w-[130px] flex border-none bg-[#E2F0FE] rounded-[8px] items-center justify-center relative p-2'>
                                        <h5 className='3xl:max-w-[140px] 3xl:text-base 2xl:max-w-[160px] 2xl:text-[12px] xl:max-w-[140px] xl:text-[10px] lg:max-w-[120px] lg:text-[10px] p-1 text-center'>
                                            Hoàn thành công đoạn bán thành phẩm
                                        </h5>
                                        <h5 className='3xl:h-4 3xl:w-4 2xl:h-3 2xl:w-3 xl:h-2 xl:w-2 3xl:text-[10px] 2xl:text-[8px] xl:text-[6px] lg:text-[6px] 3xl:top-[4%] xl:top-[4%] lg:top-[6%] 3xl:left-[2%] 2xl:left-[4%] xl:left-[4%] lg:-left-[6%] rounded-full flex flex-col justify-center items-center bg-[#3276FA] absolute text-white '>
                                            4
                                        </h5>
                                    </div>

                                    <div className='3xl:w-[200px] 2xl:w-[200px] xl:w-[130px] lg:w-[130px] flex justify-center'>
                                        <div className='3xl:h-12 3xl:w-24 2xl:h-[34px] 2xl:w-[60px] xl:h-[32px] xl:w-[54px] lg:h-14 lg:w-14 flex flex-col justify-center items-center '>
                                            <div className="relative">
                                                <IconRight size='20' className="scale-50 bottom-[0%] 3xl:-translate-x-[46%] 3xl:translate-y-[28%] 3xl:scale-110 2xl:-translate-x-[46%] 2xl:translate-y-[22%] 2xl:scale-125 xl:-translate-x-[47%] xl:translate-y-[38%] xl:scale-95 lg:-translate-x-[47%] lg:translate-y-[22%] lg:scale-50 text-[#3276FA] absolute rotate-90" />
                                                <div className="w-[2px] bg-[#3276FA] 3xl:h-10 2xl:h-5 xl:h-6 lg:h-6" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className='3xl:h-[80px] 3xl:w-[200px] 2xl:h-[50px] 2xl:w-[200px] xl:h-[44px] xl:w-[130px] lg:h-[60px] lg:w-[130px] flex border-none bg-[#E2F0FE] rounded-[8px] items-center justify-center relative'>
                                        <h5 className='3xl:max-w-[140px] 3xl:text-base 2xl:max-w-[160px] 2xl:text-[12px] xl:max-w-[140px] xl:text-[10px] lg:max-w-[120px] lg:text-[10px] p-1 text-center'>
                                            Hoàn thành công đoạn thành phẩm
                                        </h5>
                                        <h5 className='3xl:h-4 3xl:w-4 2xl:h-3 2xl:w-3 xl:h-2 xl:w-2 3xl:text-[10px] 2xl:text-[8px] xl:text-[6px] lg:text-[6px] 3xl:top-[4%] xl:top-[4%] lg:top-[6%] 3xl:left-[2%] 2xl:left-[4%] xl:left-[4%] lg:-left-[6%] rounded-full flex flex-col justify-center items-center bg-[#3276FA] absolute text-white '>
                                            5
                                        </h5>
                                    </div>

                                    <div className='3xl:w-[200px] 2xl:w-[200px] xl:w-[130px] lg:w-[130px] flex justify-center'>
                                        <div className='3xl:h-12 3xl:w-24 2xl:h-[34px] 2xl:w-[60px] xl:h-[32px] xl:w-[54px] lg:h-14 lg:w-14 flex flex-col justify-center items-center '>
                                            <div className="relative">
                                                <IconRight size='20' className="scale-50 bottom-[0%] 3xl:-translate-x-[46%] 3xl:translate-y-[28%] 3xl:scale-110 2xl:-translate-x-[46%] 2xl:translate-y-[22%] 2xl:scale-125 xl:-translate-x-[47%] xl:translate-y-[38%] xl:scale-95 lg:-translate-x-[47%] lg:translate-y-[22%] lg:scale-50 text-[#3276FA] absolute rotate-90" />
                                                <div className="w-[2px] bg-[#3276FA] 3xl:h-10 2xl:h-5 xl:h-6 lg:h-6" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className='3xl:h-[80px] 3xl:w-[200px] 2xl:h-[50px] 2xl:w-[200px] xl:h-[44px] xl:w-[130px] lg:h-[60px] lg:w-[130px] flex border-none bg-[#E2F0FE] rounded-[8px] items-center justify-center relative'>
                                        <h5 className='3xl:max-w-[140px] 3xl:text-base 2xl:max-w-[160px] 2xl:text-[12px] xl:max-w-[140px] xl:text-[10px] lg:max-w-[120px] lg:text-[10px] p-1 text-center'>
                                            Hoàn thành sản xuất
                                        </h5>
                                        <h5 className='3xl:h-4 3xl:w-4 2xl:h-3 2xl:w-3 xl:h-2 xl:w-2 3xl:text-[10px] 2xl:text-[8px] xl:text-[6px] lg:text-[6px] 3xl:top-[4%] xl:top-[4%] lg:top-[6%] 3xl:left-[2%] 2xl:left-[4%] xl:left-[4%] lg:-left-[6%] rounded-full flex flex-col justify-center items-center bg-[#3276FA] absolute text-white '>
                                            6
                                        </h5>
                                    </div>
                                    <div className='3xl:w-[200px] 2xl:w-[200px] xl:w-[130px] lg:w-[130px] flex justify-center'>
                                        <div className='3xl:h-12 3xl:w-24 2xl:h-[34px] 2xl:w-[60px] xl:h-[32px] xl:w-[54px] lg:h-14 lg:w-14 flex flex-col justify-center items-center '>
                                            <div className="relative">
                                                <IconRight size='20' className="scale-50 bottom-[0%] 3xl:-translate-x-[46%] 3xl:translate-y-[28%] 3xl:scale-110 2xl:-translate-x-[46%] 2xl:translate-y-[22%] 2xl:scale-125 xl:-translate-x-[47%] xl:translate-y-[38%] xl:scale-95 lg:-translate-x-[47%] lg:translate-y-[22%] lg:scale-50 text-[#3276FA] absolute rotate-90" />
                                                <div className="w-[2px] bg-[#3276FA] 3xl:h-10 2xl:h-5 xl:h-6 lg:h-6" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className='3xl:w-[200px] 2xl:w-[200px] xl:w-[130px] lg:w-[120px] flex justify-center'>
                                        <div className=' 3xl:h-[80px] 3xl:w-[80px] 2xl:h-[60px] 2xl:w-[60px] xl:h-[54px] xl:w-[54px] lg:h-14 lg:w-14 rounded-full flex flex-col justify-center items-center bg-[#3276FA] text-white'>
                                            <h5 className='3xl:text-[16px] 2xl:text-[14px] xl:text-[12px] lg:text-[10px] text-center'>Kết thúc</h5>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="flex justify-start 2xl:p-6 2xl:mx-2 xl:p-4 xl:mx-4 lg:px-1 lg:mx-6 absolute 3xl:bottom-[0%] bottom-[0%]">
                        <div className='flex space-x-3 '>
                            <Image alt="" src="/logo_1.png" width={64} height={20} className="select-none pointer-events-none object-contain w-auto h-auto" loading="lazy" crossOrigin="anonymous" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
                            <h6 className='2xl:font-[300] xl:font-[300] lg:font-[200]'>Quy trình quản lí sản xuất</h6>
                        </div>

                    </div>

                    <Image alt="" src="/process/Logo-BG.png" width={1200} height={420} className="3xl:w-[600px] 2xl:w-[500px] xl:w-[400px] lg:w-[300px] left-[2%] bottom-[8%] absolute select-none pointer-events-none object-contain " loading="lazy" crossOrigin="anonymous" placeholder="blur" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
                </div>
            </div>
        </React.Fragment >
    )
}

export default Index