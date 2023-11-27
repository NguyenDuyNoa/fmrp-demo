import React from "react";
import Head from "next/head";
import Image from "next/image";

import { ArrowRight2 as IconRight } from "iconsax-react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import useStatusExprired from "@/hooks/useStatusExprired";
import { routerDeliveryReceipt, routerPriceQuote, routerReturnSales, routerSalesOrder } from "@/routers/sellingGoods";

const Index = () => {
    const trangthaiExprired = useStatusExprired();
    const router = useRouter();
    return (
        <React.Fragment>
            <Head>
                <title>Quy trình bán hàng</title>
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
                            <h6>Quy trình bán hàng</h6>
                        </div>
                    )}
                    <h2 className="3xl:text-3xl 2xl:text-2xl xl:text-2xl lg:text-2xl text-xl font-medium">
                        Quy Trình Bán Hàng
                    </h2>
                </div>

                <div className="h-[100%] w-[100%] pt-8 relative border border-slate-100 flex-col flex">
                    <div className="h-full w-full rounded-lg relative z-10 py-10 px-10 space-y-4 flex flex-col justify-between">
                        <div className="h-[100%] w-full space-y-6">
                            <div className="h-full w-full 3xl:ml-16 2xl:ml-0 xl:ml-5 xl:pb-16 lg:pb-32 flex flex-row justify-start items-center gap-2">
                                <div className="3xl:h-24 3xl:w-24 2xl:h-20 2xl:w-20 xl:h-16 xl:w-16 lg:h-16 lg:w-16 rounded-full flex flex-col justify-center items-center bg-[#3276FA] text-white">
                                    <h5 className="3xl:text-xl 2xl:text-[15px] xl:text-[14px] lg:text-[14px] text-center">
                                        Bắt đầu
                                    </h5>
                                </div>

                                <div className="flex items-center -space-x-5">
                                    <div className="h-0.5 bg-[#3276FA] 2xl:w-20 xl:w-12 lg:w-8" />
                                    <IconRight size="32" className="text-[#3276FA]" />
                                </div>

                                <button
                                    type="button"
                                    onClick={() => router.push(routerPriceQuote.home)}
                                    className="hover:scale-[1.03] transition-all ease-in-out 3xl:h-[96px] 3xl:w-[180px] 2xl:h-[80px] 2xl:w-[170px] xl:h-[64px] xl:w-[130px] lg:h-[60px] lg:w-[100px] flex space-x-3 border-none bg-[#E2F0FE] rounded-md  items-center justify-center relative"
                                >
                                    <h5>Báo giá </h5>
                                    <h5 className="h-4 w-4 top-[8%] 2xl:-left-[2%] xl:-left-[2%] lg:-left-[2%] 2xl:text-sm xl:text-sm lg:text-[12px] rounded-full flex flex-col justify-center items-center bg-[#3276FA] absolute text-white ">
                                        1
                                    </h5>
                                </button>

                                <div className="flex items-center -space-x-5">
                                    <div className="h-0.5 bg-[#3276FA] 3xl:w-20 2xl:w-20 xl:w-12 lg:w-10" />
                                    <IconRight size="32" color="#3276FA" variant="Outline" />
                                </div>

                                <div className="group 3xl:h-[96px] 3xl:w-[180px] 2xl:h-[80px] 2xl:w-[170px] xl:h-[64px] xl:w-[130px] lg:h-[60px] lg:w-[120px] flex space-x-3 border-none bg-[#E2F0FE] rounded-md  items-center justify-center relative">
                                    {/* <h5 className="3xl:max-w-[180px] 2xl:max-w-[170px] xl:max-w-[80px] lg:max-w-[100px] text-center">
                                        Tạo đơn hàng
                                    </h5>
                                    <h5 className="h-4 w-4 top-[8%] 2xl:-left-[2%] xl:-left-[2%] lg:-left-[2%] 2xl:text-sm xl:text-sm lg:text-[12px] rounded-full flex flex-col justify-center items-center bg-[#3276FA] absolute text-white ">
                                        2
                                    </h5> */}
                                    <button
                                        type="button"
                                        onClick={() => router.push(routerSalesOrder.home)}
                                        className="group-hover:scale-[1.03] transition-all ease-in-out 3xl:h-[96px] 3xl:w-[180px] 2xl:h-[80px] 2xl:w-[170px] xl:h-[64px] xl:w-[130px] lg:h-[60px] lg:w-[120px] flex space-x-3 border-none bg-[#E2F0FE] rounded-md  items-center justify-center"
                                    >
                                        <h5>Tạo đơn hàng</h5>
                                    </button>
                                    <h5 className="group-hover:scale-[1.03] h-4 w-4 top-[8%] 2xl:-left-[2%] xl:-left-[2%] lg:-left-[2%] 2xl:text-sm xl:text-sm lg:text-[12px] rounded-full flex flex-col justify-center items-center bg-[#3276FA] absolute text-white ">
                                        2
                                    </h5>

                                    {/* top image đơn hàng*/}
                                    <div className="flex flex-col items-center -space-y-5 absolute 3xl:-top-[60%] 2xl:-top-[60%] xl:-top-[80%] lg:-top-[80%] 3xl:left-[38%] 2xl:left-[36%] xl:left-[32%] lg:left-[30%]">
                                        <IconRight className="-rotate-90" size="32" color="#B2B9C8" variant="Outline" />
                                        <div className="w-0.5 bg-[#B2B9C8] 3xl:h-10 2xl:h-8 xl:h-8 lg:h-8" />
                                    </div>

                                    <div className="absolute 3xl:-top-[160%] 2xl:-top-[155%] xl:-top-[165%] lg:-top-[175%]">
                                        <Image
                                            alt=""
                                            src="/process_products/Subtract.png"
                                            width={600}
                                            height={220}
                                            className="object-contain 3xl:h-[100px] 2xl:h-[80px] xl:h-[60px] lg:h-[60px] relative"
                                            loading="lazy"
                                            crossOrigin="anonymous"
                                            placeholder="blur"
                                            blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                        />
                                        <span className="3xl:translate-x-[-60%] 3xl:translate-y-[-60%] 2xl:translate-x-[-56%] 2xl:translate-y-[-60%] xl:translate-x-[-60%] xl:translate-y-[-60%] lg:translate-x-[-120%] lg:translate-y-[-50%] 3xl:top-[30%] 2xl:top-[30%] xl:top-[32%] lg:top-[30%] 2xl:left-[52%] lg:left-[68%] 3xl:text-[10px] 2xl:text-[8px] xl:text-[7px] lg:text-[7px] 2xl:p-3 xl:p-2 lg:p-2 font-[600] absolute select-none pointer-events-none ">
                                            <span className="uppercase">Đơn đặt hàng</span>
                                            <Image
                                                alt=""
                                                src="/process_products/Frame.png"
                                                width={600}
                                                height={220}
                                                className="object-contain 3xl:-bottom-[50%] 3xl:h-[30px] 2xl:-bottom-[50%] 2xl:h-[26px] xl:-bottom-[50%] xl:h-[20px] lg:-bottom-[25%] lg:h-[18px] 3xl:left-[6%] 2xl:left-[2%] xl:left-[2%] lg:left-[16%] absolute"
                                                loading="lazy"
                                                crossOrigin="anonymous"
                                                placeholder="blur"
                                                blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                            />
                                        </span>
                                    </div>

                                    {/* fix */}
                                    <div className="flex flex-col items-center absolute top-[80%] left-[45%]">
                                        <div className="3xl:w-[180px] 3xl:h-[255px] 2xl:w-[180px] 2xl:h-[205px] xl:w-[120px] xl:h-44 lg:w-[110px] lg:h-[180px] border rounded-t-none rounded-b-none rounded-bl-[20px] border-dashed border-[#B2B9C8] border-t-0 border-r-0 rounded 2xl:mt-6 xl:mt-4 lg:mt-3">
                                            <div className="3xl:top-[30%] 2xl:top-[26%] xl:top-[28%] lg:top-[30%] 2xl:text-[16px] xl:text-[16px] lg:text-[14px] border-b rounded-bl-[20px] border-dashed border-[#B2B9C8] text-center relative ">
                                                Giữ kho
                                                <IconRight
                                                    className="text-[#B2B9C8] absolute top-0 right-0 translate-x-[50%] 3xl:translate-y-[25%] 2xl:translate-y-[25%] xl:translate-y-[25%] lg:translate-y-[20%] 3xl:scale-100 2xl:scale-90 xl:scale-90 lg:scale-90"
                                                    size="32"
                                                    variant="Outline"
                                                />
                                            </div>

                                            <IconRight
                                                className="text-[#B2B9C8] absolute bottom-0 right-0 translate-x-[50%] 3xl:translate-y-[50%] 2xl:translate-y-[50%] xl:translate-y-[50%] lg:translate-y-[50%] 3xl:scale-100 2xl:scale-90 xl:scale-90 lg:scale-90"
                                                size="32"
                                                variant="Outline"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center -space-x-5">
                                    <div className="h-0.5 bg-[#3276FA] 3xl:w-20 2xl:w-20 xl:w-12 lg:w-10" />
                                    <IconRight size="32" color="#3276FA" variant="Outline" />
                                </div>

                                <div className="group 3xl:h-[96px] 3xl:w-[180px] 2xl:h-[80px] 2xl:w-[170px] xl:h-[64px] xl:w-[130px] lg:h-[60px] lg:w-[120px] flex space-x-3 border-none bg-[#E2F0FE] rounded-md  items-center justify-center relative">
                                    <button
                                        type="button"
                                        onClick={() => router.push(routerDeliveryReceipt.home)}
                                        className="group-hover:scale-[1.03] transition-all ease-in-out 3xl:h-[96px] 3xl:w-[180px] 2xl:h-[80px] 2xl:w-[170px] xl:h-[64px] xl:w-[130px] lg:h-[60px] lg:w-[120px] flex space-x-3 border-none bg-[#E2F0FE] rounded-md  items-center justify-center"
                                    >
                                        <h5>Xuất kho giao hàng</h5>
                                    </button>
                                    <h5 className="group-hover:scale-[1.03] transition-all ease-in-out h-4 w-4 top-[8%] 2xl:-left-[2%] xl:-left-[2%] lg:-left-[2%] 2xl:text-sm xl:text-sm lg:text-[12px] rounded-full flex flex-col justify-center items-center bg-[#3276FA] absolute text-white ">
                                        3
                                    </h5>
                                    {/* <button
                                        onClick={() => router.push("/accountant/debt_suppliers?tab=all")}
                                        className=" 3xl:max-w-[180px] 2xl:max-w-[170px] xl:max-w-[80px] lg:max-w-[100px]   p-1 text-center px-14 rounded py-9 bg-[#E2F0FE] hover:scale-[1.03] transition-all ease-in-out"
                                    >
                                        <h5>Xuất kho giao hàng</h5>
                                    </button>
                                    <h5 className="h-4 w-4 top-[8%] 2xl:-left-[2%] xl:-left-[2%] lg:-left-[2%] 2xl:text-sm xl:text-sm lg:text-[12px] rounded-full flex flex-col justify-center items-center bg-[#3276FA] absolute text-white ">
                                        3
                                    </h5> */}

                                    {/* bottom xuất kho hàng*/}
                                    <div className="absolute 3xl:top-[110%] 3xl:left-[42%] 2xl:top-[110%] 2xl:left-[42%] xl:top-[110%] xl:left-[40%] lg:top-[115%] lg:left-[40%]">
                                        <div className=" border-[#B2B9C8] border-t-0 border-r-0 border-y-0 absolute mb-2">
                                            <IconRight
                                                className="text-[#B2B9C8] absolute top-0 left-0 -translate-x-[47%] -translate-y-[36%] -rotate-90"
                                                size="32"
                                            />
                                            <div className="w-0.5 bg-[#B2B9C8] 3xl:h-10 2xl:h-8 xl:h-8 lg:h-8" />
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => router.push("/warehouses/warehouse")}
                                        className="hover:scale-[1.03] transition-all ease-in-out 3xl:h-[96px] 3xl:w-[180px] 2xl:h-[78px] 2xl:w-[170px] xl:h-[64px] xl:w-[130px] lg:h-[60px] lg:w-[130px] 3xl:top-[160%] 3xl:right-[2%] 2xl:top-[160%] 2xl:-left-[6%] xl:top-[170%] xl:right-[2%] lg:top-[175%] lg:-right-[2%] flex border rounded-md items-center justify-center absolute"
                                    >
                                        <h5>Kho hàng</h5>
                                    </button>

                                    <div className="3xl:top-[270%] 3xl:left-[42%] 2xl:top-[265%] 2xl:left-[42%] xl:top-[280%] xl:left-[40%] lg:top-[290%] lg:left-[40%] absolute">
                                        <div className=" border-[#B2B9C8] border-t-0 border-r-0 border-y-0 absolute mb-2">
                                            <IconRight
                                                className="text-[#B2B9C8] absolute top-0 left-0 -translate-x-[47%] -translate-y-[36%] -rotate-90"
                                                size="32"
                                            />
                                            <div className="w-0.5 bg-[#B2B9C8] 3xl:h-10 2xl:h-8 xl:h-8 lg:h-8" />
                                        </div>
                                    </div>
                                    <div className="3xl:h-[96px] 3xl:w-[180px] 2xl:h-[78px] 2xl:w-[170px] xl:h-[64px] xl:w-[130px] lg:h-[60px] lg:w-[130px] 3xl:top-[320%] 3xl:-left-[6%] 2xl:top-[315%]  2xl:-left-[6%] xl:top-[335%] xl:right-[2%] lg:top-[350%] lg:-right-[2%] items-center justify-center absolute flex border rounded-md ">
                                        <h5>Sản xuất</h5>
                                    </div>
                                </div>

                                <div className="flex items-center -space-x-5 ">
                                    <div className="h-0.5 bg-[#3276FA] 3xl:w-20 2xl:w-20 xl:w-12 lg:w-10" />
                                    <IconRight size="32" color="#3276FA" variant="Outline" />
                                </div>

                                <div className="group 3xl:h-[96px] 3xl:w-[180px] 2xl:h-[80px] 2xl:w-[170px] xl:h-[64px] xl:w-[130px] lg:h-[60px] lg:w-[120px] flex space-x-3 border-none bg-[#E2F0FE] rounded-md  items-center justify-center relative">
                                    {/* <div className="group 3xl:h-[96px] 3xl:w-[180px] 2xl:h-[80px] 2xl:w-[170px] xl:h-[64px] xl:w-[130px] lg:h-[60px] lg:w-[120px] flex space-x-3 border-none bg-[#E2F0FE] rounded-md  items-center justify-center relative"> */}
                                    {/* <h5>Công nợ</h5>
                                    <h5 className="h-4 w-4 top-[8%] 2xl:-left-[2%] xl:-left-[2%] lg:-left-[2%] 2xl:text-sm xl:text-sm lg:text-[12px] rounded-full flex flex-col justify-center items-center bg-[#3276FA] absolute text-white ">
                                        4
                                    </h5> */}
                                    <button
                                        onClick={() => router.push("/accountant/debt_suppliers?tab=all")}
                                        // className=" 3xl:max-w-[180px] 2xl:max-w-[100px] xl:max-w-[100px]   p-1 text-center px-14 rounded py-9 bg-[#E2F0FE] hover:scale-[1.03] transition-all ease-in-out"
                                        className="group-hover:scale-[1.03] transition-all ease-in-out 3xl:h-[96px] 3xl:w-[180px] 2xl:h-[80px] 2xl:w-[170px] xl:h-[64px] xl:w-[130px] lg:h-[60px] lg:w-[120px] flex space-x-3 border-none bg-[#E2F0FE] rounded-md  items-center justify-center"
                                    >
                                        <h5>Công nợ</h5>
                                    </button>
                                    <h5 className="group-hover:scale-[1.03] transition-all ease-in-out xl:h-4 xl:w-4 lg:h-3 lg:w-3 2xl:text-sm  xl:text-sm lg:text-[10px] xl:top-[8%] lg:top-[6%] 2xl:-left-[2%] xl:-left-[6%] lg:-left-[6%] rounded-full flex flex-col justify-center items-center bg-[#3276FA] absolute text-white ">
                                        4
                                    </h5>

                                    <div className="flex flex-col items-center absolute 3xl:top-[115%] 3xl:left-[45%] 2xl:top-[115%] 2xl:left-[45%] xl:top-[115%] xl:left-[40%] lg:top-[120%] lg:left-[40%]">
                                        <div className="3xl:h-10 2xl:h-7 xl:h-8 lg:h-7 border border-dashed border-[#B2B9C8] border-y-0 border-r-0">
                                            <IconRight
                                                className="text-[#B2B9C8] absolute top-0 left-0 -translate-x-[50%] -translate-y-[50%]  3xl:scale-100 2xl:scale-90 xl:scale-90 lg:scale-90 -rotate-90"
                                                size="32"
                                                variant="Outline"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => router.push(routerReturnSales.home)}
                                        className="hover:scale-[1.03] transition-all ease-in-out flex border rounded-md 3xl:h-[96px] 3xl:w-[180px] 2xl:h-[78px] 2xl:w-[170px] xl:h-[64px] xl:w-[130px] lg:h-[60px] lg:w-[120px] 3xl:top-[160%] 3xl:right-[2%] 2xl:top-[160%] 2xl:left-[-6%] xl:top-[170%] xl:left-[-10%] lg:top-[175%] lg:-right-[2%]  items-center justify-center absolute  bg-[#FDE7AE]"
                                    >
                                        <h5 className="3xl:max-w-[180px] 2xl:max-w-[170px] xl:max-w-[80px] lg:max-w-[90px] text-center">
                                            Trả lại hàng bán
                                        </h5>
                                        <h5 className="h-4 w-4 top-[8%] 2xl:left-[4%] xl:left-[4%] lg:left-[1%] 2xl:text-sm xl:text-sm lg:text-[12px] rounded-full flex flex-col justify-center items-center bg-[#DC6803] absolute text-white ">
                                            5
                                        </h5>
                                    </button>
                                    <div className="flex flex-col items-center absolute 3xl:top-[210%] 3xl:-left-[58%] 2xl:top-[205%] 2xl:-left-[62%] xl:top-[220%] xl:-left-[55%] lg:top-[225%] lg:-left-[37%]">
                                        <div className="absolute 3xl:w-[80px] 2xl:w-[88px] xl:w-12 xl:-left-[80%] lg:w-[44px] border-b border-dashed border-[#B2B9C8] text-center">
                                            <IconRight
                                                className="text-[#B2B9C8] absolute top-0 left-0 -rotate-180 3xl:-translate-x-[50%] 3xl:-translate-y-[50%] 2xl:-translate-x-[50%] 2xl:-translate-y-[50%] xl:-translate-x-[50%] xl:-translate-y-[50%] lg:-translate-x-[50%] lg:-translate-y-[50%] 3xl:scale-100 2xl:scale-90 xl:scale-90 lg:scale-90"
                                                size="32"
                                                variant="Outline"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center -space-x-5">
                                    <div className="h-0.5 bg-[#3276FA] 3xl:w-20 2xl:w-20 xl:w-12 lg:w-10" />
                                    <IconRight size="32" color="#3276FA" variant="Outline" />
                                </div>

                                <div className="3xl:h-24 3xl:w-24 2xl:h-20 2xl:w-20 xl:h-16 xl:w-16 lg:h-16 lg:w-16 rounded-full flex flex-col justify-center items-center bg-[#3276FA] text-white">
                                    <h5 className="3xl:text-xl 2xl:text-[15px] xl:text-[14px] lg:text-[14px] text-center">
                                        Kết thúc
                                    </h5>
                                </div>
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
                            <h6 className="2xl:font-[300] xl:font-[300] lg:font-[200]">Quy trình bán hàng</h6>
                        </div>
                    </div>
                    <Image
                        alt=""
                        src="/process/Logo-BG.png"
                        width={1200}
                        height={420}
                        className="3xl:w-[600px] 2xl:w-[500px] xl:w-[400px] lg:w-[300px] left-[2%] bottom-[8%] absolute select-none pointer-events-none object-contain "
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
