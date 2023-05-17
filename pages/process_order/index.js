import React from 'react';
import Head from 'next/head';
import Image from 'next/image';

import { ArrowRight2 as IconRight } from "iconsax-react";

const Index = () => {
    return (
        <React.Fragment>
            <Head>
                <title>Quy trình mua hàng - nhập kho</title>
            </Head>
            <div className='xl:px-10 px-3 xl:pt-24 pt-[88px] pb-10 space-y-2.5 h-screen overflow-hidden flex flex-col justify-between'>
                <div className='space-y-3 overflow-hidden p-4'>
                    <div className='flex space-x-3 xl:text-[14.5px] text-[12px]'>
                        <h6 className='text-[#141522]/40'>Trang chủ</h6>
                        <span className='text-[#141522]/40'>/</span>
                        <h6 className='text-[#141522]/40'>Quy trình</h6>
                        <span className='text-[#141522]/40'>/</span>
                        <h6 >Quy trình mua hàng - nhập kho</h6>
                    </div>
                    <h2 className='xl:text-3xl text-xl font-medium '>Quy Trình Mua Hàng - Nhập Kho</h2>
                </div>

                <div className='h-[100%] w-[100%] relative border border-slate-100 flex-col flex'>
                    <div className='h-full w-full rounded-lg relative z-10 py-10 px-10 space-y-4 flex flex-col justify-between'>
                        <div className='h-[90%] w-full space-y-6'>
                            <div className='2xl:h-[100%] h-[100%] w-[100%] 2xl:ml-28 xl:ml-8  flex flex-row justify-start items-center gap-2'>
                                <div className='2xl:h-24 2xl:w-24 xl:h-20 xl:w-20 lg:h-20 lg:w-20 rounded-full flex flex-col justify-center items-center bg-[#3276FA] text-white'>
                                    <h5 className='2xl:text-xl xl:text-[15px] lg:text-lg text-center'>Bắt đầu</h5>
                                </div>

                                <div className="flex items-center -space-x-4">
                                    <div className="h-0.5 bg-[#3276FA] 2xl:w-20 xl:w-12 lg:w-8" />
                                    <IconRight className="text-[#3276FA]" />
                                </div>

                                <div className='2xl:h-[96px] 2xl:w-[180px] xl:h-[84px] xl:w-[140px] lg:h-[84px] lg:w-[120px] flex text-center space-x-3 border-none bg-[#E2F0FE] rounded-md  items-center justify-center relative'>
                                    <h5 className='2xl:max-w-[180px] xl:max-w-[140px] lg:max-w-[120px]'>Yêu cầu mua hàng </h5>
                                    <h5 className='h-4 w-4 top-[8%] 2xl:-left-[2%] xl:-left-[2%] lg:-left-[2%] 2xl:text-sm xl:text-sm lg:text-[12px] rounded-full flex flex-col justify-center items-center bg-[#3276FA] absolute text-white '>1</h5>

                                    <div className="flex flex-col items-center absolute 2xl:top-[110%] 2xl:left-[40%] xl:top-[110%] xl:left-[40%] lg:top-[110%] lg:left-[40%]">
                                        <div className="2xl:w-[180px] 2xl:h-14 xl:h-16 xl:w-[200px] lg:w-[250px] lg:h-14 border border-dashed border-[#B2B9C8] border-y-0 border-r-0">
                                            <IconRight
                                                className="text-[#B2B9C8] absolute top-0 left-0 -translate-x-[50%] -translate-y-[50%] -rotate-90"
                                                size="24"
                                                variant="Outline"
                                            />
                                        </div>
                                    </div>

                                    <div className='flex border rounded-md 2xl:h-[96px] 2xl:w-[180px] xl:h-[84px] xl:w-[140px] lg:h-[84px] lg:w-[120px] 2xl:top-[175%] 2xl:right-[2%] xl:top-[190%] xl:right-[2%] lg:top-[180%] lg:right-[2%] items-center justify-center absolute'>
                                        <h5>Sản xuất</h5>
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

                                <div className='flex text-center space-x-3 border-none bg-[#E2F0FE] rounded-md 2xl:h-[96px] 2xl:w-[180px] xl:h-[84px] xl:w-[140px] lg:h-[84px] lg:w-[120px] items-center justify-center relative'>
                                    <h5 className='2xl:max-w-[180px] xl:max-w-[140px] lg:max-w-[120px]'>Tạo đơn đặt hàng (PO)</h5>
                                    <h5 className='h-4 w-4 top-[8%] 2xl:-left-[2%] xl:-left-[2%] lg:-left-[2%] 2xl:text-sm xl:text-sm lg:text-[12px] rounded-full flex flex-col justify-center items-center bg-[#3276FA] absolute text-white '>2</h5>

                                    {/* top image đơn hàng*/}
                                    <div className="flex flex-col items-center -space-y-5 absolute 2xl:-top-[50%] xl:-top-[60%] lg:-top-[50%] ">
                                        <IconRight
                                            className="-rotate-90"
                                            size="32"
                                            color="#B2B9C8"
                                            variant="Outline"
                                        />
                                        <div className="w-0.5 bg-[#B2B9C8] 2xl:h-8 xl:h-8 lg:h-6" />
                                    </div>

                                    <div className="absolute 2xl:-top-[150%] xl:-top-[180%] lg:-top-[170%]">
                                        <Image
                                            alt=""
                                            src="/process_products/Subtract.png"
                                            width={600}
                                            height={220}
                                            className="object-contain 2xl:w-[400px] 2xl:h-[100px] xl:w-[220px] xl:h-[100px] lg:w-[220px] lg:h-[100px] relative"
                                            loading="lazy"
                                            crossOrigin="anonymous"
                                            placeholder="blur"
                                            blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                        />
                                        <span
                                            className="absolute select-none pointer-events-none 2xl:top-[30%] xl:top-[28%] lg:top-[28%] left-[52%] 2xl:text-[10px] xl:text-[8px] lg:text-[9px] 2xl:mb-20 xl:mb-20 lg:mb-10 2xl:p-3 xl:p-3 lg:p-2"
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
                                                className="object-contain 2xl:w-[300px] xl:w-[100px] h-[30px] -bottom-[50%] left-[6%] absolute"
                                                loading="lazy"
                                                crossOrigin="anonymous"
                                                placeholder="blur"
                                                blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                            />
                                        </span>
                                    </div>

                                    {/* bottom */}
                                    <div className="flex flex-col items-center absolute top-[105%] left-[45%]">
                                        {/* dsdsdsd */}
                                        <div className="2xl:w-[180px] 2xl:h-64 xl:w-[110px] xl:h-64 lg:w-[100px] lg:h-48 border border-dashed border-[#B2B9C8] border-t-0 border-r-0 rounded ">
                                            <div className="border-b border-dashed border-[#B2B9C8] text-center relative 2xl:top-[35%] xl:top-[35%] lg:top-[40%] 2xl:text-[16px] xl:text-[16px] lg:text-[14px]">
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

                                <div className='flex space-x-3 border-none bg-[#E2F0FE] rounded-md 2xl:h-[96px] 2xl:w-[180px] xl:h-[84px] xl:w-[200px] lg:h-[84px] lg:w-[180px] items-center justify-center relative'>
                                    <h5>Nhập kho</h5>
                                    <h5 className='h-4 w-4 top-[8%] 2xl:-left-[2%] xl:-left-[2%] lg:-left-[2%] 2xl:text-sm xl:text-sm lg:text-[12px] rounded-full flex flex-col justify-center items-center bg-[#3276FA] absolute text-white '>3</h5>

                                    {/* bottom xuất kho hàng*/}
                                    <div className="absolute 2xl:top-[105%] 2xl:left-[40%] xl:top-[110%] xl:left-[45%] lg:top-[115%] lg:left-[40%]">
                                        <div className="2xl:w-[250px] 2xl:h-16 xl:w-[250px] xl:h-16 lg:w-[250px] lg:h-14  border border-[#B2B9C8] border-t-0 border-r-0 border-y-0 absolute mb-2">
                                            <IconRight
                                                className="text-[#B2B9C8] absolute top-0 left-0 -translate-x-[52%] -translate-y-[40%] -rotate-90"
                                                size="24"
                                                variant="Outline"
                                            />
                                        </div>
                                    </div>
                                    <div className='flex border rounded-md 2xl:h-[84px] 2xl:w-[180px] xl:h-[64px] xl:w-[200px] lg:h-[60px] lg:w-[180px] 2xl:top-[180%] 2xl:right-[2%] xl:top-[230%] xl:right-[2%] lg:top-[220%] lg:right-[2%] items-center justify-center absolute  '>
                                        <h5>Kho hàng</h5>
                                    </div>

                                    <div className="absolute 2xl:-bottom-[220%] 2xl:left-[40%] xl:-bottom-[350%] xl:left-[45%] lg:-bottom-[280%] lg:left-[40%]">
                                        <div className="2xl:w-[250px] 2xl:h-8 xl:w-[250px] xl:h-16 lg:w-[250px] lg:h-6 border border-[#B2B9C8] border-t-0 border-r-0 border-y-0 relative mb-2">
                                            <IconRight
                                                className="text-[#B2B9C8] absolute top-0 left-0 -translate-x-[52%] -translate-y-[40%] -rotate-90"
                                                size="24"
                                                variant="Outline"
                                            />
                                        </div>
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

                                <div className='flex space-x-3 border-none bg-[#E2F0FE] rounded-md 2xl:h-[96px] 2xl:w-[180px] xl:h-[84px] xl:w-[200px] lg:h-[84px] lg:w-[180px]  items-center justify-center relative'>
                                    <h5 className='2xl:max-w-[180px] xl:max-w-[200px] lg:max-w-[180px]'>Công nợ</h5>
                                    <h5 className='h-4 w-4 top-[8%] 2xl:-left-[2%] xl:-left-[2%] lg:-left-[2%] 2xl:text-sm xl:text-sm lg:text-[12px] rounded-full flex flex-col justify-center items-center bg-[#3276FA] absolute text-white '>4</h5>



                                    <div className='flex border rounded-md 2xl:h-[84px] 2xl:w-[180px] xl:h-[64px] xl:w-[200px] lg:h-[60px] lg:w-[180px] 2xl:top-[180%] 2xl:right-[2%] xl:top-[230%] xl:right-[2%] lg:top-[220%] lg:right-[2%]  items-center justify-center absolute  bg-[#FDE7AE]'>
                                        <h5>Trả lại hàng bán</h5>
                                        <h5 className='h-4 w-4 top-[8%] 2xl:left-[4%] xl:left-[4%] lg:left-[1%] 2xl:text-sm xl:text-sm lg:text-[12px] rounded-full flex flex-col justify-center items-center bg-[#DC6803] absolute text-white '>5</h5>
                                    </div>
                                    <div className="flex flex-col items-center absolute 2xl:top-[225%] 2xl:-left-[60%] xl:top-[280%] xl:-left-[40%] lg:top-[270%] lg:-left-[35%]">
                                        <div className='absolute 2xl:w-[80px] 2xl:-left-[105%] 2xl:-bottom-[90%] xl:w-[50px] xl:-left-[80%] xl:-bottom-[70%] lg:w-[40px] lg:-left-[80%] lg:-bottom-[70%] border-b border-dashed border-[#B2B9C8] text-center -bottom-[55%] right-[160%]'>
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

                                <div className="2xl:h-24 2xl:w-24 xl:h-20 xl:w-20 lg:h-20 lg:w-20 rounded-full flex flex-col justify-center items-center bg-[#3276FA] text-white">
                                    <h5 className='2xl:text-xl xl:text-[15px] lg:text-lg text-center'>Kết thúc</h5>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-start p-6 m-2">
                        <div className='flex space-x-3 '>
                            <Image alt="" src="/logo_1.png" width={64} height={20} className="select-none pointer-events-none object-contain w-auto h-auto" loading="lazy" crossOrigin="anonymous" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
                            <h6 className='font-[300]'>Quy trình mua hàng - nhập kho</h6>
                        </div>

                    </div>
                    <Image alt="" src="/process/Logo-BG.png" width={1200} height={420} className="-mt-1 absolute select-none pointer-events-none object-contain 1xl:w-[800px] w-[400px] left-[2%] bottom-[8%] h-auto" loading="lazy" crossOrigin="anonymous" placeholder="blur" blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
                </div>
            </div>
        </React.Fragment>
    );
};

export default Index;