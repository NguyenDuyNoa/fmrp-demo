import React from "react";
import Head from "next/head";
import Image from "next/image";

import { ArrowRight2 as IconRight } from "iconsax-react";
import { useSelector } from "react-redux";
import useStatusExprired from "@/hooks/useStatusExprired";

const Index = () => {
    const statusExprired = useStatusExprired()

    return (
        <React.Fragment>
            <Head>
                <title>Quy trình quản lý sản xuất</title>
            </Head>
            <div className="3xl:px-10 3xl:pt-16 3xl:pb-3 2xl:pt-[70px] xl:px-10 px-3 pt-16 pb-3 space-y-1 lg:h-screen overflow-hidden flex flex-col justify-between">
                <div className="space-y-2 overflow-hidden px-2 py-4">
                    {statusExprired ? (
                        <div className="p-3"></div>
                    ) : (
                        <div className="flex space-x-1 3xl:text-[16px] 2xl:text-[14px] xl:text-[15px] text-[12px]">
                            <h6 className="text-[#141522]/40">Trang chủ</h6>
                            <span className="text-[#141522]/40">/</span>
                            <h6 className="text-[#141522]/40">Quy trình</h6>
                            <span className="text-[#141522]/40">/</span>
                            <h6>Quy trình quản lý sản xuất</h6>
                        </div>
                    )}
                    <h2 className="3xl:text-3xl 2xl:text-2xl xl:text-2xl lg:text-2xl text-xl font-medium">
                        Quy Trình Quản Lý Sản Xuất
                    </h2>
                </div>

                <div className="3xl:h-[100%] 2xl:h-[100%] xl:h-[100%] lg:h-[84%] w-[100%] 3xl:px-[55px] 3xl:py-10 2xl:px-12 2xl:py-1 lg:py-2 lg:px-10 relative border-2 border-slate-100 overflow-hidden flex-col flex">
                    <div className="h-full w-full rounded-lg relative z-10 3xl:px-10 2xl:px-6 px-6 xl:space-y-1 lg:space-y-1 flex flex-row">
                        <div className="basis-full">
                            <div className="3xl:w-[180px] 2xl:w-[100px] xl:w-[100px] lg:w-[80px] flex justify-center">
                                <div className=" 3xl:h-[80px] 3xl:w-[80px] 2xl:h-[60px] 2xl:w-[60px] xl:h-[48px] xl:w-[48px] lg:h-[44px] lg:w-[44px] rounded-full flex flex-col justify-center items-center bg-[#3276FA] text-white">
                                    <h5 className="3xl:text-[16px] 2xl:text-[12px] xl:text-[10px] lg:text-[8px] text-center">
                                        Bắt đầu
                                    </h5>
                                </div>
                            </div>

                            <div className="3xl:w-[180px] 2xl:w-[100px] xl:w-[100px] lg:w-[80px] flex justify-center">
                                <div className="3xl:h-14 2xl:h-10 xl:h-8 lg:h-9 flex flex-col justify-center items-center ">
                                    <div className="relative">
                                        <IconRight
                                            size="24"
                                            className="bottom-[0%] 3xl:-translate-x-[44%] 3xl:translate-y-[25%] 3xl:scale-150 2xl:-translate-x-[44%] 2xl:translate-y-[26%] 2xl:scale-125 xl:-translate-x-[44%] xl:translate-y-[30%] xl:scale-110 lg:-translate-x-[46%] lg:translate-y-[30%] lg:scale-105 text-[#3276FA] absolute rotate-90"
                                        />
                                        <div className="3xl:w-[3px] lg:w-[2px] bg-[#3276FA] 3xl:h-10 2xl:h-8 xl:h-6 lg:h-6 xl:scale-95 " />
                                    </div>
                                </div>
                            </div>

                            <div className="flex">
                                <div>
                                    <div className="flex items-center space-1">
                                        <div className="3xl:h-[70px] 3xl:w-[180px] 2xl:h-[55px] 2xl:w-[100px] xl:h-[44px] xl:w-[100px] lg:h-[40px] lg:w-[80px] flex border-none bg-[#E2F0FE] rounded-[8px] items-center justify-center relative">
                                            <h5 className="3xl:max-w-[100px] 3xl:text-base 2xl:max-w-[80px] 2xl:text-[12px] xl:max-w-[90px] xl:text-[10px] lg:max-w-[70px] lg:text-[10px] p-1 text-center  ">
                                                Kế hoạch sản xuất
                                            </h5>
                                            <h5 className="3xl:h-4 3xl:w-4 2xl:h-3 2xl:w-3 xl:h-3 xl:w-3 lg:h-2 lg:w-2 3xl:text-[10px] 2xl:text-[8px] xl:text-[6px] lg:text-[6px] 3xl:top-[4%] xl:top-[4%] lg:top-[6%] 3xl:left-[2%] 2xl:left-[4%] xl:left-[4%] lg:left-[4%] rounded-full flex flex-col justify-center text-center bg-[#3276FA] absolute text-white ">
                                                1
                                            </h5>

                                            <div className="flex flex-col items-center absolute  3xl:top-[80%] 3xl:left-[50%] 2xl:top-[70%] 2xl:left-[48%] xl:top-[80%] xl:left-[50%] lg:top-[80%] lg:left-[50%]">
                                                <div className="3xl:w-[140px] 3xl:h-[180px] 2xl:w-[100px] 2xl:h-[150px] xl:w-[90px] xl:h-[140px] lg:w-[75px] lg:h-[120px] border rounded-t-none rounded-r-none rounded-bl-[20px] border-dashed border-[#B2B9C8] border-t-0 border-r-0 rounded 2xl:mt-6 xl:mt-4 lg:mt-3">
                                                    <div className="3xl:w-[140px] 2xl:w-[100px] xl:w-[90px] lg:w-[75px] 3xl:top-[15%] 2xl:top-[10%] xl:top-[0%] lg:-top-[10%] border border-b rounded-bl-[20px] border-x-0 border-t-0 h-20 border-dashed border-[#B2B9C8] text-center absolute" />
                                                    <IconRight
                                                        className="text-[#B2B9C8] absolute top-0 -left-[16%] 3xl:translate-x-[50%] 3xl:translate-y-[55%] 2xl:translate-x-[18%] 2xl:translate-y-[55%] xl:translate-x-[10%] xl:translate-y-[38%] lg:translate-x-[1%] lg:translate-y-[20%] -rotate-90"
                                                        size="24"
                                                        variant="Outline"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="3xl:w-14 2xl:w-12 xl:w-10 lg:w-9 flex flex-col justify-center items-center ">
                                            <div className="flex items-center 3xl:-space-x-[20px] xl:-space-x-[17px] lg:-space-x-5">
                                                <div className="3xl:h-[3px] 2xl:h-0.5 xl:h-0.5 lg:h-0.5 bg-[#3276FA] 3xl:w-10 2xl:w-9 xl:w-6 lg:w-8 xl:scale-95 lg:scale-75" />
                                                <IconRight
                                                    size="24"
                                                    className="text-[#3276FA] 3xl:scale-150 2xl:scale-110 xl:scale-100 lg:scale-90"
                                                />
                                            </div>
                                        </div>

                                        <div className="3xl:h-[70px] 3xl:w-[200px] 2xl:h-[55px] 2xl:w-[120px] xl:h-[44px] xl:w-[130px] lg:h-[40px] lg:w-[110px] flex border-none bg-[#E2F0FE] rounded-[8px] items-center justify-center relative">
                                            <h5 className="3xl:max-w-[140px] 3xl:text-base 2xl:max-w-[100px] 2xl:text-[12px] xl:text-[10px] lg:text-[10px] xl:max-w-[100px] lg:max-w-[110px] p-1 text-center">
                                                Kế hoạch nguyên vật liệu
                                            </h5>
                                            <h5 className="3xl:h-4 3xl:w-4 2xl:h-3 2xl:w-3 xl:h-3 xl:w-3 lg:h-2 lg:w-2 3xl:text-[10px] 2xl:text-[8px] xl:text-[6px] lg:text-[6px] 3xl:top-[4%] xl:top-[4%] lg:top-[6%] 3xl:left-[2%] 2xl:left-[4%] xl:left-[4%] lg:left-[4%] rounded-full flex flex-col justify-center text-center bg-[#3276FA] absolute text-white ">
                                                2
                                            </h5>

                                            <div className="absolute 3xl:top-[170%] 2xl:top-[190%] xl:top-[190%] lg:top-[190%] ">
                                                <Image
                                                    alt=""
                                                    src="/process_products/Subtract.png"
                                                    width={600}
                                                    height={220}
                                                    className="object-contain 3xl:h-[80px] 2xl:h-[60px] xl:h-[50px] lg:h-[40px] 3xl:-left-[34%] 2xl:-left-[30%] xl:-left-[32%] lg:-left-[36%] relative"
                                                    loading="lazy"
                                                    crossOrigin="anonymous"
                                                    placeholder="blur"
                                                    blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                                />
                                                <span className="transform 3xl:translate-x-[-118%] 3xl:translate-y-[-60%] 2xl:translate-x-[-124%] 2xl:translate-y-[-50%] xl:translate-x-[-110%] xl:translate-y-[-35%] lg:translate-x-[-120%] lg:translate-y-[-50%] absolute select-none pointer-events-none font-medium 3xl:top-[30%] 2xl:top-[20%] xl:top-[12%] lg:top-[25%] left-[52%] 3xl:text-[8px] 2xl:text-[6px] xl:text-[6px] lg:text-[5px] 3xl:p-4 2xl:p-3 xl:p-2 lg:p-2">
                                                    <span className="uppercase ">
                                                        Đơn đặt hàng
                                                    </span>
                                                    <Image
                                                        alt=""
                                                        src="/process_products/Frame.png"
                                                        width={600}
                                                        height={220}
                                                        className="3xl:h-[24px] 2xl:h-[18px] xl:h-[15px] lg:h-[12px] 3xl:-bottom-[45%] 2xl:-bottom-[40%] xl:-bottom-[50%] lg:-bottom-[30%] 3xl:-left-[7%] 2xl:left-[6%] xl:left-[-10%] lg:left-[-10%] absolute object-contain"
                                                        loading="lazy"
                                                        crossOrigin="anonymous"
                                                        placeholder="blur"
                                                        blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                                    />
                                                </span>
                                            </div>
                                            <div className="absolute 3xl:top-[300%] 2xl:top-[330%] xl:top-[360%] lg:top-[350%]">
                                                <Image
                                                    alt=""
                                                    src="/process_products/Subtract.png"
                                                    width={600}
                                                    height={220}
                                                    className="object-contain 3xl:h-[80px] 2xl:h-[60px] xl:h-[50px] lg:h-[40px] 3xl:-left-[34%] 2xl:-left-[30%] xl:-left-[32%] lg:-left-[36%] relative"
                                                    loading="lazy"
                                                    crossOrigin="anonymous"
                                                    placeholder="blur"
                                                    blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                                />
                                                <span className="transform 3xl:translate-x-[-118%] 3xl:translate-y-[-60%] 2xl:translate-x-[-124%] 2xl:translate-y-[-50%] xl:translate-x-[-110%] xl:translate-y-[-35%] lg:translate-x-[-120%] lg:translate-y-[-50%] absolute select-none pointer-events-none font-medium 3xl:top-[30%] 2xl:top-[20%] xl:top-[12%] lg:top-[25%] left-[52%] 3xl:text-[8px] 2xl:text-[6px] xl:text-[6px] lg:text-[5px] 3xl:p-4 2xl:p-3 xl:p-2 lg:p-2">
                                                    <span className="uppercase ">
                                                        Kế hoạch nội bộ
                                                    </span>
                                                    <Image
                                                        alt=""
                                                        src="/process_products/Frame.png"
                                                        width={600}
                                                        height={220}
                                                        className="3xl:h-[24px] 2xl:h-[18px] xl:h-[15px] lg:h-[12px] 3xl:-bottom-[45%] 2xl:-bottom-[40%] xl:-bottom-[50%] lg:-bottom-[30%] 3xl:-left-[7%] 2xl:left-[6%] xl:left-[-10%] lg:left-[-10%] absolute object-contain"
                                                        loading="lazy"
                                                        crossOrigin="anonymous"
                                                        placeholder="blur"
                                                        blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                                    />
                                                </span>
                                            </div>
                                        </div>

                                        <div className="3xl:w-14 2xl:w-12 xl:w-10 lg:w-9 flex flex-col justify-center items-center ">
                                            <div className="flex items-center 3xl:-space-x-[20px] xl:-space-x-[17px] lg:-space-x-5">
                                                <div className="3xl:h-[3px] 2xl:h-0.5 xl:h-0.5 lg:h-0.5 bg-[#3276FA] 3xl:w-10 2xl:w-9 xl:w-6 lg:w-8 xl:scale-95 lg:scale-75" />
                                                <IconRight
                                                    size="24"
                                                    className="text-[#3276FA] 3xl:scale-150 2xl:scale-110 xl:scale-100 lg:scale-90"
                                                />
                                            </div>
                                        </div>

                                        <div className="3xl:h-[70px] 3xl:w-[200px] 2xl:h-[55px] 2xl:w-[160px] xl:h-[44px] xl:w-[130px] lg:h-[40] lg:w-[110px] flex border-none bg-[#E2F0FE] rounded-[8px] items-center justify-center relative">
                                            <h5 className="3xl:max-w-[140px] 3xl:text-base 2xl:max-w-[110px] 2xl:text-[12px] xl:max-w-[140px] xl:text-[10px] lg:max-w-[100px] lg:text-[10px] p-1 text-center">
                                                Kiểm tra tình trạng kho
                                            </h5>
                                            <h5 className="3xl:h-4 3xl:w-4 2xl:h-3 2xl:w-3 xl:h-3 xl:w-3 lg:h-2 lg:w-3 3xl:text-[10px] 2xl:text-[8px] xl:text-[6px] lg:text-[6px] 3xl:top-[4%] xl:top-[4%] lg:top-[6%] 3xl:left-[2%] 2xl:left-[4%] xl:left-[4%] lg:left-[4%] rounded-full flex flex-col justify-center text-center bg-[#3276FA] absolute text-white ">
                                                2.1
                                            </h5>
                                        </div>

                                        <div className="3xl:w-14 2xl:w-12 xl:w-10 lg:w-9 flex flex-col justify-center items-center ">
                                            <div className="flex items-center 3xl:-space-x-[20px] xl:-space-x-[17px] lg:-space-x-5">
                                                <div className="3xl:h-[3px] 2xl:h-0.5 xl:h-0.5 lg:h-0.5 bg-[#3276FA] 3xl:w-10 2xl:w-9 xl:w-6 lg:w-8 xl:scale-95 lg:scale-75" />
                                                <IconRight
                                                    size="24"
                                                    className="text-[#3276FA] 3xl:scale-150 2xl:scale-110 xl:scale-100 lg:scale-90"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-center items-center relative">
                                            <div className="3xl:w-[40px] 3xl:h-[40px] 2xl:w-[32px] 2xl:h-[32px] xl:w-[24px] xl:h-[24px] lg:w-[20px] lg:h-[20px] bg-[#3276FA] rotate-45 relative rounded-[4px]" />

                                            <div className="flex flex-col items-center absolute xl:-top-[230%] xl:left-[48%] lg:-top-[250%] lg:left-[48%]">
                                                <div className="3xl:w-[38px] 3xl:h-[80px] 2xl:w-[34px] 2xl:h-[60px] xl:w-[30px] xl:h-[44px] lg:w-[26px] lg:h-[44px] rounded-tl-[20px] border-[2px] border-[#B2B9C8] rounded-b-none rounded-r-none border-b-0 border-r-0 rounded " />
                                                <div className="3xl:-top-[25%] 3xl:left-[110%] 2xl:-top-[20%] 2xl:left-[100%] xl:-top-[20%] xl:left-[100%] lg:-top-[30%] lg:left-[100%] 3xl:w-[80px] 2xl:w-[80px] xl:w-[60px] lg:w-[60px] h-10 3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] lg:text-[10px] text-center absolute">
                                                    Đủ 1 phần kho NVL
                                                </div>
                                            </div>
                                            <div className="flex items-center 3xl:-space-x-[18px] lg:-space-x-4 absolute 3xl:-top-[255%] 3xl:left-[365%] 2xl:-top-[265%] 2xl:left-[430%] xl:-top-[270%] xl:left-[420%] lg:-top-[300%] lg:left-[490%]">
                                                <div className="3xl:h-[3px] 2xl:h-0.5 xl:h-0.5 lg:h-0.5 bg-[#B2B9C8] 3xl:w-9 2xl:w-8 xl:w-6 lg:w-5" />
                                                <IconRight
                                                    size="24"
                                                    className="text-[#B2B9C8] 3xl:scale-150 2xl:scale-110 xl:scale-95 lg:scale-90"
                                                />
                                            </div>

                                            <div className="3xl:h-[70px] 3xl:w-[195px] 2xl:h-[55px] 2xl:w-[140px] xl:h-[44px] xl:w-[130px] lg:h-[40px] lg:w-[80px] 3xl:-top-[315%] 3xl:left-[485%] 2xl:-top-[290%] 2xl:left-[565%] xl:-top-[300%] xl:left-[570%] lg:-top-[330%] lg:left-[640%] flex border rounded-[8px] items-center justify-center absolute">
                                                <h5 className="3xl:max-w-[140px] 3xl:text-base 2xl:max-w-[140px] 2xl:text-[12px] xl:max-w-[140px] xl:text-[10px] lg:max-w-[120px] lg:text-[10px] p-1 text-center">
                                                    Giữ kho
                                                </h5>
                                            </div>

                                            <div className="flex flex-col items-center absolute top-[130%] left-[48%]">
                                                <div className="3xl:w-[35px] 3xl:h-[100px] 2xl:w-[34px] 2xl:h-[56px] xl:w-[28px] xl:h-[44px] lg:w-[26px] lg:h-[44px] border-[2px] border-[#B2B9C8] rounded-l-none border-y-0 border-r-0 rounded " />
                                                <div className="absolute 3xl:top-[110%] 3xl:-left-[80%] 2xl:top-[110%] 2xl:-left-[90%] xl:top-[110%] xl:-left-[80%] lg:top-[105%] lg:-left-[100%] 2xl:w-[80px] xl:max-w-[60px] lg:max-w-[60px] h-10 3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] lg:text-[10px] text-center text-[#EE1E1E] font-[500]">
                                                    Hết kho NVL
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-center absolute 3xl:top-[520%] 3xl:left-[48%] 2xl:top-[470%] 2xl:left-[48%] xl:top-[460%] xl:left-[48%] lg:top-[520%] lg:left-[48%]">
                                                <div className="3xl:w-[160px] 3xl:h-[50px] 2xl:w-[155px] 2xl:h-[60px] xl:w-[115px] xl:h-[54px] lg:w-[110px] lg:h-[50px] rounded-bl-[20px] border-[2px] border-[#B2B9C8] rounded-t-none rounded-r-none border-t-0 border-r-0 rounded ">
                                                    <IconRight
                                                        className="text-[#B2B9C8] absolute bottom-0 right-0 translate-x-[30%] translate-y-[45%] 3xl:scale-150 2xl:scale-110 xl:scale-95 lg:scale-90"
                                                        size="24"
                                                        variant="Outline"
                                                    />
                                                </div>
                                            </div>

                                            <div className="3xl:w-[200px] 2xl:w-[200px] xl:w-[130px] lg:w-[130px] 3xl:top-[130%] 3xl:left-[485%] 2xl:top-[130%] 2xl:left-[470%] xl:top-[120%] xl:left-[570%] lg:top-[140%] lg:left-[520%] flex justify-center absolute">
                                                <div className="3xl:h-14 2xl:h-12 xl:h-10 lg:h-9 flex flex-col justify-center items-center ">
                                                    <div className="relative">
                                                        <IconRight
                                                            size="24"
                                                            className=" top-0 3xl:-translate-x-[46%] 3xl:-translate-y-[20%] 3xl:scale-150 2xl:-translate-x-[47%] 2xl:translate-y-[-30%] 2xl:scale-125 xl:-translate-x-[46%] xl:-translate-y-[32%] xl:scale-125 lg:-translate-x-[45%] lg:-translate-y-[34%] lg:scale-110 text-[#B2B9C8] absolute -rotate-90"
                                                        />
                                                        <div className="3xl:w-[3px] lg:w-[2px] bg-[#B2B9C8] 3xl:h-10 2xl:h-8 xl:h-6 lg:h-6" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="3xl:h-[70px] 3xl:w-[200px] 2xl:h-[55px] 2xl:w-[140px] xl:h-[44px] xl:w-[130px] lg:h-[40px] lg:w-[80px] 3xl:top-[260%] 3xl:left-[485%] 2xl:top-[265%] 2xl:left-[565%] xl:top-[270%] xl:left-[570%] lg:top-[300%] lg:left-[640%] flex border rounded-[8px] items-center justify-center absolute">
                                                <h5 className="3xl:max-w-[140px] 3xl:text-base 2xl:max-w-[140px] 2xl:text-[12px] xl:max-w-[140px] xl:text-[10px] lg:max-w-[120px] lg:text-[10px] p-1 text-center">
                                                    Nhập hàng
                                                </h5>
                                            </div>

                                            <div className="3xl:w-[200px] 2xl:w-[200px] xl:w-[130px] lg:w-[130px] flex justify-center absolute 3xl:top-[430%] 3xl:left-[485%] 2xl:top-[420%] 2xl:left-[470%] xl:top-[430%] xl:left-[570%] lg:top-[490%] lg:left-[520%]">
                                                <div className="3xl:h-14 2xl:h-12 xl:h-[44px] lg:h-9 flex flex-col justify-center items-center ">
                                                    <div className="relative">
                                                        <IconRight
                                                            size="24"
                                                            className=" top-0 3xl:-translate-x-[46%] 3xl:-translate-y-[20%] 3xl:scale-150 2xl:-translate-x-[47%] 2xl:translate-y-[-30%] 2xl:scale-125 xl:-translate-x-[46%] xl:-translate-y-[32%] xl:scale-125 lg:-translate-x-[45%] lg:-translate-y-[34%] lg:scale-110 text-[#B2B9C8] absolute -rotate-90"
                                                        />
                                                        <div className="3xl:w-[3px] xl:w-[2px] lg:w-[2px] bg-[#B2B9C8] 3xl:h-10 2xl:h-8 xl:h-6 lg:h-6" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="3xl:h-[70px] 3xl:w-[200px] 2xl:h-[55px] 2xl:w-[140px] xl:h-[44px] xl:w-[130px] lg:h-[40px] lg:w-[80px] 3xl:top-[560%] 3xl:left-[485%] 2xl:top-[560%] 2xl:left-[565%] xl:top-[590%] xl:left-[570%] lg:top-[660%] lg:left-[640%] flex border rounded-[8px] items-center justify-center absolute">
                                                <h5 className="3xl:max-w-[100px] 3xl:text-base 2xl:max-w-[140px] 2xl:text-[12px] xl:max-w-[140px] xl:text-[10px] lg:max-w-[70px] lg:text-[10px] p-1 text-center">
                                                    Yêu cầu mua hàng
                                                </h5>
                                            </div>
                                        </div>

                                        <div className="flex items-center -space-x-4 pl-4 ">
                                            <div className="h-0.5 bg-[#3276FA] 3xl:w-4 2xl:w-4  xl:w-2 lg:w-2 xl:scale-95 lg:scale-75" />
                                        </div>
                                        <div className="flex items-center text-center 3xl:max-w-[60px] 2xl:max-w-[60px] xl:max-w-[40px] lg:max-w-[40px] 3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] lg:text-[10px] lg:ml-2">
                                            Đủ kho NVL
                                        </div>
                                        <div className="3xl:w-14 2xl:w-12 xl:w-10 lg:w-9 flex flex-col justify-center items-center ">
                                            <div className="flex items-center 3xl:-space-x-[20px] xl:-space-x-[17px] lg:-space-x-[18px]">
                                                <div className="3xl:h-[3px] lg:h-[2px] bg-[#3276FA] 3xl:w-10 2xl:w-9 xl:w-6 lg:w-6 xl:scale-95 lg:scale-75" />
                                                <IconRight
                                                    size="24"
                                                    className="text-[#3276FA] 3xl:scale-150 2xl:scale-110 xl:scale-100 lg:scale-90"
                                                />
                                            </div>
                                        </div>

                                        <div className="3xl:h-[70px] 3xl:w-[200px] 2xl:h-[55px] 2xl:w-[140px] xl:h-[44px] xl:w-[130px] lg:h-[40px] lg:w-[80px] flex border-none bg-[#E2F0FE] rounded-[8px] items-center justify-center relative">
                                            <h5 className="3xl:max-w-[140px] 3xl:text-base 2xl:max-w-[160px] 2xl:text-[12px] xl:max-w-[140px] xl:text-[10px] lg:max-w-[110px] lg:text-[10px] p-1 text-center">
                                                Sản xuất
                                            </h5>
                                            <h5 className="3xl:h-4 3xl:w-4 2xl:h-3 2xl:w-3 xl:h-3 xl:w-3 lg:h-2 lg:w-2 3xl:text-[10px] 2xl:text-[8px] xl:text-[6px] lg:text-[6px] 3xl:top-[4%] xl:top-[4%] lg:top-[6%] 3xl:left-[2%] 2xl:left-[4%] xl:left-[4%] lg:left-[4%] rounded-full flex flex-col justify-center text-center bg-[#3276FA] absolute text-white ">
                                                3
                                            </h5>
                                        </div>

                                        <div className="3xl:w-14 2xl:w-12 xl:w-10 lg:w-8 flex flex-col justify-center items-center ">
                                            <div className="flex items-center 3xl:-space-x-[20px] xl:-space-x-[17px] lg:-space-x-5">
                                                <div className="3xl:h-[3px] 2xl:h-0.5 xl:h-0.5 lg:h-0.5 bg-[#3276FA] 3xl:w-10 2xl:w-9 xl:w-6 lg:w-8 xl:scale-95 lg:scale-75" />
                                                <IconRight
                                                    size="24"
                                                    className="text-[#3276FA] 3xl:scale-150 2xl:scale-110 xl:scale-100 lg:scale-90"
                                                />
                                            </div>
                                        </div>
                                        <div className="3xl:h-[70px] 3xl:w-[200px] 2xl:h-[55px] 2xl:w-[140px] xl:h-[44px] xl:w-[130px] lg:h-[40px] lg:w-[100px] flex border-none bg-[#E2F0FE] rounded-[8px] items-center justify-center relative">
                                            <h5 className="3xl:max-w-[100px] 3xl:text-base 2xl:max-w-[160px] 2xl:text-[12px] xl:max-w-[140px] xl:text-[10px] lg:max-w-[70px] lg:text-[10px] p-1 text-center">
                                                Lệnh sản xuất tổng
                                            </h5>
                                            <h5 className="3xl:h-4 3xl:w-4 2xl:h-3 2xl:w-3 xl:h-3 xl:w-3 lg:h-2 lg:w-3 3xl:text-[10px] 2xl:text-[8px] xl:text-[6px] lg:text-[6px] 3xl:top-[4%] xl:top-[4%] lg:top-[6%] 3xl:left-[2%] 2xl:left-[4%] xl:left-[4%] lg:left-[4%] rounded-full flex flex-col justify-center text-center bg-[#3276FA] absolute text-white ">
                                                3.1
                                            </h5>
                                        </div>
                                        <div className="3xl:w-14 2xl:w-12 xl:w-10 lg:w-8 flex flex-col justify-center items-center ">
                                            <div className="flex items-center 3xl:-space-x-[20px] xl:-space-x-[17px] lg:-space-x-5">
                                                <div className="3xl:h-[3px] 2xl:h-0.5 xl:h-0.5 lg:h-0.5 bg-[#3276FA] 3xl:w-10 2xl:w-9 xl:w-6 lg:w-8 xl:scale-95 lg:scale-75" />
                                                <IconRight
                                                    size="24"
                                                    className="text-[#3276FA] 3xl:scale-150 2xl:scale-110 xl:scale-100 lg:scale-90"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <div className="3xl:h-[70px] 3xl:w-[220px] 2xl:h-[55px] 2xl:w-[200px] xl:h-[44px] xl:w-[130px] lg:h-[40px] lg:w-[130px] flex border-none bg-[#E2F0FE] rounded-[8px] items-center justify-center relative">
                                        <h5 className="3xl:max-w-[140px] 3xl:text-base 2xl:max-w-[160px] 2xl:text-[12px] xl:max-w-[140px] xl:text-[10px] lg:max-w-[120px] lg:text-[10px] p-1 text-center">
                                            Lệnh sản xuất chi tiết
                                        </h5>
                                        <h5 className="3xl:h-4 3xl:w-4 2xl:h-3 2xl:w-3 xl:h-3 xl:w-3 lg:h-2 lg:w-3 3xl:text-[10px] 2xl:text-[8px] xl:text-[6px] lg:text-[6px] 3xl:top-[4%] xl:top-[4%] lg:top-[6%] 3xl:left-[2%] 2xl:left-[4%] xl:left-[4%] lg:left-[4%] rounded-full flex flex-col justify-center text-center bg-[#3276FA] absolute text-white ">
                                            3.2
                                        </h5>
                                    </div>

                                    <div className="3xl:w-[220px] 2xl:w-[200px] xl:w-[130px] lg:w-[130px] flex justify-center">
                                        <div className="3xl:h-[52px] 2xl:h-[38px] xl:h-[32px] lg:h-9 flex flex-col justify-center items-center ">
                                            <div className="relative">
                                                <IconRight
                                                    size="24"
                                                    className="bottom-[0%] 3xl:-translate-x-[44%] 3xl:translate-y-[24%] 3xl:scale-150 2xl:-translate-x-[45%] 2xl:translate-y-[28%] 2xl:scale-125 xl:-translate-x-[44%] xl:translate-y-[30%] xl:scale-110 lg:-translate-x-[45%] lg:translate-y-[30%] lg:scale-110 text-[#3276FA] absolute rotate-90"
                                                />
                                                <div className="3xl:w-[3px] lg:w-[2px] bg-[#3276FA] 3xl:h-10 2xl:h-8 xl:h-6 lg:h-6 xl:scale-95 lg:scale-90" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="3xl:h-[70px] 3xl:w-[220px] 2xl:h-[55px] 2xl:w-[200px] xl:h-[44px] xl:w-[130px] lg:h-[40px] lg:w-[130px] flex border-none bg-[#E2F0FE] rounded-[8px] items-center justify-center relative xl:p-2">
                                        <h5 className="3xl:max-w-[200px] 3xl:text-base 2xl:max-w-[160px] 2xl:text-[12px] xl:max-w-[140px] xl:text-[10px] lg:max-w-[120px] lg:text-[10px] p-1 text-center">
                                            Hoàn thành công đoạn bán thành phẩm
                                        </h5>
                                        <h5 className="3xl:h-4 3xl:w-4 2xl:h-3 2xl:w-3 xl:h-3 xl:w-3 lg:h-2 lg:w-2 3xl:text-[10px] 2xl:text-[8px] xl:text-[6px] lg:text-[6px] 3xl:top-[4%] xl:top-[4%] lg:top-[6%] 3xl:left-[2%] 2xl:left-[4%] xl:left-[4%] lg:left-[4%] rounded-full flex flex-col justify-center text-center bg-[#3276FA] absolute text-white ">
                                            4
                                        </h5>
                                    </div>

                                    <div className="3xl:w-[220px] 2xl:w-[200px] xl:w-[130px] lg:w-[130px] flex justify-center">
                                        <div className="3xl:h-[52px] 2xl:h-[38px] xl:h-[32px] lg:h-9 flex flex-col justify-center items-center ">
                                            <div className="relative">
                                                <IconRight
                                                    size="24"
                                                    className="bottom-[0%] 3xl:-translate-x-[44%] 3xl:translate-y-[24%] 3xl:scale-150 2xl:-translate-x-[45%] 2xl:translate-y-[28%] 2xl:scale-125 xl:-translate-x-[44%] xl:translate-y-[30%] xl:scale-110 lg:-translate-x-[45%] lg:translate-y-[30%] lg:scale-110 text-[#3276FA] absolute rotate-90"
                                                />
                                                <div className="3xl:w-[3px] lg:w-[2px] bg-[#3276FA] 3xl:h-10 2xl:h-8 xl:h-6 lg:h-6 xl:scale-95 lg:scale-90" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="3xl:h-[70px] 3xl:w-[220px] 2xl:h-[55px] 2xl:w-[200px] xl:h-[44px] xl:w-[130px] lg:h-[40px] lg:w-[130px] flex border-none bg-[#E2F0FE] rounded-[8px] items-center justify-center relative">
                                        <h5 className="3xl:max-w-[200px] 3xl:text-base 2xl:max-w-[160px] 2xl:text-[12px] xl:max-w-[100px] xl:text-[10px] lg:max-w-[140px] lg:text-[10px] p-1 text-center">
                                            Hoàn thành công đoạn thành phẩm
                                        </h5>
                                        <h5 className="3xl:h-4 3xl:w-4 2xl:h-3 2xl:w-3 xl:h-3 xl:w-3 lg:h-2 lg:w-2 3xl:text-[10px] 2xl:text-[8px] xl:text-[6px] lg:text-[6px] 3xl:top-[4%] xl:top-[4%] lg:top-[6%] 3xl:left-[2%] 2xl:left-[4%] xl:left-[4%] lg:left-[4%] rounded-full flex flex-col justify-center text-center bg-[#3276FA] absolute text-white ">
                                            5
                                        </h5>
                                    </div>

                                    <div className="3xl:w-[220px] 2xl:w-[200px] xl:w-[130px] lg:w-[130px] flex justify-center">
                                        <div className="3xl:h-[52px] 2xl:h-[38px] xl:h-[32px] lg:h-9 flex flex-col justify-center items-center ">
                                            <div className="relative">
                                                <IconRight
                                                    size="24"
                                                    className="bottom-[0%] 3xl:-translate-x-[44%] 3xl:translate-y-[24%] 3xl:scale-150 2xl:-translate-x-[45%] 2xl:translate-y-[28%] 2xl:scale-125 xl:-translate-x-[44%] xl:translate-y-[30%] xl:scale-110 lg:-translate-x-[45%] lg:translate-y-[30%] lg:scale-110 text-[#3276FA] absolute rotate-90"
                                                />
                                                <div className="3xl:w-[3px] lg:w-[2px] bg-[#3276FA] 3xl:h-10 2xl:h-8 xl:h-6 lg:h-6 xl:scale-95 lg:scale-90" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="3xl:h-[70px] 3xl:w-[220px] 2xl:h-[55px] 2xl:w-[200px] xl:h-[44px] xl:w-[130px] lg:h-[40px] lg:w-[130px] flex border-none bg-[#E2F0FE] rounded-[8px] items-center justify-center relative">
                                        <h5 className="3xl:max-w-[220px] 3xl:text-base 2xl:max-w-[160px] 2xl:text-[12px] xl:max-w-[140px] xl:text-[10px] lg:max-w-[120px] lg:text-[10px] p-1 text-center">
                                            Hoàn thành sản xuất
                                        </h5>
                                        <h5 className="3xl:h-4 3xl:w-4 2xl:h-3 2xl:w-3 xl:h-3 xl:w-3 lg:h-2 lg:w-2 3xl:text-[10px] 2xl:text-[8px] xl:text-[6px] lg:text-[6px] 3xl:top-[4%] xl:top-[4%] lg:top-[6%] 3xl:left-[2%] 2xl:left-[4%] xl:left-[4%] lg:left-[4%] rounded-full flex flex-col justify-center text-center bg-[#3276FA] absolute text-white ">
                                            6
                                        </h5>
                                    </div>
                                    <div className="3xl:w-[220px] 2xl:w-[200px] xl:w-[130px] lg:w-[130px] flex justify-center">
                                        <div className="3xl:h-[52px] 2xl:h-[38px] xl:h-[32px] lg:h-9 flex flex-col justify-center items-center ">
                                            <div className="relative">
                                                <IconRight
                                                    size="24"
                                                    className="bottom-[0%] 3xl:-translate-x-[44%] 3xl:translate-y-[24%] 3xl:scale-150 2xl:-translate-x-[45%] 2xl:translate-y-[28%] 2xl:scale-125 xl:-translate-x-[44%] xl:translate-y-[30%] xl:scale-110 lg:-translate-x-[45%] lg:translate-y-[30%] lg:scale-110 text-[#3276FA] absolute rotate-90"
                                                />
                                                <div className="3xl:w-[3px] lg:w-[2px] bg-[#3276FA] 3xl:h-10 2xl:h-8 xl:h-6 lg:h-6 xl:scale-95 lg:scale-90" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="3xl:w-[220px] 2xl:w-[200px] xl:w-[130px] lg:w-[130px] flex justify-center">
                                        <div className=" 3xl:h-[80px] 3xl:w-[80px] 2xl:h-[60px] 2xl:w-[60px] xl:h-[48px] xl:w-[48px] lg:h-[44px] lg:w-[44px] rounded-full flex flex-col justify-center items-center bg-[#3276FA] text-white">
                                            <h5 className="3xl:text-[16px] 2xl:text-[12px] xl:text-[10px] lg:text-[8px] text-center">
                                                Kết thúc
                                            </h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="3xl:bottom-[0%] bottom-[0%] 3xl:px-0 3xl:py-6 3xl:mx-0 2xl:px-0 2xl:py-6 2xl:mx-0 xl:px-4 xl:py-6 xl:mx-4 lg:px-0 lg:py-2 lg:mx-6 flex justify-start absolute">
                        <div className="flex space-x-3 ">
                            <Image
                                alt=""
                                src="/logo_1.png"
                                width={64}
                                height={20}
                                className="select-none pointer-events-none object-contain w-auto h-auto"
                                loading="lazy"
                                crossOrigin="anonymous"
                                blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                            />
                            <h6 className="2xl:font-[300] xl:font-[300] lg:font-[200]">
                                Quy trình quản lí sản xuất
                            </h6>
                        </div>
                    </div>

                    <Image
                        alt=""
                        src="/process/Logo-BG.png"
                        width={1200}
                        height={420}
                        className="3xl:w-[600px] 2xl:w-[450px] xl:w-[350px] lg:w-[350px] left-[2%] bottom-[8%] absolute select-none pointer-events-none object-contain "
                        loading="lazy"
                        crossOrigin="anonymous"
                        placeholder="blur"
                        blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                    />
                </div>
            </div>
        </React.Fragment>
    );
};

export default Index;
