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
            <div className='xl:px-10 px-3 xl:pt-24 pt-[88px] pb-10 space-y-2.5 2xl:h-screen xl:h-screen lg:h-[110vh] overflow-hidden flex flex-col justify-between'>
                <div className='space-y-3 overflow-hidden p-4'>
                    <div className='flex space-x-3 xl:text-[14.5px] text-[12px]'>
                        <h6 className='text-[#141522]/40'>Trang chủ</h6>
                        <span className='text-[#141522]/40'>/</span>
                        <h6 className='text-[#141522]/40'>Quy trình</h6>
                        <span className='text-[#141522]/40'>/</span>
                        <h6 >Quy trình quản lí sản xuất</h6>
                    </div>
                    <h2 className='xl:text-3xl lg:text-2xl text-xl font-medium '>Quy Trình Quản Lý Sản Xuất</h2>
                </div>

                <div className='h-[100%] w-[100%] pt-8 relative border border-slate-100 flex-col flex'>
                    <div className='h-full w-full rounded-lg relative z-10 px-10 space-y-1 flex flex-row'>
                        <div class="basis-full">
                            <div className='3xl:w-[160px] w-[160px] flex justify-center'>
                                <div className=' 3xl:h-20 3xl:w-20 2xl:h-[60px] 2xl:w-[60px] xl:h-[54px] xl:w-[54px] lg:h-14 lg:w-14 rounded-full flex flex-col justify-center items-center bg-[#3276FA] text-white'>
                                    <h5 className='3xl:text-[16px] 2xl:text-[14px] xl:text-[12px] lg:text-[10px] text-center'>Bắt đầu</h5>
                                </div>
                            </div>

                            <div className='3xl:w-[160px] w-[160px] flex justify-center'>
                                <div className='3xl:h-[68px] 3xl:w-24 2xl:h-[60px] 2xl:w-[60px] xl:h-[54px] xl:w-[54px] lg:h-14 lg:w-14 flex flex-col justify-center items-center '>
                                    <div className="relative">
                                        <IconRight className=" bottom-[0%] 3xl:-translate-x-[47%] 3xl:translate-y-[35%] 3xl:scale-110 2xl:-translate-x-[46%] 2xl:-translate-y-[14%] 2xl:scale-125 xl:-translate-x-[47%] xl:-translate-y-[6%] lg:-translate-x-[47%] lg:-translate-y-[6%] text-[#3276FA] absolute rotate-90" />
                                        <div className="w-0.5 bg-[#3276FA] 3xl:h-14 2xl:h-10 xl:h-8 lg:h-8" />
                                    </div>
                                </div>
                            </div>

                            <div className='flex'>
                                <div>
                                    <div class="basis-3/4 flex ">
                                        <div className='3xl:h-[84px] 3xl:w-[160px] 2xl:h-[96px] 2xl:w-[180px] xl:h-[64px] xl:w-[130px] lg:h-[60px] lg:w-[130px] flex space-x-3 border-none bg-[#E2F0FE] rounded-md  items-center justify-center relative'>
                                            <h5 className='3xl:max-w-[160px] 2xl:max-w-[180px] xl:max-w-[140px] lg:max-w-[120px] p-1 text-center'>Kế hoạch sản xuất</h5>
                                            <h5 className='xl:h-4 xl:w-4 lg:h-3 lg:w-3 xl:text-[10px] lg:text-[10px] xl:top-[8%] lg:top-[6%] 2xl:-left-[2%] xl:-left-[6%] lg:-left-[6%] rounded-full flex flex-col justify-center items-center bg-[#3276FA] absolute text-white '>1</h5>
                                        </div>

                                        <div className="flex items-center -space-x-4">
                                            <div className="h-0.5 bg-[#3276FA] 3xl:w-10 2xl:w-20 xl:w-12 lg:w-8" />
                                            <IconRight className="text-[#3276FA]" />
                                        </div>

                                        <div className='3xl:h-[84px] 3xl:w-[160px] 2xl:h-[96px] 2xl:w-[180px] xl:h-[64px] xl:w-[130px] lg:h-[60px] lg:w-[130px] flex space-x-3 border-none bg-[#E2F0FE] rounded-md  items-center justify-center relative'>
                                            <h5 className='3xl:max-w-[160px] 2xl:max-w-[180px] xl:max-w-[140px] lg:max-w-[120px] p-2 text-center'>Kế hoạch nguyên vật liệu</h5>
                                            <h5 className='xl:h-4 xl:w-4 lg:h-3 lg:w-3 xl:text-[10px] lg:text-[10px] xl:top-[8%] lg:top-[6%] 2xl:-left-[2%] xl:-left-[6%] lg:-left-[6%] rounded-full flex flex-col justify-center items-center bg-[#3276FA] absolute text-white '>2</h5>
                                        </div>

                                        <div className="flex items-center -space-x-4">
                                            <div className="h-0.5 bg-[#3276FA] 3xl:w-10 2xl:w-20 xl:w-12 lg:w-8" />
                                            <IconRight className="text-[#3276FA]" />
                                        </div>

                                        <div className='3xl:h-[84px] 3xl:w-[160px] 2xl:h-[96px] 2xl:w-[180px] xl:h-[64px] xl:w-[130px] lg:h-[60px] lg:w-[130px] flex space-x-3 border-none bg-[#E2F0FE] rounded-md  items-center justify-center relative'>
                                            <h5 className='3xl:max-w-[160px] 2xl:max-w-[180px] xl:max-w-[140px] lg:max-w-[120px] p-2 text-center'>Kiểm tra tình trạng kho</h5>
                                            <h5 className='xl:h-4 xl:w-4 lg:h-3 lg:w-3 xl:text-[10px] lg:text-[10px] xl:top-[8%] lg:top-[6%] 2xl:-left-[2%] xl:-left-[6%] lg:-left-[6%] rounded-full flex flex-col justify-center items-center bg-[#3276FA] absolute text-white '>2.1</h5>
                                        </div>

                                        <div className="flex items-center -space-x-4">
                                            <div className="h-0.5 bg-[#3276FA] 3xl:w-10 2xl:w-20 xl:w-12 lg:w-8" />
                                            <IconRight className="text-[#3276FA]" />
                                        </div>
                                        <div className='flex justify-center items-center'>
                                            <div className='w-[36px] h-[36px] bg-[#3276FA] rotate-45 relative ' />
                                        </div>

                                        <div className="flex items-center -space-x-4 pl-2 ">
                                            <div className="h-0.5 bg-[#3276FA] 3xl:w-2 2xl:w-20 xl:w-12 lg:w-8" />
                                        </div>
                                        <div className='flex items-center text-center max-w-[60px] text-[14px]'>
                                            Đủ kho NVL
                                        </div>
                                        <div className="flex items-center -space-x-4">
                                            <div className="h-0.5 bg-[#3276FA] 3xl:w-4 2xl:w-20 xl:w-12 lg:w-8" />
                                            <IconRight className="text-[#3276FA] scale-90" />
                                        </div>

                                        <div className='3xl:h-[84px] 3xl:w-[160px] 2xl:h-[96px] 2xl:w-[180px] xl:h-[64px] xl:w-[130px] lg:h-[60px] lg:w-[130px] flex space-x-3 border-none bg-[#E2F0FE] rounded-md  items-center justify-center relative'>
                                            <h5 className='3xl:max-w-[160px] 2xl:max-w-[180px] xl:max-w-[140px] lg:max-w-[120px] p-2 text-center'>Sản xuất</h5>
                                            <h5 className='xl:h-4 xl:w-4 lg:h-3 lg:w-3 xl:text-[10px] lg:text-[10px] xl:top-[8%] lg:top-[6%] 2xl:-left-[2%] xl:-left-[6%] lg:-left-[6%] rounded-full flex flex-col justify-center items-center bg-[#3276FA] absolute text-white '>3</h5>
                                        </div>

                                        <div className="flex items-center -space-x-4">
                                            <div className="h-0.5 bg-[#3276FA] 3xl:w-10 2xl:w-20 xl:w-12 lg:w-8" />
                                            <IconRight className="text-[#3276FA]" />
                                        </div>
                                        <div className='3xl:h-[84px] 3xl:w-[160px] 2xl:h-[96px] 2xl:w-[180px] xl:h-[64px] xl:w-[130px] lg:h-[60px] lg:w-[130px] flex space-x-3 border-none bg-[#E2F0FE] rounded-md  items-center justify-center relative'>
                                            <h5 className='3xl:max-w-[160px] 2xl:max-w-[180px] xl:max-w-[140px] lg:max-w-[120px] p-2 text-center'>Lệnh sản xuất tổng</h5>
                                            <h5 className='xl:h-4 xl:w-4 lg:h-3 lg:w-3 xl:text-[10px] lg:text-[10px] xl:top-[8%] lg:top-[6%] 2xl:-left-[2%] xl:-left-[6%] lg:-left-[6%] rounded-full flex flex-col justify-center items-center bg-[#3276FA] absolute text-white '>3.1</h5>
                                        </div>

                                        <div className="flex items-center -space-x-4">
                                            <div className="h-0.5 bg-[#3276FA] 3xl:w-10 2xl:w-20 xl:w-12 lg:w-8" />
                                            <IconRight className="text-[#3276FA]" />
                                        </div>
                                    </div>

                                </div>


                                <div class="flex flex-col">
                                    <div className='3xl:h-[84px] 3xl:w-[160px] 2xl:h-[96px] 2xl:w-[180px] xl:h-[64px] xl:w-[130px] lg:h-[60px] lg:w-[130px] flex space-x-3 border-none bg-[#E2F0FE] rounded-md  items-center justify-center relative'>
                                        <h5 className='3xl:max-w-[160px] 2xl:max-w-[180px] xl:max-w-[140px] lg:max-w-[120px] p-2 text-center'>Lệnh sản xuất chi tiết</h5>
                                        <h5 className='xl:h-4 xl:w-4 lg:h-3 lg:w-3 xl:text-[10px] lg:text-[10px] xl:top-[8%] lg:top-[6%] 2xl:-left-[2%] xl:-left-[6%] lg:-left-[6%] rounded-full flex flex-col justify-center items-center bg-[#3276FA] absolute text-white '>3.2</h5>
                                    </div>
                                    <div className='3xl:w-[160px] w-[160px] flex justify-center'>
                                        <div className='3xl:h-[68px] 3xl:w-24 2xl:h-[60px] 2xl:w-[60px] xl:h-[54px] xl:w-[54px] lg:h-14 lg:w-14 flex flex-col justify-center items-center '>
                                            <div className="relative">
                                                <IconRight className=" bottom-[0%] 3xl:-translate-x-[47%] 3xl:translate-y-[35%] 3xl:scale-110 2xl:-translate-x-[46%] 2xl:-translate-y-[14%] 2xl:scale-125 xl:-translate-x-[47%] xl:-translate-y-[6%] lg:-translate-x-[47%] lg:-translate-y-[6%] text-[#3276FA] absolute rotate-90" />
                                                <div className="w-0.5 bg-[#3276FA] 3xl:h-14 2xl:h-10 xl:h-8 lg:h-8" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="flex justify-start 2xl:p-6 2xl:mx-2 xl:p-4 xl:mx-4 lg:px-1 lg:mx-6">
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