import React from "react";
import Head from "next/head";
import Image from "next/image";

import { ArrowUp2, ArrowRight2 as IconRight } from "iconsax-react";
import { useSelector } from "react-redux";

const Index = () => {
    const trangthaiExprired = useSelector((state) => state?.trangthaiExprired);
    const dataSell = [
        {
            name: "Bắt đầu",
            icon: "/procesOvevew/Connector_line.png",
            start: true,
            iconNote: false,
        },
        {
            name: "Nhận yêu cầu báo giá",
            icon: "/procesOvevew/Connector_line.png",
            start: false,
            iconNote: false,
        },
        {
            name: "Tính giá bán",
            icon: "/procesOvevew/Connector_line.png",
            start: false,
            iconNote: false,
            between: true,
            iconSub: (
                <div className="absolute top-[105%] left-[30.5%]">
                    <Image
                        src={"/procesOvevew/ConnectorlinePrice.png"}
                        width={1920}
                        height={1280}
                        className="w-full h-full"
                    />
                </div>
            ),
        },
        {
            name: "Báo giá",
            icon: "/procesOvevew/Connectorline2.png",
            start: false,
            iconNote: false,
        },
        {
            name: {
                nameMain: "Đơn đặt",
                nameSub: "Hàng bán",
            },
            iconNote: true,
            icon: "/procesOvevew/Connectorline2.png",
            start: false,
            between: true,
            iconSub: (
                <div className="absolute top-[105%] -left-[33.5%]">
                    <Image
                        src={"/procesOvevew/ConnectorlineOrder.png"}
                        width={1920}
                        height={1280}
                        className="w-full h-full"
                    />
                </div>
            ),
        },
        {
            name: "Theo dõi tiến độ",
            icon: "/procesOvevew/Connectorline3.png",
            start: false,
            iconNote: false,
        },
        {
            name: {
                nameMain: "Kế hoạch",
                nameSub: "Giao hàng",
            },
            icon: (
                <div className="absolute top-1/2 left-[105%] w-[263px] h-[301px]">
                    <Image
                        src={"/procesOvevew/ConnectorlineLast.png"}
                        width={1920}
                        height={1280}
                        className="w-full h-full"
                    />
                </div>
            ),
            start: false,
            iconNote: true,
            last: true,
        },
    ];
    return (
        <React.Fragment>
            <Head>
                <title>Tổng quan các phân hệ</title>
            </Head>
            <div className="3xl:px-10 3xl:pt-16 3xl:pb-3 2xl:pt-[70px] xl:px-10 px-3 pt-16 pb-3 space-y-1 lg:h-screen overflow-auto flex flex-col justify-between">
                <div className="px-2 py-4">
                    {trangthaiExprired ? (
                        <div className="p-3"></div>
                    ) : (
                        <div className="flex space-x-1 3xl:text-[16px] 2xl:text-[14px] xl:text-[15px] text-[12px]">
                            <h6 className="text-[#141522]/40">Trang chủ</h6>
                            <span className="text-[#141522]/40">/</span>
                            <h6 className="text-[#141522]/40">Quy trình</h6>
                            <span className="text-[#141522]/40">/</span>
                            <h6>Quy trình tổng quan các phân hệ</h6>
                        </div>
                    )}
                    <h2 className="3xl:text-3xl 2xl:text-2xl xl:text-2xl lg:text-2xl text-xl font-normal text-gray-600">
                        Quy trình tổng quan các phân hệ
                    </h2>
                </div>
                <div className="3xl:h-[100%] 2xl:h-[100%] xl:h-[100%] lg:h-[84%] w-[100%]">
                    <div className="grid grid-cols-12 gap-14">
                        <div className="bg-[#EEF9FF] w-full  rounded-2xl col-span-12 h-fit">
                            <div className="p-6">
                                <div className="border-l-[6px] border-[#3276FA]">
                                    <h2 className="ml-2 text-[#6A6A6A] font-normal text-base">Phân hệ</h2>
                                    <h1 className="ml-2 font-medium text-xl">Bán hàng</h1>
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-center gap-1">
                                        {dataSell.map((e) => (
                                            <div className="flex items-center gap-1 relative">
                                                {e.start ? (
                                                    <div className="mx-auto max-h-[74px] h-[74px] w-[74px] max-w-[74px] bg-black rounded-full text-white flex items-center justify-center text-sm">
                                                        Bắt đầu
                                                    </div>
                                                ) : (
                                                    <div>
                                                        {e.iconNote ? (
                                                            <div className="3xl:w-[70px] 3xl:h-[90px] 2xl:w-[50px] 2xl:h-[60px] xl:w-[40px] xl:h-[55px] lg:w-[35px] lg:h-[45px] relative ">
                                                                <img src="/proces_sales/Subtract3.png" />
                                                                <div className="absolute text-[10px] font-medium flex 3xl:text-[10px]  2xl:text-[7px] xl:text-[5.8px] lg:text-[4.5px] flex-wrap uppercase top-1  left-2">
                                                                    <span className="">{e.name.nameMain}</span>
                                                                    <span>{e.name.nameSub}</span>
                                                                </div>
                                                                <Image
                                                                    src={"/proces_sales/Frame3.png"}
                                                                    width={1920}
                                                                    height={1280}
                                                                    className="absolute top-1/2 left-1/2 -translate-x-1/2"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="bg-white rounded-lg border border-[#8590A2] inline-block max-w-[120px] w-[120px] min-h-[76px] h-[76px]">
                                                                <div className="text-center w-full h-full flex items-center justify-center px-2.5">
                                                                    {e.name}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                {(e?.last && e.icon) || (
                                                    <div>
                                                        <Image
                                                            src={e.icon}
                                                            width={1920}
                                                            height={1280}
                                                            className="w-full h-full"
                                                        />
                                                    </div>
                                                )}
                                                {e?.between && e.iconSub}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-8 flex flex-col gap-14">
                            <div className="bg-[#FFF7EB] w-full rounded-2xl col-span-8 h-fit">
                                <div className="p-6">
                                    <div className="grid grid-cols-12 w-full items-center gap-2">
                                        <div className="col-span-12 flex items-center">
                                            <div className="border-l-[6px] border-[#DC6803]">
                                                <h2 className="ml-2 text-[#6A6A6A] font-normal text-base">Phân hệ</h2>
                                                <h1 className="ml-2 font-medium text-xl">Kế hoạch</h1>
                                            </div>
                                            <div className="w-[255px]"></div>
                                            <div className="flex items-center gap-1">
                                                <div className="z-10 min-h-[76px] h-[76px] w-[74px] max-w-[74px] bg-orange-200 rounded-full text-black flex items-center justify-center text-sm">
                                                    BOM
                                                </div>
                                                <div className="">
                                                    <Image
                                                        src={"/procesOvevew/Connectorline2.png"}
                                                        width={1920}
                                                        height={1280}
                                                        className="w-full h-full"
                                                    />
                                                </div>
                                                <div className=" bg-orange-400 rounded-lg border border-orange-400 inline-block max-w-[130px] w-[130px] min-h-[76px] h-[76px]">
                                                    <div className="text-center w-full h-full flex items-center justify-center px-2.5 text-white">
                                                        {"Kế hoạch mua hàng"}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-12 flex items-center justify-center ml-32">
                                            <div className="w-[480px] h-[75px]">
                                                <Image
                                                    src={"/procesOvevew/plan/3t.png"}
                                                    width={1920}
                                                    height={1280}
                                                    className="w-full h-full"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-span-12 flex items-center gap-1">
                                            <div className="max-h-[74px] h-[74px] w-[74px] max-w-[74px] bg-orange-200 rounded-full text-black flex items-center justify-center text-sm">
                                                Hàng tồn
                                            </div>
                                            <div>
                                                <Image
                                                    src={"/procesOvevew/plan/Connectorline3.png"}
                                                    width={1920}
                                                    height={1280}
                                                    className="w-full h-full"
                                                />
                                            </div>
                                            <div className="bg-white relative rounded-lg border border-[#8590A2] inline-block max-w-[120px] w-[120px] min-h-[76px] h-[76px]">
                                                <div className="text-center w-full h-full flex items-center justify-center px-2.5">
                                                    {"Cấn từ hàng tồn kho"}
                                                </div>
                                                <div className="absolute left-1/2 w-[132px] h-[152px]">
                                                    <Image
                                                        src={"/procesOvevew/plan/ConnectorlineBottom1.png"}
                                                        width={1920}
                                                        height={1280}
                                                        className="w-full h-full"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <Image
                                                    src={"/procesOvevew/plan/Connectorline4.png"}
                                                    width={1920}
                                                    height={1280}
                                                    className="w-full h-full"
                                                />
                                            </div>
                                            <div className="flex gap-24">
                                                <div className="bg-orange-200 rounded-lg border border-orange-400 inline-block max-w-[130px] w-[130px] min-h-[76px] h-[76px]">
                                                    <div className="text-center w-full h-full flex items-center justify-center px-2.5">
                                                        {"Nhu cầu vật tư"}
                                                    </div>
                                                </div>
                                                <div className="bg-orange-200 relative rounded-lg border border-orange-400 inline-block max-w-[130px] w-[130px] min-h-[76px] h-[76px]">
                                                    <div className="text-center w-full h-full flex items-center justify-center px-2.5">
                                                        {"Lệnh gia công ngoài"}
                                                    </div>
                                                    <div className="absolute right-1/2  w-[70px] h-[152px]">
                                                        <Image
                                                            src={"/procesOvevew/plan/ConnectorlineBottom2.png"}
                                                            width={1920}
                                                            height={1280}
                                                            className="w-full h-full object-contain"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="bg-orange-200 relative rounded-lg border border-orange-400 inline-block max-w-[130px] w-[130px] min-h-[76px] h-[76px]">
                                                    <div className="text-center w-full h-full flex items-center justify-center px-2.5">
                                                        {"Lệnh sản xuất"}
                                                    </div>
                                                    <div className="absolute left-1/2  w-[260px] h-[167px]">
                                                        <Image
                                                            src={"/procesOvevew/plan/ConnectorlineBottom3.png"}
                                                            width={1920}
                                                            height={1280}
                                                            className="w-full h-full object-contain"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <Image
                                                    src={"/procesOvevew/plan/Connectorline5.png"}
                                                    width={1920}
                                                    height={1280}
                                                    className="w-full h-full"
                                                />
                                            </div>
                                            <div className="bg-white relative rounded-lg border border-[#8590A2] inline-block max-w-[120px] w-[120px] min-h-[76px] h-[76px]">
                                                <div className="text-center w-full h-full flex items-center justify-center px-2.5">
                                                    {"Đề nghị xuất kho"}
                                                </div>
                                                <div className="absolute top-1/2 -translate-y-1/2 -right-full translate-x-1/4">
                                                    <Image
                                                        src={"/procesOvevew/plan/Connectorline6.png"}
                                                        width={1920}
                                                        height={1280}
                                                        className="w-full h-full"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-13 gap-14">
                                <div className="bg-[#F0FFF0] w-full rounded-2xl col-span-7 h-fit">
                                    <div className="p-6">
                                        <div className="grid grid-cols-12">
                                            <div className="col-span-12 grid grid-cols-9">
                                                <div className="border-l-[6px] border-[#0BAA2E] col-span-6">
                                                    <h2 className="ml-2 text-[#6A6A6A] font-normal text-base">
                                                        Phân hệ
                                                    </h2>
                                                    <h1 className="ml-2 font-medium text-xl">Mua hàng</h1>
                                                </div>
                                                <div className="col-span-3 mx-auto">
                                                    <div className=" bg-[#0BAA2E]/20 relative rounded-lg border border-[#60D87A] inline-block max-w-[165px] w-[165px] min-h-[76px] h-[76px]">
                                                        <div className="text-center w-full h-full flex items-center justify-center px-2.5">
                                                            {"Dữ liệu yêu cầu mua hàng"}
                                                        </div>
                                                        <div className="absolute right-1/2  w-[65px] h-[72px]">
                                                            <Image
                                                                src={"/procesOvevew/purchase/Connectorline1.png"}
                                                                width={1920}
                                                                height={1280}
                                                                className="w-full h-full "
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-8">
                                                    <div className="flex items-center  gap-1">
                                                        <div className="flex items-center gap-1">
                                                            <div className=" bg-white relative rounded-lg border border-[#8590A2] inline-block max-w-[150px] w-[150px] min-h-[76px] h-[76px]">
                                                                <div className="text-center w-full h-full flex items-center justify-center px-2.5">
                                                                    {"Chọn nhà cung cấp"}
                                                                </div>
                                                                <div className="w-[70px] absolute left-1/2">
                                                                    <Image
                                                                        src={
                                                                            "/procesOvevew/purchase/Connectorline3.png"
                                                                        }
                                                                        width={1920}
                                                                        height={1280}
                                                                        className="w-full h-full"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="w-[120px]">
                                                                <Image
                                                                    src={"/procesOvevew/purchase/Connectorline2.png"}
                                                                    width={1920}
                                                                    height={1280}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="">
                                                            <div className=" bg-white relative rounded-lg border border-[#8590A2] inline-block max-w-[120px] w-[120px] min-h-[76px] h-[76px]">
                                                                <div className="text-center w-full h-full flex items-center justify-center px-2.5">
                                                                    {"Yêu cầu báo giá"}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="ml-40">
                                                        <div className="flex items-center mt-5 gap-1">
                                                            <div className="flex items-center gap-1">
                                                                <div className="3xl:w-[90px] 3xl:h-[90px] 2xl:w-[50px] 2xl:h-[60px] xl:w-[40px] xl:h-[55px] lg:w-[35px] lg:h-[45px] relative ">
                                                                    <img src="/proces_sales/Subtract3.png" />
                                                                    <div className="absolute text-[10px] font-medium flex 3xl:text-[10px]  2xl:text-[7px] xl:text-[5.8px] lg:text-[4.5px] flex-wrap uppercase top-1  left-2">
                                                                        <span className="">{"Đơn đặt"}</span>
                                                                        <span>{"Hàng mua"}</span>
                                                                    </div>
                                                                    <Image
                                                                        src={"/proces_sales/Frame3.png"}
                                                                        width={1920}
                                                                        height={1280}
                                                                        className="absolute top-1/2 left-1/2 -translate-x-1/2"
                                                                    />
                                                                </div>
                                                                <div className="">
                                                                    <Image
                                                                        src={
                                                                            "/procesOvevew/purchase/Connectorline4.png"
                                                                        }
                                                                        width={1920}
                                                                        height={1280}
                                                                        className="w-full h-full"
                                                                    />
                                                                </div>
                                                                <div className=" bg-white relative rounded-lg border border-[#8590A2] inline-block max-w-[150px] w-[150px] min-h-[76px] h-[76px]">
                                                                    <div className="text-center w-full h-full flex items-center justify-center px-2.5">
                                                                        {"Theo dõi tiến độ"}
                                                                    </div>
                                                                </div>
                                                                <div className="">
                                                                    <Image
                                                                        src={
                                                                            "/procesOvevew/purchase/Connectorline4.png"
                                                                        }
                                                                        width={1920}
                                                                        height={1280}
                                                                        className="w-full h-full"
                                                                    />
                                                                </div>
                                                                <div className=" bg-white relative rounded-lg border border-[#8590A2] inline-block max-w-[150px] w-[150px] min-h-[76px] h-[76px]">
                                                                    <div className="text-center w-full h-full flex items-center justify-center px-2.5">
                                                                        {"Kiểm soát chất lượng"}
                                                                    </div>
                                                                    <div className="w-[1020px] absolute left-1/2">
                                                                        <Image
                                                                            src={
                                                                                "/procesOvevew/purchase/Connectorline5.png"
                                                                            }
                                                                            width={1920}
                                                                            height={1280}
                                                                            className="w-full h-full"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-[#FFF5F5] w-full rounded-2xl col-span-6 h-fit">
                                    <div className="p-6">
                                        <div className="grid grid-cols-12 w-full items-center gap-2">
                                            <div className="col-span-12 flex items-center">
                                                <div className="border-l-[6px] border-[#EE1E1E]">
                                                    <h2 className="ml-2 text-[#6A6A6A] font-normal text-base">
                                                        Phân hệ
                                                    </h2>
                                                    <h1 className="ml-2 font-medium text-xl">Sản xuất</h1>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-[#FFF5FD] w-full rounded-2xl col-span-4 h-fit">
                            <div className="p-6">
                                <div className="border-l-[6px] border-[#EE1EC0]">
                                    <h2 className="ml-2 text-[#6A6A6A] font-normal text-base">Phân hệ</h2>
                                    <h1 className="ml-2 font-medium text-xl">Kho</h1>
                                </div>
                                <div className="flex justify-around items-center mt-[115px]">
                                    <div className="bg-white relative rounded-lg border border-[#8590A2] inline-block max-w-[120px] w-[120px] min-h-[76px] h-[76px]">
                                        <div className="text-center w-full h-full flex items-center justify-center px-2.5">
                                            {"Xuất kho nguyên liệu"}
                                        </div>
                                        <div className="absolute -left-1/3 translate-x-1/2 w-[132px] h-[122px]">
                                            <Image
                                                src={"/procesOvevew/warehouse/Connectorline1.png"}
                                                width={1920}
                                                height={1280}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                    </div>
                                    <div className="bg-white relative rounded-lg border border-[#8590A2] inline-block max-w-[120px] w-[120px] min-h-[76px] h-[76px]">
                                        <div className="text-center w-full h-full flex items-center justify-center px-2.5">
                                            {"Xuất kho bán hàng"}
                                        </div>
                                        <div className="absolute right-1/2 w-[132px] h-[81px]">
                                            <Image
                                                src={"/procesOvevew/warehouse/Connectorline2.png"}
                                                width={1920}
                                                height={1280}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full mx-auto mt-[85px] flex justify-center">
                                    <div className="bg-[#EE1EC0] relative rounded-lg border border-pink-600 inline-block max-w-[110px] w-[110px] min-h-[76px] h-[76px]">
                                        <div className="text-center text-white w-full h-full flex items-center justify-center px-2.5">
                                            {"Quản lý tồn kho"}
                                        </div>
                                        <div className="absolute top-1/2 -right-1/2 translate-x-1/2 w-[73px] h-[83px]">
                                            <Image
                                                src={"/procesOvevew/warehouse/Connectorline3.png"}
                                                width={1920}
                                                height={1280}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-[#EBFFFF] w-full rounded-2xl col-span-12 h-fit">
                            <div className="p-6">
                                <div className="border-l-[6px] border-[#32D6FA]">
                                    <h2 className="ml-2 text-[#6A6A6A] font-normal text-base">Phân hệ</h2>
                                    <h1 className="ml-2 font-medium text-xl">Kho</h1>
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
                                Quy trình tổng quan các phân hệ
                            </h6>
                        </div>
                    </div>

                    {/* <Image
                        alt=""
                        src="/process/Logo-BG.png"
                        width={1200}
                        height={420}
                        className="3xl:w-[600px] 2xl:w-[450px] xl:w-[350px] lg:w-[350px] left-[2%] bottom-[8%] absolute select-none pointer-events-none object-contain "
                        loading="lazy"
                        crossOrigin="anonymous"
                        placeholder="blur"
                        blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                    /> */}
                </div>
            </div>
        </React.Fragment>
    );
};

export default Index;
