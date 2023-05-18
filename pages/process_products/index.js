import React from 'react'
import Head from 'next/head';
import Image from 'next/image';

import { ArrowRight2 as IconRight } from "iconsax-react";

const Index = () => {
    return (
        <React.Fragment>
            <Head>
                <title>Quy trình bán hàng</title>
            </Head>
            <div className='xl:px-10 px-3 xl:pt-24 pt-[88px] pb-10 space-y-2.5 2xl:h-screen xl:h-screen lg:h-[110vh] overflow-hidden flex flex-col justify-between'>
                <div className='space-y-3 overflow-hidden p-4'>
                    <div className='flex space-x-3 xl:text-[14.5px] text-[12px]'>
                        <h6 className='text-[#141522]/40'>Trang chủ</h6>
                        <span className='text-[#141522]/40'>/</span>
                        <h6 className='text-[#141522]/40'>Quy trình</h6>
                        <span className='text-[#141522]/40'>/</span>
                        <h6 >Quy trình bán hàng</h6>
                    </div>
                    <h2 className='xl:text-3xl lg:text-2xl text-xl font-medium '>Quy Trình Bán Hàng</h2>
                </div>

                <div className='h-[100%] w-[100%] pt-8 relative border border-slate-100 flex-col flex'>
                    <div className='h-full w-full rounded-lg relative z-10 py-10 px-10 space-y-4 flex flex-col justify-between'>
                        <div className='h-[100%] w-full space-y-6'>
                            <div className='h-full w-full 3xl:ml-16 2xl:ml-0 xl:ml-5 xl:pb-16 lg:pb-32 flex flex-row justify-start items-center gap-2'>
                                <div className='3xl:h-24 3xl:w-24 2xl:h-[90px] 2xl:w-[90px] xl:h-20 xl:w-20 lg:h-14 lg:w-14 rounded-full flex flex-col justify-center items-center bg-[#3276FA] text-white'>
                                    <h5 className='3xl:text-xl 2xl:text-[16px] xl:text-[15px] lg:text-[10px] text-center'>Bắt đầu</h5>
                                </div>

                                <div className="flex items-center -space-x-4">
                                    <div className="h-0.5 bg-[#3276FA] 2xl:w-20 xl:w-12 lg:w-8" />
                                    <IconRight className="text-[#3276FA]" />
                                </div>

                                <div className='2xl:h-[96px] 2xl:w-[180px] xl:h-[64px] xl:w-[100px] lg:h-[60px] lg:w-[80px] flex space-x-3 border-none bg-[#E2F0FE] rounded-md  items-center justify-center relative'>
                                    <h5>Báo giá </h5>
                                    <h5 className='h-4 w-4 top-[8%] 2xl:-left-[2%] xl:-left-[2%] lg:-left-[2%] 2xl:text-sm xl:text-sm lg:text-[12px] rounded-full flex flex-col justify-center items-center bg-[#3276FA] absolute text-white '>1</h5>
                                </div>
                                <div className="flex items-center -space-x-5">
                                    <div className="h-0.5 bg-[#3276FA] 2xl:w-20 xl:w-12 lg:w-8" />
                                    <IconRight
                                        size="32"
                                        color="#3276FA"
                                        variant="Outline"
                                    />
                                </div>

                                <div className='flex space-x-3 border-none bg-[#E2F0FE] rounded-md 2xl:h-[96px] 2xl:w-[180px] xl:h-[64px] xl:w-[130px] lg:h-[60px] lg:w-[130px] items-center justify-center relative'>
                                    <h5>Tạo đơn hàng</h5>
                                    <h5 className='h-4 w-4 top-[8%] 2xl:-left-[2%] xl:-left-[2%] lg:-left-[2%] 2xl:text-sm xl:text-sm lg:text-[12px] rounded-full flex flex-col justify-center items-center bg-[#3276FA] absolute text-white '>2</h5>

                                    {/* top image đơn hàng*/}
                                    <div className="flex flex-col items-center -space-y-5 absolute 2xl:-top-[50%] xl:-top-[80%] lg:-top-[65%] ">
                                        <IconRight
                                            className="-rotate-90"
                                            size="32"
                                            color="#B2B9C8"
                                            variant="Outline"
                                        />
                                        <div className="w-0.5 bg-[#B2B9C8] 2xl:h-8 xl:h-8 lg:h-6" />
                                    </div>

                                    <div className="absolute 2xl:-top-[150%] xl:-top-[195%] lg:-top-[170%]">
                                        <Image
                                            alt=""
                                            src="/process_products/Subtract.png"
                                            width={600}
                                            height={220}
                                            className="object-contain 2xl:h-[100px] xl:h-[80px] lg:h-[70px] relative"
                                            loading="lazy"
                                            crossOrigin="anonymous"
                                            placeholder="blur"
                                            blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                        />
                                        <span
                                            className="absolute select-none pointer-events-none 2xl:top-[30%] xl:top-[32%] lg:top-[26%] left-[52%] 2xl:text-[10px] xl:text-[8px] lg:text-[7px] 2xl:p-3 xl:p-2 lg:p-2"
                                            style={{
                                                transform: "translate(-60%, -60%)",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            <span className='uppercase'>
                                                Đơn đặt hàng
                                            </span>
                                            <Image
                                                alt=""
                                                src="/process_products/Frame.png"
                                                width={600}
                                                height={220}
                                                className="object-contain 2xl:-bottom-[50%] 2xl:h-[30px] xl:-bottom-[60%] xl:h-[30px] lg:-bottom-[60%] lg:h-[24px] left-[6%] absolute"
                                                loading="lazy"
                                                crossOrigin="anonymous"
                                                placeholder="blur"
                                                blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                            />
                                        </span>
                                    </div>

                                    {/* bottom */}
                                    <div className="flex flex-col items-center absolute top-[80%] left-[45%]">
                                        {/* dsdsdsd */}
                                        <div className="3xl:w-[180px] 3xl:h-[218px] 2xl:w-[180px] 2xl:h-[200px] xl:w-[120px] xl:h-44 lg:w-[100px] lg:h-44 border rounded-bl-[20px] border-dashed border-[#B2B9C8] border-t-0 border-r-0 rounded 2xl:mt-6 xl:mt-4 lg:mt-3">
                                            <div className="border-b rounded-bl-[20px] border-dashed border-[#B2B9C8] text-center relative 3xl:top-[25%] 2xl:top-[25%] xl:top-[28%] lg:top-[32%] 2xl:text-[16px] xl:text-[16px] lg:text-[14px]">
                                                Giữ kho
                                                <IconRight
                                                    className="text-[#B2B9C8] absolute top-0 right-0 translate-x-[50%] 2xl:translate-y-[50%] xl:translate-y-[50%] lg:translate-y-[40%] "
                                                    size="24"
                                                    variant="Outline"
                                                />
                                            </div>

                                            <IconRight
                                                className="text-[#B2B9C8] absolute bottom-0 right-0 translate-x-[50%] translate-y-[50%]"
                                                size="24"
                                                variant="Outline"
                                            />

                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center -space-x-5">
                                    <div className="h-0.5 bg-[#3276FA] 2xl:w-20 xl:w-12 lg:w-8" />
                                    <IconRight
                                        size="32"
                                        color="#3276FA"
                                        variant="Outline"
                                    />
                                </div>

                                <div className='flex space-x-3 border-none bg-[#E2F0FE] rounded-md 2xl:h-[96px] 2xl:w-[180px] xl:h-[64px] xl:w-[200px] lg:h-[60px] lg:w-[180px] items-center justify-center relative'>
                                    <h5>Xuất kho giao hàng</h5>
                                    <h5 className='h-4 w-4 top-[8%] 2xl:-left-[2%] xl:-left-[2%] lg:-left-[2%] 2xl:text-sm xl:text-sm lg:text-[12px] rounded-full flex flex-col justify-center items-center bg-[#3276FA] absolute text-white '>3</h5>


                                    {/* bottom xuất kho hàng*/}
                                    <div className="absolute 3xl:top-[105%] 3xl:left-[42%] 2xl:top-[105%] 2xl:left-[42%] xl:top-[110%] xl:left-[40%] lg:top-[115%] lg:left-[40%]">
                                        <div className=" border-[#B2B9C8] border-t-0 border-r-0 border-y-0 absolute mb-2">
                                            <IconRight
                                                className="text-[#B2B9C8] absolute top-0 left-0 -translate-x-[47%] -translate-y-[36%] -rotate-90"
                                                size="32"
                                            />
                                            <div className="w-0.5 bg-[#B2B9C8] 2xl:h-7 xl:h-8 lg:h-8" />
                                        </div>
                                    </div>
                                    <div className='flex border rounded-md 3xl:h-[96px] 3xl:w-[180px] 2xl:h-[84px] 2xl:w-[165px] xl:h-[64px] xl:w-[200px] lg:h-[60px] lg:w-[170px] 3xl:top-[140%] 3xl:right-[2%] 2xl:top-[140%] 2xl:-left-[6%] xl:top-[170%] xl:right-[2%] lg:top-[180%] lg:-right-[2%] items-center justify-center absolute  '>
                                        <h5>Kho hàng</h5>
                                    </div>

                                    <div className="absolute 3xl:top-[245%] 3xl:left-[40%] 2xl:top-[235%] 2xl:left-[42%] xl:top-[280%] xl:left-[40%] lg:top-[290%] lg:left-[40%]">
                                        <div className=" border-[#B2B9C8] border-t-0 border-r-0 border-y-0 absolute mb-2">
                                            <IconRight
                                                className="text-[#B2B9C8] absolute top-0 left-0 -translate-x-[47%] -translate-y-[36%] -rotate-90"
                                                size="32"
                                            />
                                            <div className="w-0.5 bg-[#B2B9C8] 2xl:h-7 xl:h-8 lg:h-8" />
                                        </div>
                                    </div>
                                    <div className='flex border rounded-md 3xl:h-[96px] 3xl:w-[180px] 2xl:h-[84px] 2xl:w-[165px] xl:h-[64px] xl:w-[200px] lg:h-[60px] lg:w-[170px] 3xl:top-[280%] 3xl:-left-[8%] 2xl:top-[270%]  2xl:-left-[6%] xl:top-[335%] xl:right-[2%] lg:top-[350%] lg:-right-[2%] items-center justify-center absolute'>
                                        <h5>Sản xuất</h5>
                                    </div>

                                </div>

                                <div className="flex items-center -space-x-5 ">
                                    <div className="h-0.5 bg-[#3276FA] 2xl:w-20 xl:w-12 lg:w-8" />
                                    <IconRight
                                        size="32"
                                        color="#3276FA"
                                        variant="Outline"
                                    />
                                </div>

                                <div className='flex space-x-3 border-none bg-[#E2F0FE] rounded-md 2xl:h-[96px] 2xl:w-[180px] xl:h-[64px] xl:w-[200px] lg:h-[60px] lg:w-[180px]  items-center justify-center relative'>
                                    <h5>Công nợ</h5>
                                    <h5 className='h-4 w-4 top-[8%] 2xl:-left-[2%] xl:-left-[2%] lg:-left-[2%] 2xl:text-sm xl:text-sm lg:text-[12px] rounded-full flex flex-col justify-center items-center bg-[#3276FA] absolute text-white '>4</h5>

                                    <div className="flex flex-col items-center absolute 2xl:top-[110%] 2xl:left-[40%] xl:top-[110%] xl:left-[45%] lg:top-[120%] lg:left-[45%]">
                                        <div className="2xl:h-8 xl:h-8 lg:h-8 border border-dashed border-[#B2B9C8] border-y-0 border-r-0">
                                            <IconRight
                                                className="text-[#B2B9C8] absolute top-0 left-0 -translate-x-[50%] -translate-y-[50%] -rotate-90"
                                                size="24"
                                                variant="Outline"
                                            />
                                        </div>
                                    </div>

                                    <div className='flex border rounded-md 3xl:h-[84px] 3xl:w-[180px] 2xl:h-[84px] 2xl:w-[160px] xl:h-[64px] xl:w-[200px] lg:h-[60px] lg:w-[170px] 2xl:top-[140%] 2xl:right-[2%] xl:top-[170%] xl:right-[2%] lg:top-[180%] lg:-right-[2%]  items-center justify-center absolute  bg-[#FDE7AE]'>
                                        <h5>Trả lại hàng bán</h5>
                                        <h5 className='h-4 w-4 top-[8%] 2xl:left-[4%] xl:left-[4%] lg:left-[1%] 2xl:text-sm xl:text-sm lg:text-[12px] rounded-full flex flex-col justify-center items-center bg-[#DC6803] absolute text-white '>5</h5>
                                    </div>
                                    <div className="flex flex-col items-center absolute 3xl:top-[185%] 3xl:-left-[60%] 2xl:top-[185%] 2xl:-left-[65%] xl:top-[220%] xl:-left-[40%] lg:top-[230%] lg:-left-[24%]">
                                        <div className='absolute 3xl:w-[80px] 2xl:w-[88px] xl:w-[50px] xl:-left-[80%] lg:w-[40px] border-b border-dashed border-[#B2B9C8] text-center'>
                                            <IconRight
                                                className="text-[#B2B9C8] absolute top-0 left-0 -rotate-180 -translate-x-[50%] -translate-y-[50%]"
                                                size="24"
                                                variant="Outline"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center -space-x-5">
                                    <div className="h-0.5 bg-[#3276FA] 2xl:w-20 xl:w-12 lg:w-8" />
                                    <IconRight
                                        size="32"
                                        color="#3276FA"
                                        variant="Outline"
                                    />
                                </div>

                                <div className="3xl:h-24 3xl:w-24 2xl:h-[90px] 2xl:w-[90px] xl:h-20 xl:w-20 lg:h-14 lg:w-14 rounded-full flex flex-col justify-center items-center bg-[#3276FA] text-white">
                                    <h5 className='3xl:text-xl 2xl:text-[16px] xl:text-[15px] lg:text-[10px] text-center'>Kết thúc</h5>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-start 2xl:p-6 2xl:mx-2 xl:p-4 xl:mx-4 lg:px-1 lg:mx-6">
                        <div className='flex space-x-3 '>
                            <Image alt="" src="/logo_1.png" width={64} height={20} className="select-none pointer-events-none object-contain w-auto h-auto" loading="lazy" crossOrigin="anonymous" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
                            <h6 className='2xl:font-[300] xl:font-[300] lg:font-[200]'>Quy trình bán hàng</h6>
                        </div>

                    </div>
                    <Image alt="" src="/process/Logo-BG.png" width={1200} height={420} className="3xl:w-[600px] 2xl:w-[500px] xl:w-[400px] lg:w-[300px] left-[2%] bottom-[8%] absolute select-none pointer-events-none object-contain " loading="lazy" crossOrigin="anonymous" placeholder="blur" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
                </div>
            </div>
        </React.Fragment>
    )
}

export default Index