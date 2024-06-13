import React from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { ArrowRight2 as IconRight } from "iconsax-react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import useStatusExprired from "@/hooks/useStatusExprired";

const Index = () => {
    const router = useRouter();
    const statusExprired = useStatusExprired();
    return (
        <React.Fragment>
            <Head>
                <title>Quy trình mua hàng - nhập kho</title>
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
                            <h6>Quy trình mua hàng - nhập kho</h6>
                        </div>
                    )}
                    <h2 className="3xl:text-3xl 2xl:text-2xl xl:text-2xl lg:text-2xl text-xl font-medium">
                        Quy Trình Mua Hàng - Nhập Kho
                    </h2>
                </div>

                <div className="h-[100%] w-[100%] pt-8 relative border border-slate-100 flex-col flex">
                    <div className="h-full w-full rounded-lg relative z-10 3xl:px-14 2xl:px-9 xl:px-8 lg:px-4 flex flex-col justify-between">
                        <div className="h-full w-full 3xl:ml-16 2xl:ml-0 xl:ml-5 xl:pb-16 lg:pb-32 flex flex-row justify-start items-center gap-2">
                            <div className="3xl:h-24 3xl:w-24 2xl:h-20 2xl:w-20 xl:h-20 xl:w-20 lg:h-16 lg:w-16 rounded-full flex flex-col justify-center items-center bg-[#3276FA] text-white">
                                <h5 className="3xl:text-xl 2xl:text-[15px] xl:text-[15px] lg:text-[13px] text-center">
                                    Bắt đầu
                                </h5>
                            </div>

                            <div className="flex items-center -space-x-5">
                                <div className="h-0.5 bg-[#3276FA] 2xl:w-20 xl:w-12 lg:w-10" />
                                <IconRight size="32" className="text-[#3276FA]" />
                            </div>

                            {/* <div className="3xl:h-[96px] 3xl:w-[180px] 2xl:h-[84px] 2xl:w-[160px]  xl:h-[70px] xl:w-[140px] lg:h-[70px] lg:w-[120px] flex space-x-3 border-none bg-[#E2F0FE] rounded-md  items-center justify-center relative"> */}
                            <div className="flex space-x-3 border-none  items-center justify-center relative">
                                <button
                                    type="button"
                                    onClick={() => router.push("/purchase_order/purchases?tab=")}
                                    // className="3xl:max-w-[180px] 2xl:max-w-[100px] xl:max-w-[100px] text-sm   p-1 text-center px-6 rounded py-9 bg-[#E2F0FE] hover:scale-[1.03] transition-all ease-in-out"
                                    className="3xl:h-[96px] 3xl:w-[180px] 2xl:h-[80px] 2xl:w-[170px] xl:h-[64px] xl:w-[130px] lg:h-[60px] lg:w-[120px] flex items-center justify-center text-sm   p-1 text-center px-6 rounded py-9 bg-[#E2F0FE] hover:scale-[1.03] transition-all ease-in-out"
                                >
                                    Yêu cầu mua hàng{" "}
                                </button>
                                <h5 className="xl:h-4 xl:w-4 lg:h-3 lg:w-3 xl:text-sm lg:text-[10px] xl:top-[8%] lg:top-[6%] 2xl:-left-[2%] xl:-left-[6%] lg:-left-[6%] rounded-full flex flex-col justify-center items-center bg-[#3276FA] absolute text-white ">
                                    1
                                </h5>

                                <div className="flex flex-col items-center absolute 3xl:top-[110%] 3xl:left-[40%] 2xl:top-[110%] 2xl:left-[45%] xl:top-[120%] xl:left-[40%] lg:top-[120%] lg:left-[40%]">
                                    <div className="3xl:h-14 2xl:h-10 xl:h-8 lg:h-6 border border-dashed border-[#B2B9C8] border-y-0 border-r-0">
                                        <IconRight
                                            className="text-[#B2B9C8] absolute top-0 left-0 -translate-x-[48%] -translate-y-[50%] -rotate-90"
                                            size="32"
                                            variant="Outline"
                                        />
                                    </div>
                                </div>

                                {/* <div className="3xl:h-[96px] 3xl:w-[180px] 2xl:h-[84px] 2xl:w-[160px] xl:h-[70px] xl:w-[140px] lg:h-[70px] lg:w-[120px] 3xl:top-[175%] 2xl:top-[165%] 2xl:left-[-7%] xl:top-[175%] xl:-left-[9%] lg:top-[160%] lg:-left-[11%] flex border rounded-md items-center justify-center absolute"> */}
                                <div className="3xl:h-[96px] 3xl:w-[180px] 2xl:h-[84px] 2xl:w-[160px] xl:h-[70px] xl:w-[140px] lg:h-[70px] lg:w-[120px] 3xl:top-[175%] 2xl:top-[165%] 2xl:left-[-7%] xl:top-[175%] xl:-left-[9%] lg:top-[160%] lg:-left-[11%] flex  rounded-md items-center justify-center absolute">
                                    <button
                                        type="button"
                                        onClick={() => router.push("")}
                                        className="3xl:h-[96px] 3xl:w-[180px] 2xl:h-[84px] 2xl:w-[160px] xl:h-[70px] xl:w-[140px] lg:h-[70px] lg:w-[120px] text-sm   p-1 text-center px-6 rounded py-9  hover:scale-[1.03] transition-all ease-in-out border"
                                    >
                                        Sản xuất
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center -space-x-5">
                                <div className="h-0.5 bg-[#3276FA] 3xl:w-20 2xl:w-20 xl:w-12 lg:w-10" />
                                <IconRight size="32" color="#3276FA" variant="Outline" />
                            </div>

                            {/* <div className="flex space-x-3 border-none bg-[#E2F0FE] rounded-md 3xl:h-[96px] 3xl:w-[180px] 2xl:h-[84px] 2xl:w-[160px] xl:h-[70px] xl:w-[150px] lg:h-[70px] lg:w-[130px] items-center justify-center relative"> */}
                            <div className="flex space-x-3items-center justify-center relative">
                                <button
                                    type="button"
                                    onClick={() => router.push("/purchase_order/order?tab=all")}
                                    // className=" font-medium 2xl:max-w-[180px] xl:max-w-[140px] lg:max-w-[130px] p-1 text-center"
                                    className="3xl:h-[96px] 3xl:w-[180px] 2xl:h-[80px] 2xl:w-[170px] xl:h-[64px] xl:w-[130px] lg:h-[60px] lg:w-[120px] flex items-center justify-center text-sm   p-1 text-center px-3 rounded py-9 bg-[#E2F0FE] hover:scale-[1.03] transition-all ease-in-out"
                                >
                                    Tạo đơn đặt hàng (PO)
                                </button>
                                <h5 className="xl:h-4 xl:w-4 lg:h-3 lg:w-3 xl:text-sm lg:text-[10px] xl:top-[8%] lg:top-[6%] 2xl:-left-[-5%] xl:-left-[6%] lg:-left-[6%] rounded-full flex flex-col justify-center items-center bg-[#3276FA] absolute text-white ">
                                    2
                                </h5>

                                <div className="absolute 3xl:-top-[60%] 3xl:left-[45%] 2xl:-top-[55%] 2xl:left-1/2 xl:-top-[50%] xl:left-[42%] lg:-top-[50%] lg:left-[40%]">
                                    <div className=" border-[#B2B9C8] border-t-0 border-r-0 border-y-0 absolute mb-2">
                                        <IconRight
                                            className="text-[#B2B9C8] absolute top-0 left-0 -translate-x-[47%] -translate-y-[36%] -rotate-90"
                                            size="32"
                                        />
                                        <div className="w-0.5 bg-[#B2B9C8] 3xl:h-12 2xl:h-10 xl:h-8 lg:h-7" />
                                    </div>
                                </div>

                                <div className="absolute 3xl:-top-[175%] 2xl:-top-[160%]  xl:-top-[175%] lg:-top-[160%] ">
                                    <Image
                                        alt=""
                                        src="/process_products/Subtract.png"
                                        width={600}
                                        height={220}
                                        className="object-contain 3xl:h-[100px] 2xl:h-[80px] xl:h-[80px] lg:h-[70px] 3xl:left-0 2xl:-left-[4%] xl:-left-[4%] lg:-left-[4%] relative"
                                        loading="lazy"
                                        crossOrigin="anonymous"
                                        placeholder="blur"
                                        blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                    />
                                    <span className="transform 3xl:translate-x-[-60%] 3xl:translate-y-[-60%] 2xl:translate-x-[-65%] xl:translate-x-[-65%] lg:translate-x-[-65%] lg:translate-y-[-60%] absolute select-none pointer-events-none font-bold 2xl:top-[30%] xl:top-[32%] lg:top-[30%] left-[52%] 3xl:text-[10px] 2xl:text-[9px] xl:text-[8px] lg:text-[7px] 3xl:p-4 2xl:p-3 xl:p-2 lg:p-1">
                                        <span className="uppercase">Đơn đặt hàng</span>
                                        <Image
                                            alt=""
                                            src="/process_products/Frame.png"
                                            width={600}
                                            height={220}
                                            className="object-contain 3xl:-bottom-[50%] 3xl:h-[30px] 2xl:-bottom-[50%] 2xl:h-[24px] xl:-bottom-[70%] xl:h-[24px] lg:-bottom-[100%] lg:h-[24px] 3xl:left-[6%] 2xl:left-[2%] xl:left-[2%] lg:left-[2%] absolute"
                                            loading="lazy"
                                            crossOrigin="anonymous"
                                            placeholder="blur"
                                            blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                        />
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center -space-x-5">
                                <div className="h-0.5 bg-[#3276FA] 2xl:w-20 xl:w-12 lg:w-10" />
                                <IconRight size="32" color="#3276FA" variant="Outline" />
                            </div>

                            {/* <div className="flex space-x-3 border-none bg-[#E2F0FE] rounded-md 3xl:h-[96px] 3xl:w-[180px] 2xl:h-[84px] 2xl:w-[160px] xl:h-[70px] xl:w-[140px] lg:h-[70px] lg:w-[130px] items-center justify-center relative"> */}
                            <div className="flex space-x-3items-center justify-center relative">
                                <button
                                    onClick={() => router.push("/purchase_order/import?tab=all")}
                                    className="3xl:h-[96px] 3xl:w-[180px] 2xl:h-[80px] 2xl:w-[170px] xl:h-[64px] xl:w-[130px] lg:h-[60px] lg:w-[120px] flex items-center justify-center text-sm   p-1 text-center px-14 rounded py-9 bg-[#E2F0FE] hover:scale-[1.03] transition-all ease-in-out"
                                >
                                    Nhập kho
                                </button>
                                <h5 className="xl:h-4 xl:w-4 lg:h-3 lg:w-3 xl:text-sm lg:text-[10px] xl:top-[8%] lg:top-[6%] 2xl:-left-[-5%] xl:-left-[6%] lg:-left-[6%] rounded-full flex flex-col justify-center items-center bg-[#3276FA] absolute text-white ">
                                    3
                                </h5>

                                <div className="flex flex-col items-center absolute top-[105%] left-[20%]">
                                    <div className="3xl:w-[84px] 3xl:h-64 2xl:w-[80px] 2xl:h-48 xl:w-[58px] xl:h-[180px] lg:w-[52px] lg:h-48 rounded-r-none rounded-bl-[20px] border border-dashed border-[#B2B9C8] rounded-t-none border-t-0 border-r-0 rounded ">
                                        <IconRight
                                            className="text-[#B2B9C8] absolute bottom-0 right-0 translate-x-[50%] translate-y-[50%]"
                                            size="32"
                                            variant="Outline"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col items-center absolute 2xl:top-[105%] 2xl:left-[50%] xl:top-[105%] xl:left-[45%] lg:top-[105%] lg:left-[45%]">
                                    <div className="3xl:w-[35px] 3xl:h-[102px] 2xl:w-[38px] 2xl:h-[60px] xl:w-[28px] xl:h-[64px] lg:w-[26px] lg:h-[74px] rounded-bl-[20px] border-[2px] border-[#B2B9C8] rounded-t-none border-t-0 border-r-0 rounded ">
                                        <IconRight
                                            className="text-[#B2B9C8] absolute bottom-0 right-0 translate-x-[30%] translate-y-[45%]"
                                            size="32"
                                            variant="Outline"
                                        />
                                    </div>
                                </div>

                                {/* <div className="3xl:h-[96px] group 3xl:w-[180px] 2xl:h-[84px] 2xl:w-[160px] xl:h-[70px] xl:w-[140px] lg:h-[70px] lg:w-[120px] 3xl:top-[160%] 3xl:left-[75%] 2xl:top-[120%] 2xl:left-[78%] xl:top-[140%] xl:left-[70%] lg:top-[160%] lg:left-[70%] flex border rounded-md items-center justify-center absolute"> */}
                                <div className="3xl:h-[96px] group 3xl:w-[180px] 2xl:h-[84px] 2xl:w-[160px] xl:h-[70px] xl:w-[140px] lg:h-[70px] lg:w-[120px] 3xl:top-[160%] 3xl:left-[75%] 2xl:top-[120%] 2xl:left-[78%] xl:top-[140%] xl:left-[70%] lg:top-[160%] lg:left-[70%] flex  rounded-md items-center justify-center absolute">
                                    <button
                                        type="button"
                                        onClick={() => router.push("/warehouses/warehouse")}
                                        className="3xl:h-[96px] 3xl:w-[180px] 2xl:h-[80px] 2xl:w-[170px] xl:h-[64px] xl:w-[130px] lg:h-[60px] lg:w-[120px] flex items-center justify-center text-sm   p-1 text-center px-14 rounded py-9 border  hover:scale-[1.03] transition-all ease-in-out"
                                    >
                                        Kho hàng
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center -space-x-5 ">
                                <div className="h-0.5 bg-[#3276FA] 2xl:w-20 xl:w-12 lg:w-10" />
                                <IconRight size="32" color="#3276FA" variant="Outline" />
                            </div>
                            <div className="flex space-x-3 items-center justify-center relative">
                                {/* <div className="flex space-x-3 border-none bg-[#E2F0FE] rounded-md 3xl:h-[96px] 3xl:w-[180px] 2xl:h-[84px] 2xl:w-[160px] xl:h-[70px] xl:w-[140px] lg:h-[70px] lg:w-[130px]  items-center justify-center relative"> */}
                                {/* <h5 className="2xl:max-w-[180px] xl:max-w-[130px] lg:max-w-[130px] p-1 text-center">
                                    Công nợ
                                </h5> */}
                                <button
                                    onClick={() => router.push("/accountant/debt_suppliers?tab=all")}
                                    className="3xl:h-[96px] 3xl:w-[180px] 2xl:h-[80px] 2xl:w-[170px] xl:h-[64px] xl:w-[130px] lg:h-[60px] lg:w-[120px] flex items-center justify-center text-sm   p-1 text-center px-14 rounded py-9 bg-[#E2F0FE] hover:scale-[1.03] transition-all ease-in-out"
                                >
                                    Công nợ
                                </button>
                                <h5 className="xl:h-4 xl:w-4 lg:h-3 lg:w-3 xl:text-sm lg:text-[10px] xl:top-[8%] lg:top-[6%] 2xl:-left-[2%] xl:-left-[6%] lg:-left-[6%] rounded-full flex flex-col justify-center items-center bg-[#3276FA] absolute text-white ">
                                    4
                                </h5>

                                <div className="flex flex-col items-center absolute top-[105%] 3xl:left-[22%] 2xl:left-[16%] xl:left-[20%] lg:left-[18%]">
                                    <div className="3xl:w-[80px] 3xl:h-64 2xl:w-[78px] 2xl:h-48 xl:w-[64px] xl:h-[180px] lg:w-[40px] lg:h-48 border rounded-l-none rounded-br-[20px] border-dashed border-[#B2B9C8] rounded-t-none border-t-0 border-l-0 rounded ">
                                        <IconRight
                                            className="text-[#B2B9C8] absolute top-0 right-0 translate-x-[50%] translate-y-[-35%] -rotate-90"
                                            size="32"
                                            variant="Outline"
                                        />
                                    </div>
                                </div>

                                {/* <div className="flex border rounded-md 3xl:h-[96px] 3xl:w-[180px] 2xl:h-[84px] 2xl:w-[160px] xl:h-[72px] xl:w-[140px] lg:h-[70px] lg:w-[120px] 3xl:top-[320%] 3xl:-left-[85%] 2xl:top-[280%] 2xl:-left-[90%] xl:top-[310%] xl:-left-[84%] lg:top-[330%] lg:-left-[83%]  items-center justify-center absolute  bg-[#FDE7AE]"> */}
                                <div className="flex  3xl:h-[96px] 3xl:w-[180px] 2xl:h-[84px] 2xl:w-[160px] xl:h-[72px] xl:w-[140px] lg:h-[70px] lg:w-[120px] 3xl:top-[320%] 3xl:-left-[85%] 2xl:top-[280%] 2xl:-left-[90%] xl:top-[310%] xl:-left-[84%] lg:top-[330%] lg:-left-[83%]  items-center justify-center absolute  ">
                                    <button
                                        onClick={() => router.push("/purchase_order/returns")}
                                        className="3xl:h-[96px] 3xl:w-[180px] 2xl:h-[80px] 2xl:w-[170px] xl:h-[64px] xl:w-[130px] lg:h-[60px] lg:w-[120px] flex items-center justify-center text-sm   p-1 text-center px-11 rounded py-9  hover:scale-[1.03] transition-all ease-in-out bg-[#FDE7AE]"
                                    >
                                        Trả lại hàng
                                    </button>
                                    <h5 className="xl:h-4 xl:w-4 lg:h-3 lg:w-3 xl:text-sm lg:text-[10px] top-[8%] 2xl:left-[5%] xl:left-[4%] lg:left-[3%] 2xl:text-sm rounded-full flex flex-col justify-center items-center bg-[#DC6803] absolute text-white ">
                                        5
                                    </h5>
                                    <div className="flex flex-col items-center absolute 3xl:-top-[50%] 3xl:left-[50%] 2xl:-top-[50%] 2xl:left-[50%] xl:-top-[55%] xl:left-[50%] lg:-top-[55%] lg:left-[45%]">
                                        <div className="3xl:h-10 2xl:h-9 xl:h-8 lg:h-7 border border-dashed border-[#B2B9C8] border-y-0 border-r-0">
                                            <IconRight
                                                className="text-[#B2B9C8] absolute top-0 left-0 -translate-x-[50%] -translate-y-[50%] -rotate-90"
                                                size="32"
                                                variant="Outline"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center -space-x-5">
                                <div className="h-0.5 bg-[#3276FA] 2xl:w-20 xl:w-12 lg:w-10" />
                                <IconRight size="32" color="#3276FA" variant="Outline" />
                            </div>

                            <div className="3xl:h-24 3xl:w-24 2xl:h-20 2xl:w-20 xl:h-20 xl:w-20 lg:h-16 lg:w-16 rounded-full flex flex-col justify-center items-center bg-[#3276FA] text-white">
                                <h5 className="3xl:text-xl 2xl:text-[15px] xl:text-[15px] lg:text-[13px] text-center">
                                    Kết thúc
                                </h5>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-start 2xl:p-6 2xl:mx-2 xl:p-4 xl:mx-4 lg:px-1 lg:mx-6">
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
                                Quy trình mua hàng - nhập kho
                            </h6>
                        </div>
                    </div>
                    <Image
                        alt=""
                        src="/process/Logo-BG.png"
                        width={1200}
                        height={420}
                        className="3xl:w-[600px] 2xl:w-[450px] xl:w-[350px] lg:w-[320px] left-[2%] bottom-[8%] absolute select-none pointer-events-none object-contain "
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
