import React from "react";
import Head from "next/head";
import Image from "next/image";

import { ArrowUp2, ArrowRight2 as IconRight } from "iconsax-react";
import { useSelector } from "react-redux";
import useStatusExprired from "@/hooks/useStatusExprired";

const Index = () => {
    const trangthaiExprired = useStatusExprired()
    return (
        <React.Fragment>
            <Head>
                <title>Tổng quan bán hàng - Sản xuất</title>
            </Head>
            <div className="3xl:px-10 3xl:pt-16 3xl:pb-3 2xl:pt-[70px] xl:px-10 px-3 pt-16 pb-3 space-y-1 lg:h-screen overflow-hidden flex flex-col justify-between">
                <div className="space-y-2 overflow-hidden px-2 py-4">
                    {trangthaiExprired ? (
                        <div className="p-3"></div>
                    ) : (
                        <div className="flex space-x-1 3xl:text-[16px] 2xl:text-[14px] xl:text-[15px] text-[12px]">
                            <h6 className="text-[#141522]/40">Trang chủ</h6>
                            <span className="text-[#141522]/40">/</span>
                            <h6 className="text-[#141522]/40">Quy trình</h6>
                            <span className="text-[#141522]/40">/</span>
                            <h6>Quy Trình tổng quan Bán hàng - Sản xuất</h6>
                        </div>
                    )}
                    <h2 className="3xl:text-3xl 2xl:text-2xl xl:text-2xl lg:text-2xl text-xl font-normal text-gray-600">
                        Quy Trình tổng quan Bán hàng - Sản xuất
                    </h2>
                </div>

                <div className="3xl:h-[100%] 2xl:h-[100%] xl:h-[100%] lg:h-[84%] w-[100%] 3xl:px-[55px] 3xl:py-10 2xl:px-12 2xl:py-1 lg:py-2 lg:px-10 relative border-2 border-slate-100 overflow-hidden flex-col flex">
                    <div className="h-full w-full rounded-lg relative z-10 3xl:px-10 2xl:px-6 px-6 xl:space-y-1 lg:space-y-1 flex flex-row">
                        <div class="basis-full">
                            <div className="grid grid-cols-12">
                                <div className="col-span-1 flex flex-col">
                                    <div className="mx-auto max-h-[74px] h-[74px] w-[74px] max-w-[74px] bg-black rounded-full text-white flex items-center justify-center text-sm">
                                        Bắt đầu
                                    </div>
                                    <div className="w-[2px] 3xl:h-[190px] 2xl:h-[95px] xl:h-[88px] lg:h-[92px] bg-[#D0D5DD] inline-block mx-auto relative mt-[2px]">
                                        <ArrowUp2
                                            size="32"
                                            color="#D0D5DD"
                                            className="absolute bottom-0 left-[1px] translate-y-1/2 rotate-180 -translate-x-1/2 3xl:scale-100 2xl:scale-75 xl:scale-50 lg:scale-50"
                                        />
                                    </div>
                                    <div className=" border-[#D0D5DD] border-2 rounded mt-2">
                                        <div className="grid grid-cols-12  3xl:py-2 3xl:pr-4 3xl:pl-2 2xl:py-1 2xl:pr-3 2xl:pl-1 lg:py-1 lg:pr-2 lg:pl-1">
                                            <div className="col-span-2 p-1">
                                                <div className="w-4 h-4  bg-black text-white rounded-full text-center 3xl:text-[10px] 2xl:text-[10px] xl:text-[8px] lg:text-[7px] flex items-center justify-center">
                                                    1
                                                </div>
                                            </div>
                                            <div className="col-span-10 p-2 3xl:text-sm text-center flex flex-wrap 3xl:max-w-[70px] 2xl:max-w-[120px] 2xl:text-xs  xl:max-w-[100px] xl:text-[10px] lg:max-w-[110px] lg:text-[8px]">
                                                Nhập dữ liệu
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-1">
                                    <div className="w-full 3xl:h-[18%] 2xl:h-[15%] xl:h-[14%] lg:h-[21%]"></div>
                                    <div className="flex flex-col items-center gap-3.5">
                                        <div className="flex relative">
                                            <div className="3xl:w-[70px] 3xl:h-[80px] 2xl:w-[50px] 2xl:h-[60px] xl:w-[40px] xl:h-[55px] lg:w-[35px] lg:h-[45px] relative ">
                                                <img
                                                    src="/proces_sales/Subtract.png"
                                                    className="w-full h-full"
                                                />
                                                <div className="absolute 3xl:text-[10px]  2xl:text-[7px] xl:text-[5.8px] lg:text-[4.5px] font-medium flex  flex-wrap uppercase top-1  left-2">
                                                    <span className="">
                                                        Đơn
                                                    </span>
                                                    <span>hàng bán</span>
                                                </div>
                                                <img
                                                    src="/proces_sales/Frame.png"
                                                    className="absolute top-1/2 left-1/2 -translate-x-1/2"
                                                />
                                            </div>
                                            <div className="w-1/2 3xl:h-[2px] 2xl:h-[1px] xl:h-[1px] lg:h-[1px] bg-[#32C100] absolute top-1/2 -right-1/2 translate-x-1">
                                                <ArrowUp2
                                                    size="32"
                                                    color="#32C100"
                                                    className="absolute top-[1px] -translate-y-1/2 right-0  rotate-90 translate-x-1/2 3xl:scale-100 2xl:scale-75 xl:scale-50 lg:scale-50"
                                                />
                                            </div>
                                        </div>
                                        <div className="3xl:w-[2px] 3xl:h-[80px] 2xl:w-[1px] 2xl:h-[50px] xl:w-[1px] xl:h-[50px] lg:w-[1px] lg:h-[40px] bg-[#32C100] inline-block mx-auto relative">
                                            <ArrowUp2
                                                size="32"
                                                color="#32C100"
                                                className="absolute top-0 -translate-y-1/2 3xl:left-[1px] 2xl:left-[1px] xl:left-[0.5px] -translate-x-1/2 3xl:scale-100 2xl:scale-75 xl:scale-50 lg:scale-50"
                                            />
                                        </div>
                                        <div className="flex items-center  w-full space-x-4  3xl:space-x-5 2xl:space-x-5 xl:space-x-4 lg:space-x-2.5">
                                            <div className="3xl:w-[25%] 3xl:h-[2px] 2xl:w-[21%] 2xl:h-[2px] xl:w-[21%] xl:h-[2px]  lg:w-[21%] lg:h-[2px]  bg-[#D0D5DD] relative">
                                                <ArrowUp2
                                                    size="32"
                                                    color="#D0D5DD"
                                                    className="absolute top-0 -translate-y-1/2 right-0  rotate-90 translate-x-1/2 3xl:scale-100 2xl:scale-75 xl:scale-75 lg:scale-50"
                                                />
                                            </div>
                                            <div className="3xl:w-[32px]  3xl:h-[32px] 2xl:w-[25px] 2xl:h-[25px] xl:w-[25px] xl:h-[25px] lg:w-[20px] lg:h-[20px] bg-black rotate-45 rounded "></div>
                                        </div>
                                        <div className="3xl:w-[2px] 3xl:h-[107px] 2xl:w-[1px] 2xl:h-[50px] xl:w-[1px] xl:h-[50px] lg:w-[1px] lg:h-[40px] bg-[#3276FA] inline-block mx-auto relative">
                                            <ArrowUp2
                                                size="32"
                                                color="#3276FA"
                                                className="absolute bottom-0 rotate-180 translate-y-1/2 left-[1px] 3xl:scale-100 2xl:scale-75 xl:scale-50 lg:scale-50 -translate-x-1/2"
                                            />
                                        </div>
                                        <div className="3xl:w-[70px] 3xl:h-[80px] 2xl:w-[50px] 2xl:h-[60px] xl:w-[40px] xl:h-[55px] lg:w-[35px] lg:h-[45px] relative">
                                            <img src="/proces_sales/Subtract2.png" />
                                            <div className="absolute 3xl:text-[10px]  2xl:text-[7px] xl:text-[5.8px] lg:text-[4.5px] font-medium flex  flex-wrap uppercase top-1  left-2">
                                                <span className="">
                                                    Kế hoạch
                                                </span>
                                                <span>Nội bộ</span>
                                            </div>
                                            <img
                                                src="/proces_sales/Frame2.png"
                                                className="absolute top-1/2 left-1/2 -translate-x-1/2"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-4 mt-8 ">
                                    <div className="flex flex-col ml-[35px]">
                                        <div className="border-l-2 border-t-2 rounded-tl-[40px] border-[#32C100] w-full 3xl:h-[73px] 2xl:h-[36px] xl:h-[20px] lg:h-[41px] relative">
                                            <ArrowUp2
                                                size="32"
                                                color="#32C100"
                                                className="absolute top-0 -translate-y-1/2 rotate-90 right-0 translate-x-1/2 3xl:scale-100 2xl:scale-75 xl:scale-50 lg:scale-50"
                                            />
                                            <div className="absolute top-0 p-2 right-1/2 -translate-y-1/2 bg-white max-w-[110px] text-center 3xl:text-base 2xl:text-sm xl:text-xs lg:text-xs">
                                                Đủ kho thành phẩm
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="bg-[#32C100] 3xl:w-[32px] 3xl:h-[30px] 2xl:w-[29px] 2xl:h-[25px] xl:w-[27px] xl:h-[25px] lg:w-[23px] lg:h-[20px]  rounded rotate-45 ml-5 "></div>
                                        <div className="flex items-center w-full gap-2">
                                            <div className="bg-[#F7DA3F] w-[22%] 3xl:h-[2px] 2xl:h-[1px] xl:h-[1px] lg:h-[1px] "></div>
                                            <div className="bg-white p-2 3xl:text-base 2xl:text-sm xl:text-xs lg:text-xs 3xl:max-w-[135px] 2xl:max-w-[120px] xl:max-w-[110px] lg:max-w-[80px] text-center">
                                                Đủ 1 phần kho thành phẩm
                                            </div>
                                            <div className="bg-[#F7DA3F] w-[18%] 3xl:h-[2px] 2xl:h-[1px] lg:h-[1px] relative ">
                                                <ArrowUp2
                                                    size="32"
                                                    color="#F7DA3F"
                                                    className="absolute top-[1px] -translate-y-1/2 rotate-90 right-0 translate-x-1/2 3xl:scale-100 2xl:scale-75 xl:scale-50 lg:scale-50"
                                                />
                                            </div>
                                            <div className=" bg-[#F7DA3F] rounded mt-2 3xl:w-[20%] 2xl:w-[40%] xl:w-[38%] lg:w-[60%]">
                                                <div className="grid grid-cols-12  py-2 pl-2 ">
                                                    <div className="col-span-1 ">
                                                        <div className="w-4 h-4  bg-[#FF7E06] text-white rounded-full text-center text-[10px] flex items-center justify-center">
                                                            1
                                                        </div>
                                                    </div>
                                                    <div className="col-span-11 p-2 3xl:text-base 2xl:text-sm xl:text-xs lg:text-xs text-center">
                                                        Giữ kho
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex ml-[35px] w-[90%]">
                                        <div className="border-l-2 border-b-2 rounded-bl-[40px] border-[#EE1E1E] w-[40%] 3xl:h-[170px] 2xl:h-[130px] xl:h-[130px] lg:h-[95px] relative">
                                            <ArrowUp2
                                                size="32"
                                                color="#EE1E1E"
                                                className="absolute bottom-0 translate-y-1/2 rotate-90 right-0 translate-x-1/2 3xl:scale-100 2xl:scale-75 xl:scale-50 lg:scale-50"
                                            />
                                            <div className="absolute  text-[#EE1E1E] 3xl:text-base 2xl:text-sm xl:text-xs lg:text-xs top-1/2 p-2 left-0 -translate-x-1/2 -translate-y-1/2 bg-white max-w-[110px] text-center">
                                                Hết kho thành phẩm
                                            </div>
                                        </div>
                                        <div className="flex relative left-4">
                                            <div className="">
                                                <div className="3xl:w-[2px] 2xl:w-[2px] xl:w-[1px] lg:w-[1px] 3xl:h-[49%] 2xl:h-[35%] xl:h-[45%] lg:h-[25%] bg-[#F7DA3F] relative mb-2 3xl:left-[18%] 2xl:left-[15%] xl:left-[15%] lg:left-[15%]">
                                                    <ArrowUp2
                                                        size="32"
                                                        color="#F7DA3F"
                                                        className="absolute bottom-0 translate-y-1/2 rotate-180 right-[1px] translate-x-1/2 z-10 3xl:scale-100 2xl:scale-75 xl:scale-50 lg:scale-50"
                                                    />
                                                </div>
                                                <div className="flex relative gap-2">
                                                    <div className="flex  items-center">
                                                        <div className="3xl:w-[70px] 3xl:h-[80px] 2xl:w-[50px] 2xl:h-[60px] xl:w-[40px] xl:h-[55px] lg:w-[35px] lg:h-[45px] relative ">
                                                            <img src="/proces_sales/Subtract3.png" />
                                                            <div className="absolute text-[10px] font-medium flex 3xl:text-[10px]  2xl:text-[7px] xl:text-[5.8px] lg:text-[4.5px]    flex-wrap uppercase top-1  left-2">
                                                                <span className="">
                                                                    Kế hoạch
                                                                </span>
                                                                <span>
                                                                    Sản xuất
                                                                </span>
                                                            </div>
                                                            <img
                                                                src="/proces_sales/Frame3.png"
                                                                className="absolute top-1/2 left-1/2 -translate-x-1/2"
                                                            />
                                                        </div>
                                                        <div className="bg-[#3276FA] 3xl:w-[120px] 2xl:w-[120px] xl:w-[110px] lg:w-[70px] h-[2px] relative left-4">
                                                            <ArrowUp2
                                                                size="32"
                                                                color="#3276FA"
                                                                className="absolute top-[1px] -translate-y-1/2 rotate-90  right-0 translate-x-1/2 3xl:scale-100 2xl:scale-75 xl:scale-50 lg:scale-50"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="relative">
                                                <div className="w-[2px] 3xl:h-[50%]  2xl:h-[40%] xxl:h-[54%] xl:h-[48%] lg:h-[30%]"></div>
                                                <div className="flex relative gap-2">
                                                    <div className="flex  items-center">
                                                        <div className="3xl:w-[70px] 3xl:h-[80px] 2xl:w-[50px] 2xl:h-[60px] xl:w-[40px] xl:h-[55px] lg:w-[35px] lg:h-[45px] relative  3xl:left-full xxl:left-[120%] 2xl:left-full xl:left-full lg:left-full -translate-x-1/2 ">
                                                            <img src="/proces_sales/Subtract3.png" />
                                                            <div className="absolute text-[8.5px] font-medium flex 3xl:text-[8px]  2xl:text-[6px] xl:text-[5px] lg:text-[4.5px] flex-wrap uppercase top-1  left-2">
                                                                <span className="">
                                                                    Kế hoạch
                                                                </span>
                                                                <span>
                                                                    nguyên
                                                                </span>
                                                                <span>
                                                                    Vật liệu
                                                                </span>
                                                            </div>
                                                            <img
                                                                src="/proces_sales/Frame2.png"
                                                                className="absolute top-1/2 left-1/2 -translate-x-1/2"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="relative 3xl:left-0 2xl:left-0 xl:left-0 lg:-left-[9%]">
                                                    <div className=" w-full 3xl:h-[38px] 2xl:h-[38px] xl:h-[38px] lg:h-[50px]">
                                                        <div className="3xl:w-[2px] 2xl:w-[1px] xl:w-[1px] lg:w-[1px] h-full bg-[#3276FA] relative mt-3 mx-auto -left-1">
                                                            <ArrowUp2
                                                                size="32"
                                                                color="#3276FA"
                                                                className="absolute bottom-0 translate-y-1/2 rotate-180 right-[1px] 3xl:scale-100 2xl:scale-75 xl:scale-50 lg:scale-50 translate-x-1/2 z-10"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center w-full relative">
                                                        <div className=" bg-[#E2F0FE] rounded mt-2 ">
                                                            <div className="grid grid-cols-12  p-2.5 px-1">
                                                                <div className="col-span-1 ">
                                                                    <div className="w-4 h-4   bg-[#3276FA] text-white rounded-full text-center text-[10px] flex items-center justify-center">
                                                                        4
                                                                    </div>
                                                                </div>
                                                                <div className="col-span-11 text-[8.5px] p-2 3xl:text-base 2xl:text-sm xl:text-xs lg:text-xs text-center">
                                                                    Kiểm tra
                                                                    tình trạng
                                                                    kho NVL/BTP
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="absolute 3xl:w-1/2 2xl:w-1/2 xl:w-[35%] lg:w-[28%] h-full top-1/2 -right-5 translate-x-full">
                                                            <div className="w-full 3xl:h-[2px] 2xl:h-[1px] xl:h-[1px] lg:h-[1px] bg-[#3276FA] relative mt-3 mx-auto -left-1">
                                                                <ArrowUp2
                                                                    size="32"
                                                                    color="#3276FA"
                                                                    className="absolute 3xl:bottom-0 2xl:bottom-0 xl:bottom-[0.5px] lg:bottom-0 translate-y-1/2 rotate-90 right-[1px] translate-x-1/2 z-10 3xl:scale-100 2xl:scale-75 xl:scale-50 lg:scale-50"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative 3xl:-top-[4%] 2xl:-top-[18%] xl:-top-[13%] lg:-top-[27%] left-[2px] -translate-x-[6%]">
                                        <div className="border-r-2 border-b-2 border-[#3276FA] 3xl:w-[264px] xxl:h-[56px] xxl:w-[190px] 3xl:h-[115px] 2xl:h-[25px] 2xl:w-[208px] xl:w-[170px] xl:h-[28px] lg:w-[145px] lg:h-[42px] rounded-br-[30px] relative">
                                            <ArrowUp2
                                                size="32"
                                                color="#3276FA"
                                                className="absolute top-0 -translate-y-1/2  right-[-1px] translate-x-1/2 3xl:scale-100 2xl:scale-75 xl:scale-50 lg:scale-50"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-1 max-h-14">
                                    <div className="ml-4">
                                        <div className=" bg-lime-200 inline-block ">
                                            <div className="grid grid-cols-6  3xl:py-1 2xl:py-1 xl:py-1 lg:py-1 pr-1 pl-1  ">
                                                <div className="col-span-1 p-0">
                                                    <div className="w-4 h-4  bg-lime-600 text-white rounded-full text-center text-[10px] ">
                                                        1
                                                    </div>
                                                </div>
                                                <div className="col-span-5 p-2 3xl:text-base 2xl:text-sm xl:text-xs lg:text-xs text-center ">
                                                    Giao hàng
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="3xl:h-[120px] 2xl:h-[80px] xl:h-[80px] lg:h-[80px] w-full mx-auto border-l-2 -translate-x-[2px] border-b-2 rounded-bl-[35px] border-[#3276FA] relative left-1/2 top-2">
                                        <ArrowUp2
                                            size="32"
                                            color="#3276FA"
                                            className="absolute top-0 -translate-y-1/2  3xl:left-[-1px] 2xl:left-[-1px] -translate-x-1/2 3xl:scale-100 2xl:scale-75 xl:scale-50 lg:scale-50"
                                        />
                                    </div>
                                </div>
                                <div className="col-span-5 grid grid-cols-5">
                                    <div className="grid grid-cols-5 col-span-5 max-h-[250px]">
                                        <div className="3xl:w-full 2xl:w-[99%] xl:w-[99%] lg:w-[99%] 3xl:h-[2px] 2xl:h-[1px] xl:h-[1px] lg:h-[1px] bg-[#D0D5DD] col-span-4 mt-9 relative">
                                            <ArrowUp2
                                                size="32"
                                                color="#D0D5DD"
                                                className="absolute top-0 -translate-y-1/2 rotate-90 right-0 translate-x-1/2 3xl:scale-100 2xl:scale-75 xl:scale-50 lg:scale-50"
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <div className="col-span-6 grid">
                                                <div>
                                                    <div className="">
                                                        <div className="mx-auto max-h-[74px] h-[74px] w-[74px] max-w-[74px] bg-black rounded-full text-white flex items-center justify-center text-sm">
                                                            Kết thúc
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-1 relative 3xl:top-8 2xl:top-[-25%] xl:top-[-35%] lg:top-[-40%] translate-x-1/2 translate-y-1/2">
                                            <div className="grid grid-cols-12  p-2.5 px-1 bg-[#E2F0FE] rounded mt-2">
                                                <div className="col-span-1 ">
                                                    <div className="w-4 h-4   bg-[#3276FA] text-white rounded-full text-center text-[10px] flex items-center justify-center">
                                                        10
                                                    </div>
                                                </div>
                                                <div className="col-span-11 p-2 3xl:text-base 2xl:text-sm xl:text-xs lg:text-xs  text-center">
                                                    Hoàn thành sản xuất
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-3 relative 3xl:top-full 2xl:top-[35%] xl:top-[30%] lg:top-[20%] translate-y-[43%] -right-[20%]">
                                            <div className="border-r-2 border-t-2 rounded-tr-[35px] border-[#3276FA] w-full col-span-3  absolute 3xl:h-[87%] 2xl:h-1/2 xl:h-1/2 lg:h-1/2 top-0">
                                                <ArrowUp2
                                                    size="32"
                                                    color="#3276FA"
                                                    className="absolute top-[-1px] -translate-y-1/2 -rotate-90 left-0 -translate-x-1/2 3xl:scale-100 2xl:scale-75 xl:scale-50 lg:scale-50"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-span-4"></div>
                                        <div className="col-span-1 relative 3xl:top-1/2 2xl:-top-1/2 xl:top-[-39%] lg:-top-[40%] translate-y-1/2 -right-5">
                                            <div className="grid grid-cols-12  p-2.5 px-1 bg-[#E2F0FE] rounded mt-2">
                                                <div className="col-span-1 ">
                                                    <div className="w-4 h-4   bg-[#3276FA] text-white rounded-full text-center text-[10px] flex items-center justify-center">
                                                        9
                                                    </div>
                                                </div>
                                                <div className="col-span-11 p-2 3xl:text-base 2xl:text-sm xl:text-xs lg:text-xs text-center">
                                                    Hoàn thành công đoạn thành
                                                    phẩm
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-4"></div>
                                        <div className="mx-auto">
                                            <div className="w-[2px] 3xl:w-[2px] xxl:top-[60%] 2xl:w-[1px] xl:w-[1px] lg:w-[1px]  absolute h-[25px] bg-[#3276FA] 3xl:top-[56%] 2xl:top-[56%] xl:top-[64%] translate-y-6  translate-x-4">
                                                <ArrowUp2
                                                    size="32"
                                                    color="#3276FA"
                                                    className="absolute top-0 -translate-y-1/2  3xl:left-0 2xl:left-0 xl:left-[0.5px] -translate-x-1/2 3xl:scale-100 2xl:scale-75 xl:scale-50 lg:scale-50"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-2  border-[#F7DA3F] border-l-2 border-t-2 rounded-tl-[35px] relative mt-8 mr-4 max-h-[150px] 3xl:h-[200px] 2xl:h-[118px] xl:h-[93px] lg:h-[90px]">
                                        <div className="absolute top-0 p-2 left-1/2 3xl:text-base 2xl:text-sm xl:text-xs lg:text-xs -translate-x-1/2 -translate-y-1/2 bg-white max-w-[130px] text-center">
                                            Đủ 1 phần kho NVL/BTP
                                        </div>
                                        <ArrowUp2
                                            size="32"
                                            color="#F7DA3F"
                                            className="absolute top-0 -translate-y-1/2  3xl:scale-100 2xl:scale-75 xl:scale-50 lg:scale-50 rotate-90 right-0 translate-x-1/2"
                                        />
                                    </div>
                                    <div className=" bg-[#F7DA3F] rounded mt-2 col-span-1 max-h-[60px]">
                                        <div className="grid grid-cols-12  py-2 pl-2 ">
                                            <div className="col-span-1 ">
                                                <div className="w-4 h-4  bg-[#FF7E06] text-white rounded-full text-center text-[10px] flex items-center justify-center">
                                                    1
                                                </div>
                                            </div>
                                            <div className="col-span-11 p-2 3xl:text-base 2xl:text-sm xl:text-xs lg:text-xs text-center">
                                                Giữ kho
                                            </div>
                                        </div>
                                        <div className="bg-[#3276FA] 3xl:w-[2px] 2xl:w-[1px]  xl:w-[1px] lg:w-[1px] 3xl:h-[175%] 2xl:h-[80%] xl:h-[68%] lg:h-[30%] mx-auto mt-3 relative">
                                            <ArrowUp2
                                                size="32"
                                                color="#3276FA"
                                                className="absolute bottom-0 left-[1px]  3xl:scale-100 2xl:scale-75 xl:scale-50 lg:scale-50 -translate-x-1/2 translate-y-1/2 rotate-180"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-2"></div>
                                    <div className="col-span-2 grid grid-cols-9 items-center relative -top-2">
                                        <div className="3xl:w-[32px] 3xl:h-[32px] 2xl:w-[29px] 2xl:h-[30px] xl:w-[20px] xl:h-[20px] lg:w-[20px] lg:h-[20px] bg-[#3276FA] rotate-45 rounded relative 3xl:left-0 2xl:left-0 xl:left-0 lg:left-[-50%]  3xl:-translate-x-3.5 2xl:-translate-x-3 xl:-translate-x-2.5 col-span-1"></div>
                                        <div className="w-[95%] h-[2px] bg-[#32C100] rounded  col-span-8 relative">
                                            <ArrowUp2
                                                size="32"
                                                color="#32C100"
                                                className="absolute bottom-[1px] right-0  3xl:scale-100 2xl:scale-75 xl:scale-50 lg:scale-50 translate-x-1/2 translate-y-1/2 rotate-90"
                                            />
                                        </div>
                                        <div className="absolute max-w-[70px] bg-white left-1/2 -translate-x-1/2 text-center 3xl:text-base 2xl:text-sm xl:text-xs lg:text-xs">
                                            Đủ kho NVL/BTP
                                        </div>
                                    </div>
                                    <div className="col-span-1 relative">
                                        <div className="grid grid-cols-12  3xl:p-2.5 2xl:p-2.5 xl:p-1.5 lg:p-1 px-1 bg-[#E2F0FE] rounded absolute 3xl:top-[-15%] 2xl:top-[-55%] xl:top-[-50%] lg:-top-2/3">
                                            <div className="col-span-1 ">
                                                <div className="w-4 h-4   bg-[#3276FA] text-white rounded-full text-center text-[10px] flex items-center justify-center">
                                                    6
                                                </div>
                                            </div>
                                            <div className="col-span-11 3xl:p-2 2xl:p-2 xl:p-1.5 lg:p-1 3xl:text-base 2xl:text-sm xl:text-xs lg:text-xs text-center">
                                                Sản xuất
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-2 grid grid-cols-4 items-center mb-4 gap-2 ml-2 relative">
                                        <div className="w-full 3xl:h-[2px] 2xl:h-[1px] xl:h-[1px] lg:h-[1px] bg-[#3276FA]  col-span-1 relative">
                                            <ArrowUp2
                                                size="32"
                                                color="#3276FA"
                                                className="absolute bottom-[1px]  3xl:scale-100 2xl:scale-75 xl:scale-50 lg:scale-50 right-0 translate-x-1/2 translate-y-1/2 rotate-90"
                                            />
                                        </div>
                                        <div className="absolute left-[26%]">
                                            <div className="3xl:w-[70px] 3xl:h-[80px] 2xl:w-[50px] 2xl:h-[60px] xl:w-[40px] xl:h-[55px] lg:w-[35px] lg:h-[45px]  relative ">
                                                <img src="/proces_sales/Subtract3.png" />
                                                <div className="absolute text-[10px] font-medium flex 3xl:text-[8px]  2xl:text-[6px] xl:text-[5px] lg:text-[4.5px]  flex-wrap uppercase top-1  left-2">
                                                    <span className="">
                                                        Lệnh sản
                                                    </span>
                                                    <span>Xuất tổng</span>
                                                </div>
                                                <img
                                                    src="/proces_sales/Frame3.png"
                                                    className="absolute top-1/2 left-1/2 -translate-x-1/2"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-span-1"></div>
                                        <div className="w-[50%] 3xl:h-[2px] 2xl:h-[1px] xl:h-[1px] lg:h-[1px] bg-[#3276FA]  col-span-1 relative ml-2">
                                            <ArrowUp2
                                                size="32"
                                                color="#3276FA"
                                                className="absolute bottom-[1px]  3xl:scale-100 2xl:scale-75 xl:scale-50 lg:scale-50 right-0 translate-x-1/2 translate-y-1/2 rotate-90"
                                            />
                                        </div>
                                        <div className="absolute 3xl:left-[68%] 2xl:left-[72%] xl:left-[72%] lg:left-[73%]">
                                            <div className="3xl:w-[70px] 3xl:h-[80px] 2xl:w-[50px] 2xl:h-[60px] xl:w-[40px] xl:h-[55px] lg:w-[35px] lg:h-[45px]  relative ">
                                                <img src="/proces_sales/Subtract3.png" />
                                                <div className="absolute text-[10px] font-medium flex 3xl:text-[8px]  2xl:text-[6px] xl:text-[5px] lg:text-[4.5px] flex-wrap uppercase top-1  left-2">
                                                    <span className="">
                                                        Lệnh sx
                                                    </span>
                                                    <span>Chi tiết</span>
                                                </div>
                                                <img
                                                    src="/proces_sales/Frame3.png"
                                                    className="absolute top-1/2 left-1/2 -translate-x-1/2"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-7 grid grid-cols-5"></div>
                                <div className="col-span-5 grid grid-cols-9">
                                    <div className="col-span-1 3xl:w-[100px] 2xl:w-[80px] 3xl:h-[125px] 2xl:h-[70px] border-[#EE1E1E] border-l-2 border-b-2 rounded-bl-[30px] relative">
                                        <div className="text-[#EE1E1E] absolute top-1/2 -translate-y-1/2 3xl:text-base 2xl:text-sm xl:text-xs lg:text-xs left-0 -translate-x-1/3 bg-white">
                                            Hết kho NVL/BTP
                                        </div>
                                        <ArrowUp2
                                            size="32"
                                            color="#EE1E1E"
                                            className="absolute bottom-[-1px]  3xl:scale-100 2xl:scale-75 xl:scale-50 lg:scale-50 rotate-90  translate-y-1/2  right-[-1px] translate-x-1/2"
                                        />
                                    </div>
                                    <div className="col-span-1 mx-auto ">
                                        <div className="absolute 3xl:bottom-0 2xl:bottom-[7%] xl:bottom-[-2%] lg:bottom-[-1%]">
                                            <div className="3xl:w-[70px] 3xl:h-[80px] 2xl:w-[50px] 2xl:h-[60px] xl:w-[40px] xl:h-[55px] lg:w-[35px] lg:h-[45px]  relative ">
                                                <img src="/proces_sales/Subtract3.png" />
                                                <div className="absolute text-[10px] font-medium flex 3xl:text-[8px]  2xl:text-[6px] xl:text-[5px] lg:text-[4.5px] flex-wrap uppercase top-1  left-2">
                                                    <span className="">
                                                        Yêu cầu
                                                    </span>
                                                    <span>Mua hàng</span>
                                                </div>
                                                <img
                                                    src="/proces_sales/Frame3.png"
                                                    className="absolute top-1/2 left-1/2 -translate-x-1/2"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-1 relative w-[120%]">
                                        <div className="bg-[#3276FA] w-full 3xl:h-[2px] 2xl:h-[2px] xl:h-[1px] lg:h-[1px] absolute bottom-0 left-1/2">
                                            <ArrowUp2
                                                size="32"
                                                color="#3276FA"
                                                className="absolute bottom-[1px]  3xl:scale-100 2xl:scale-75 xl:scale-50 lg:scale-50 rotate-90  translate-y-1/2  right-[-1px] translate-x-1/2"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-3 mx-auto mt-2">
                                        <div className="bg-[#3276FA] 3xl:w-[2px] 2xl:w-[1px] xl:w-[1px] lg:w-[1px] 3xl:h-[73%] 2xl:h-[40%] xl:h-[39%] lg:h-[56%] relative 3xl:top-[3px] 2xl:top-[15%] xl:top-[16%] left-1/2">
                                            <ArrowUp2
                                                size="32"
                                                color="#3276FA"
                                                className="absolute top-0  3xl:scale-100 2xl:scale-75 xl:scale-50 lg:scale-50  -translate-y-1/2 3xl:right-[1px] xxl:right-[27%] 2xl:right-[1px] xl:right-[1px] lg:right-[1px] translate-x-1/2"
                                            />
                                        </div>
                                        <div className="mt-1">
                                            <div className="3xl:w-[70px] 3xl:h-[80px] 2xl:w-[50px] 2xl:h-[60px] xl:w-[40px] xl:h-[55px] lg:w-[35px] lg:h-[45px]  relative ">
                                                <img src="/proces_sales/Subtract3.png" />
                                                <div className="absolute text-[10px] 3xl:text-[7px] p-1  2xl:text-[6px] xl:text-[5px] lg:text-[4.5px] font-medium flex  flex-wrap uppercase top-1  left-2">
                                                    <span className="">
                                                        Đơn đặt
                                                    </span>
                                                    <span>Hàng</span>
                                                </div>
                                                <img
                                                    src="/proces_sales/Frame3.png"
                                                    className="absolute top-1/2 left-1/2 -translate-x-1/2"
                                                />
                                            </div>
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
                                Quy trình tổng quan bán hàng - sản xuất
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
