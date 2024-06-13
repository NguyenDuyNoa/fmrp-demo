import React from "react";
import Head from "next/head";
import Image from "next/image";

import { ArrowUp2, ArrowRight2 as IconRight } from "iconsax-react";
import { useSelector } from "react-redux";
import useStatusExprired from "@/hooks/useStatusExprired";

const Index = () => {
    const statusExprired = useStatusExprired()
    const dataSell = [
        {
            name: "Bắt đầu",
            // icon: "/procesOvevew/Connector_line.png",
            icon: (
                <>
                    <div className="3xl:w-[65px] xxl:w-[30px] 2xl:w-[27px] xl:w-[28px] lg:w-[20px]">
                        <Image
                            src={"/procesOvevew/Connector_line.png"}
                            width={1920}
                            height={1280}
                            className="w-full h-full"
                        />
                    </div>
                </>
            ),
            start: true,
            iconNote: false,
        },
        {
            name: "Nhận yêu cầu báo giá",
            // icon: "/procesOvevew/Connector_line.png",
            icon: (
                <>
                    <div className="3xl:w-full  xxl:w-[25px] 2xl:w-[27px] xl:w-[28px] lg:w-[20px]">
                        <Image
                            src={"/procesOvevew/Connector_line.png"}
                            width={1920}
                            height={1280}
                            className="w-full h-full"
                        />
                    </div>
                </>
            ),
            start: false,
            iconNote: false,
        },
        {
            name: "Tính giá bán",
            // icon: "/procesOvevew/Connector_line.png",
            icon: (
                <>
                    <div className="3xl:w-full xxl:w-[25px] 2xl:w-[27px] xl:w-[20px] lg:w-[20px]">
                        <Image
                            src={"/procesOvevew/Connector_line.png"}
                            width={1920}
                            height={1280}
                            className="w-full h-full"
                        />
                    </div>
                </>
            ),
            start: false,
            iconNote: false,
            between: true,
            iconSub: (
                <div className="absolute top-[105%] left-[30.5%] xxl:h-[106px] xl:h-[100px] lg:h-[85px]">
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
            // icon: "/procesOvevew/Connectorline2.png",
            icon: (
                <>
                    <div className="3xl:w-full xxl:w-[60px] 2xl:w-[65px] xl:w-[40px] lg:w-[40px]">
                        <Image
                            src={"/procesOvevew/Connectorline2.png"}
                            width={1920}
                            height={1280}
                            className="w-full h-full"
                        />
                    </div>
                </>
            ),
            start: false,
            iconNote: false,
        },
        {
            name: {
                nameMain: "Đơn đặt",
                nameSub: "Hàng bán",
            },
            iconNote: true,
            // icon: "/procesOvevew/Connectorline2.png",
            icon: (
                <>
                    <div className="3xl:w-full xxl:w-[60px] 2xl:w-[65px] xl:w-[40px] lg:w-[50px]">
                        <Image
                            src={"/procesOvevew/Connectorline2.png"}
                            width={1920}
                            height={1280}
                            className="w-full h-full"
                        />
                    </div>
                </>
            ),
            start: false,
            between: true,
            iconSub: (
                <div
                    className="absolute top-[105%] 
                3xl:-left-[40.5%] 3xl:w-[120px] 3xl:h-[147px]
                xxl:-left-[76.5%]  xxl:w-[100px]
                2xl:-left-[58.5%]  2xl:w-[100px]  2xl:h-[135px]
                xl:-left-[45.5%]  xl:w-[60px]  xl:h-[135px]
                lg:-left-[25.5%]  lg:w-[40px]  lg:h-[115px]
                "
                >
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
            // icon: "/procesOvevew/Connectorline3.png",
            icon: (
                <>
                    <div className="3xl:w-full xxl:w-[70px] 2xl:w-[120px] xl:w-[80px] lg:w-[50px]">
                        <Image
                            src={"/procesOvevew/Connectorline3.png"}
                            width={1920}
                            height={1280}
                            className="w-full h-full"
                        />
                    </div>
                </>
            ),
            start: false,
            iconNote: false,
        },
        {
            name: {
                nameMain: "Kế hoạch",
                nameSub: "Giao hàng",
            },
            icon: (
                <div
                    className="absolute top-1/2 left-[105%] 3xl:w-[248px] xxl:w-[232px] 2xl:w-[235px] 3xl:h-[301px] xxl:h-[246px] 2xl:h-[270px]
                xl:w-[291px] xl:h-[242px] lg:w-[239px] lg:h-[190px]
                "
                >
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

    const dataAccountant = [
        {
            name: "Kế thừa dữ liệu từ toàn bộ quy trình",
        },
        {
            name: "Tính giá thành sản xuất",
        },
        {
            name: "Quản lý công nợ, thanh toán",
        },
        {
            name: "Theo dõi tồn kho, doanh thu, chi phí",
        },
    ];
    return (
        <React.Fragment>
            <Head>
                <title>Tổng quan các phân hệ</title>
            </Head>
            <div className="3xl:px-10 3xl:pt-16 3xl:pb-3 2xl:pt-[70px] xl:px-10 px-3 pt-16 pb-3 space-y-1 lg:h-screen overflow-auto flex flex-col justify-between">
                <div className="px-2 py-4">
                    {statusExprired ? (
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
                    <div className="grid grid-cols-12 3xl:gap-14 xxl:gap-14 2xl:gap-14 xl:gap-14 lg:gap-9">
                        <div className="bg-[#EEF9FF] w-full  rounded-2xl col-span-12 h-fit relative">
                            <div className="absolute top-[10%] right-[1%] w-[232px] h-[80px]">
                                <Image
                                    src={"/procesOvevew/Logo-BG.png"}
                                    width={1920}
                                    height={1280}
                                    className="w-full h-full"
                                />
                            </div>
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
                                                    <div
                                                        className="mx-auto  bg-black rounded-full text-white flex items-center justify-center
                                                        3xl:h-[74px] 3xl:w-[74px] 3xl:text-sm
                                                        xxl:w-[50px] xxl:h-[50px] xxl:text-[12px]
                                                        2xl:w-[50px] 2xl:h-[50px] 2xl:text-xs
                                                        xl:w-[45px] xl:h-[45px] xl:text-[9px]
                                                        lg:w-[40px] lg:h-[40px] lg:text-[8px]
                                                        "
                                                    >
                                                        Bắt đầu
                                                    </div>
                                                ) : (
                                                    <div>
                                                        {e.iconNote ? (
                                                            <div
                                                                className="relative 
                                                                3xl:w-[70px] 3xl:h-[90px]  
                                                                2xl:w-[50px] 2xl:h-[60px] 
                                                                xl:w-[40px] xl:h-[55px] 
                                                                lg:w-[35px] lg:h-[45px] "
                                                            >
                                                                <img src="/proces_sales/Subtract3.png" />
                                                                <div className="absolute  font-medium flex  flex-wrap uppercase top-1  left-2">
                                                                    <span className="3xl:text-[10px] xxl:text-[5.5px] 2xl:text-[6px] xl:text-[5.5px] lg:text-[4.5px]">
                                                                        {e.name.nameMain}
                                                                    </span>
                                                                    <span className="3xl:text-[10px] xxl:text-[5.5px] 2xl:text-[6px] xl:text-[5.5px] lg:text-[4.5px]">
                                                                        {e.name.nameSub}
                                                                    </span>
                                                                </div>
                                                                <Image
                                                                    src={"/proces_sales/Frame3.png"}
                                                                    width={1920}
                                                                    height={1280}
                                                                    className="absolute top-1/2 left-1/2 -translate-x-1/2"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div
                                                                className="bg-white rounded-lg border border-[#8590A2] inline-block  
                                                                3xl:w-[120px] 3xl:h-[76px] 
                                                                xxl:w-[130px] xxl:h-[45px]
                                                                2xl:w-[137px]  2xl:h-[50px]
                                                                xl:w-[100px]  xl:h-[50px]
                                                                lg:w-[80px]  lg:h-[40px]
                                                                "
                                                            >
                                                                <div
                                                                    className=" text-center w-full h-full flex items-center justify-center px-2.5
                                                                    3xl:text-base 
                                                                    xxl:text-[13px]  
                                                                    2xl:text-[14px]
                                                                    xl:text-[13px]
                                                                    lg:text-[10px]
                                                                    "
                                                                >
                                                                    {e.name}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                {(e?.last && e.icon) || e.icon}
                                                {e?.between && e.iconSub}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-8 flex flex-col 3xl:gap-14 xxl:gap-14 2xl:gap-14 xl:gap-14 lg:gap-9">
                            <div className="bg-[#FFF7EB] w-full rounded-2xl col-span-8 h-fit">
                                <div className="p-6">
                                    <div className="grid grid-cols-12 w-full items-center 3xl:gap-2 2xl:gap-2 xxl:gap-2 xl:gap-2 lg:gap-1">
                                        <div className="col-span-12 flex items-center">
                                            <div className="border-l-[6px] border-[#DC6803]">
                                                <h2 className="ml-2 text-[#6A6A6A] font-normal text-base">Phân hệ</h2>
                                                <h1 className="ml-2 font-medium text-xl">Kế hoạch</h1>
                                            </div>
                                            <div className="3xl:w-[254px] xxl:w-[173px] 2xl:w-[184px] xl:w-[132px] lg:w-[87px]"></div>
                                            <div className="flex items-center gap-1">
                                                <div
                                                    className=" z-10 bg-orange-200 rounded-full text-black flex items-center justify-center 
                                                    3xl:w-[76px] 3xl:h-[76px] 3xl:text-sm
                                                    xxl:w-[55px] xxl:h-[55px] xxl:text-[12px]
                                                    2xl:w-[50px] 2xl:h-[50px] 2xl:text-xs
                                                    xl:w-[45px] xl:h-[45px] xl:text-[9px]
                                                    lg:w-[40px] lg:h-[40px] lg:text-[8px]"
                                                >
                                                    BOM
                                                </div>
                                                <div
                                                    className="
                                                    3xl:w-[118px] 
                                                    xxl:w-[52px] 
                                                    2xl:w-[64px]
                                                    xl:w-[40px]
                                                    lg:w-[40px]
                                                    "
                                                >
                                                    <Image
                                                        src={"/procesOvevew/Connectorline2.png"}
                                                        width={1920}
                                                        height={1280}
                                                        className="w-full h-full"
                                                    />
                                                </div>
                                                <div
                                                    className=" bg-orange-400 rounded-lg border border-orange-400 inline-block 
                                                    3xl:w-[130px] 3xl:h-[76px] 
                                                    xxl:w-[130px] xxl:h-[60px]
                                                    2xl:w-[150px] 2xl:h-[50px]
                                                    xl:w-[120px] xl:h-[50px]
                                                    lg:w-[100px] lg:h-[40px]
                                                    "
                                                >
                                                    <div
                                                        className="text-center w-full h-full flex items-center justify-center px-2.5 text-white
                                                    3xl:text-base
                                                    xxl:text-[13px]  
                                                    2xl:text-[14px]
                                                    xl:text-[12px]
                                                    lg:text-[10px]"
                                                    >
                                                        {"Kế hoạch mua hàng"}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="col-span-12 flex items-center justify-center 
                                            3xl:ml-[110px]  
                                            xxl:ml-[94px] 
                                            2xl:ml-[77px]
                                            xl:ml-[45px]
                                            lg:ml-[53px]
                                            "
                                        >
                                            <div
                                                className="
                                                3xl:w-[480px] 3xl:h-[75px]
                                                xxl:w-[250px] xxl:h-[50px]
                                                2xl:w-[300px] 2xl:h-[73px]
                                                xl:w-[220px] xl:h-[43px]
                                                lg:w-[183px] lg:h-[30px]

                                                 "
                                            >
                                                <Image
                                                    src={"/procesOvevew/plan/3t.png"}
                                                    width={1920}
                                                    height={1280}
                                                    className="w-full h-full"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-span-12 flex items-center gap-1">
                                            <div
                                                className="bg-orange-200 rounded-full text-black flex items-center xxl:flex-wrap justify-center
                                                3xl:h-[74px] 3xl:w-[74px] 3xl:text-sm
                                                2xl:h-[50px] 2xl:w-[50px] xxl:text-[10px]
                                                xxl:w-[55px] xxl:h-[50px] 2xl:text-[11px]
                                                xl:w-[45px] xl:h-[45px] xl:text-[9px]
                                                lg:w-[40px] lg:h-[40px] lg:text-[8px]"
                                            >
                                                Hàng tồn
                                            </div>
                                            <div
                                                className="
                                                3xl:w-[122px]
                                                xxl:w-[55px] 
                                                2xl:w-[106px]
                                                xl:w-[50px]
                                                lg:w-[37px]
                                                "
                                            >
                                                <Image
                                                    src={"/procesOvevew/plan/Connectorline3.png"}
                                                    width={1920}
                                                    height={1280}
                                                    className="w-full h-full"
                                                />
                                            </div>
                                            <div
                                                className="bg-white relative rounded-lg border border-[#8590A2] inline-block 
                                                3xl:w-[130px] 3xl:h-[76px]
                                                xxl:w-[137px] xxl:h-[45px]
                                                2xl:w-[110px] 2xl:h-[50px]
                                                xl:w-[100px] xl:h-[50px]
                                                lg:w-[90px] lg:h-[40px]
                                                "
                                            >
                                                <div
                                                    className=" text-center w-full h-full flex items-center justify-center px-2.5
                                                    3xl:text-base 
                                                    xxl:text-[13px]  
                                                    2xl:text-[14px]
                                                    xl:text-[12px]
                                                    lg:text-[10px]
                                                    "
                                                >
                                                    {"Cấn từ hàng tồn kho"}
                                                </div>
                                                <div
                                                    className="absolute left-1/2 top-full translate-y-[5%]  
                                                    3xl:w-[132px] 3xl:h-[142px]
                                                    xxl:w-[80px] xxl:h-[142px]
                                                    2xl:w-[80px] 2xl:h-[142px]
                                                    xl:w-[87px] xl:h-[142px]
                                                    lg:w-[75px] lg:h-[125px]

                                                "
                                                >
                                                    <Image
                                                        src={"/procesOvevew/plan/ConnectorlineBottom1.png"}
                                                        width={1920}
                                                        height={1280}
                                                        className="w-full h-full"
                                                    />
                                                </div>
                                            </div>
                                            <div className="3xl:w-[] xxl:w-[] 2xl:w-[30px] xl:w-[] lg:w-[]">
                                                <Image
                                                    src={"/procesOvevew/plan/Connectorline4.png"}
                                                    width={1920}
                                                    height={1280}
                                                    className="w-full h-full"
                                                />
                                            </div>
                                            <div className="flex 3xl:gap-24 xxl:gap-[8px] 2xl:gap-[6px] xl:gap-2 lg:gap-2">
                                                <div
                                                    className="bg-orange-200 rounded-lg border border-orange-400 inline-block  
                                                    3xl:w-[130px] 3xl:h-[76px]
                                                    xxl:w-[117px] xxl:h-[45px]
                                                    2xl:w-[110px] 2xl:h-[50px]
                                                    xl:w-[100px] xl:h-[50px]
                                                    lg:w-[80px] lg:h-[40px]"
                                                >
                                                    <div
                                                        className="text-center w-full h-full flex items-center justify-center px-2.5
                                                    3xl:text-base 
                                                    xxl:text-[12px]  
                                                    2xl:text-[14px] 
                                                    xl:text-[12px]
                                                    lg:text-[10px]
                                                    "
                                                    >
                                                        {"Nhu cầu vật tư"}
                                                    </div>
                                                </div>
                                                <div
                                                    className="bg-orange-200 relative rounded-lg border border-orange-400 inline-block  
                                                    3xl:w-[130px] 3xl:h-[76px]
                                                    xxl:w-[117px] xxl:h-[45px] 
                                                    2xl:w-[110px] 2xl:h-[50px]
                                                    xl:w-[100px] xl:h-[50px]
                                                    lg:w-[80px] lg:h-[40px]"
                                                >
                                                    <div
                                                        className="text-center w-full h-full flex items-center justify-center px-2.5
                                                        3xl:text-base 
                                                        xxl:text-[12px]
                                                        2xl:text-[14px] 
                                                        xl:text-[12px]
                                                        lg:text-[10px]"
                                                    >
                                                        {"Lệnh gia công ngoài"}
                                                    </div>
                                                    <div
                                                        className="absolute right-1/2 top-full translate-y-[5%]
                                                        3xl:translate-x-0 3xl:w-[70px] 3xl:h-[142px]
                                                        xxl:translate-x-[0%] xxl:w-[70px] xxl:h-[142px]
                                                        2xl:translate-x-[10%] 2xl:w-[75px] 2xl:h-[142px]
                                                        xl:translate-x-[4%] xl:w-[60px] xl:h-[145px]
                                                        lg:translate-x-[4%] lg:w-[60px] lg:h-[125px]
                                                        "
                                                    >
                                                        <Image
                                                            src={"/procesOvevew/plan/ConnectorlineBottom2.png"}
                                                            width={1920}
                                                            height={1280}
                                                            className="w-full h-full object-contain"
                                                        />
                                                    </div>
                                                </div>
                                                <div
                                                    className="bg-orange-200 relative rounded-lg border border-orange-400 inline-block  
                                                    3xl:w-[130px] 3xl:h-[76px]
                                                    xxl:w-[117px] xxl:h-[45px]
                                                    2xl:w-[110px] 2xl:h-[50px]
                                                    xl:w-[100px] xl:h-[50px]
                                                    lg:w-[80px] lg:h-[40px]"
                                                >
                                                    <div
                                                        className="text-center w-full h-full flex items-center justify-center px-2.5
                                                        3xl:text-base 
                                                        xxl:text-[12px]
                                                        2xl:text-[14px]
                                                        xl:text-[12px] 
                                                        lg:text-[10px]"
                                                    >
                                                        {"Lệnh sản xuất"}
                                                    </div>
                                                    <div
                                                        className="absolute top-full translate-y-[5%]  
                                                        
                                                       
                                                        3xl:left-1/2  3xl:w-[200px]   3xl:h-[140px]
                                                        xxl:left-[41%]  xxl:w-[200px]   xxl:h-[140px]
                                                        2xl:left-[75%] 2xl:w-[200px]   2xl:h-[140px]
                                                        xl:left-[43%] xl:w-[200px]   xl:h-[140px]
                                                        lg:left-[47%] lg:w-[150px]   lg:h-[125px]
                                                        "
                                                    >
                                                        <Image
                                                            src={"/procesOvevew/plan/ConnectorlineBottom3.png"}
                                                            width={200}
                                                            height={160}
                                                            className="w-full h-full"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className="
                                                3xl:w-[106px] 
                                                2xl:w-[80px]"
                                            >
                                                <Image
                                                    src={"/procesOvevew/plan/Connectorline5.png"}
                                                    width={1920}
                                                    height={1280}
                                                    className="w-full h-full"
                                                />
                                            </div>
                                            <div
                                                className="bg-white relative rounded-lg border border-[#8590A2] inline-block 
                                                3xl:w-[130px] 3xl:h-[76px]
                                                xxl:w-[117px]  xxl:h-[45px] 
                                                2xl:w-[110px]  2xl:h-[50px]
                                                xl:w-[100px] xl:h-[50px]
                                                lg:w-[80px] lg:h-[40px]"
                                            >
                                                <div
                                                    className="text-center w-full h-full flex items-center justify-center px-2.5
                                                    3xl:text-base 
                                                    xxl:text-[13px]  
                                                    2xl:text-[14px] 
                                                    xl:text-[12px]
                                                    lg:text-[11px]"
                                                >
                                                    {"Đề nghị xuất kho"}
                                                </div>
                                                <div
                                                    className="absolute top-1/2 -translate-y-1/2 -right-full 
                                                3xl:translate-x-1/3 3xl:w-[157px]
                                                xxl:translate-x-[10%] xxl:w-[105px]
                                                2xl:translate-x-[34%] 2xl:w-[150px]
                                                xl:translate-x-[34%] xl:w-[140px]
                                                lg:translate-x-[30%] lg:w-[100px]
                                                "
                                                >
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
                            <div className="grid grid-cols-13 3xl:gap-14   xxl:gap-14 2xl:gap-14  xl:gap-14 lg:gap-9">
                                <div className="bg-[#F0FFF0] w-full rounded-2xl col-span-7 h-fit">
                                    <div className="p-6 3xl:pb-[60px] xxl:pb-[25px] 2xl:pb-[70px] xl:pb-[25px] lg:pb-[45px]">
                                        <div className="grid grid-cols-12">
                                            <div className="col-span-12 grid grid-cols-9">
                                                <div className="border-l-[6px] border-[#0BAA2E] col-span-6 h-fit">
                                                    <h2 className="ml-2 text-[#6A6A6A] font-normal text-base">
                                                        Phân hệ
                                                    </h2>
                                                    <h1 className="ml-2 font-medium text-xl">Mua hàng</h1>
                                                </div>
                                                <div className="col-span-3 mx-auto">
                                                    <div
                                                        className=" bg-[#0BAA2E]/20 relative rounded-lg border border-[#60D87A] inline-block 
                                                        3xl:w-[165px] 3xl:h-[76px] 
                                                        xxl:w-[116px] xxl:h-[76px] 
                                                        2xl:w-[116px] 2xl:h-[76px]
                                                        xl:w-[80px] xl:h-[76px]
                                                        lg:w-[60px] lg:h-[76px]
                                                        "
                                                    >
                                                        <div
                                                            className="text-center w-full h-full flex items-center justify-center px-2.5
                                                        3xl:text-sm 
                                                        xxl:text-[13px]  
                                                        2xl:text-[14px]
                                                        xl:text-[12px]
                                                        lg:text-[10px]
                                                        "
                                                        >
                                                            {"Dữ liệu yêu cầu mua hàng"}
                                                        </div>
                                                        <div
                                                            className="absolute right-1/2  
                                                            3xl:w-[65px] 3xl:h-[72px] 
                                                            xxl:w-[55px] xxl:h-[60px] 
                                                            2xl:w-[59px] 2xl:h-[68px]
                                                            xl:w-[50px] xl:h-[58px]
                                                            lg:w-[30px] lg:h-[48px]
                                                        "
                                                        >
                                                            <Image
                                                                src={"/procesOvevew/purchase/Connectorline1.png"}
                                                                width={1920}
                                                                height={1280}
                                                                className="w-full h-full "
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="3xl:mt-8 xxl:mt-8 2xl:mt-8 xl:mt-6 lg:mt-[20px]">
                                                    <div className="flex items-center  gap-1">
                                                        <div className="flex items-center gap-1">
                                                            <div
                                                                className=" bg-white relative rounded-lg border border-[#8590A2] inline-block 
                                                                3xl:w-[150px] 3xl:h-[76px] 
                                                                xxl:w-[130px] xxl:h-[45px] 
                                                                2xl:w-[120px] 2xl:h-[60px]
                                                                xl:w-[120px] xl:h-[50px]
                                                                lg:w-[120px] lg:h-[40px]
                                                                "
                                                            >
                                                                <div
                                                                    className="text-center w-full h-full flex items-center justify-center px-2.5
                                                                    3xl:text-sm 
                                                                    xxl:text-[13px] 
                                                                    2xl:text-[14px]
                                                                    xl:text-[11px]
                                                                    lg:text-[10px]
                                                                    "
                                                                >
                                                                    {"Chọn nhà cung cấp"}
                                                                </div>
                                                                <div
                                                                    className="
                                                                    3xl:w-[70px] 3xl:left-1/2  3xl:h-[70px]
                                                                    xxl:w-[50px]  xxl:left-1/2 xxl:h-[55px]
                                                                    2xl:w-[49px] 2xl:left-1/2 2xl:h-[55px]
                                                                    xl:w-[45px] xl:left-[45%] xl:h-[50px]
                                                                    lg:w-[15px] lg:left-1/2 lg:h-[45px]
                                                                  absolute  top-full  translate-y-[5%]"
                                                                >
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
                                                            <div className="3xl:w-[120px] 2xl:w-[60px]">
                                                                <Image
                                                                    src={"/procesOvevew/purchase/Connectorline2.png"}
                                                                    width={1920}
                                                                    height={1280}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="">
                                                            <div
                                                                className=" bg-white relative rounded-lg border border-[#8590A2] inline-block 
                                                                3xl:w-[120px] 3xl:h-[76px] 
                                                                xxl:w-[130px] xxl:h-[45px] 
                                                                2xl:w-[110px] 2xl:h-[60px]
                                                                xl:w-[100px] xl:h-[50px]
                                                                lg:w-[80px] lg:h-[40px]
                                                                "
                                                            >
                                                                <div
                                                                    className="text-center w-full h-full flex items-center justify-center px-2.5
                                                                3xl:text-sm 
                                                                xxl:text-[12px] 
                                                                2xl:text-[13px]
                                                                xl:text-[11px]
                                                                lg:text-[10px]
                                                                "
                                                                >
                                                                    {"Yêu cầu báo giá"}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="3xl:ml-40 xxl:ml-24 2xl:ml-28 xl:ml-20 lg:ml-[54px]">
                                                        <div className="flex items-center mt-5 gap-1">
                                                            <div className="flex items-center gap-1">
                                                                <div
                                                                    className="
                                                                    3xl:w-[90px]  3xl:h-[90px] 
                                                                    xxl:w-[50px] xxl:h-[60px] 
                                                                    2xl:w-[70px] 2xl:h-[60px] 
                                                                    xl:w-[50px] xl:h-[53px] 
                                                                    lg:w-[40px] lg:h-[45px]
                                                                     relative "
                                                                >
                                                                    <img src="/proces_sales/Subtract3.png" />
                                                                    <div
                                                                        className="absolute text-[10px] font-medium flex 
                                                                    3xl:text-[10px]  
                                                                    2xl:text-[7px] 
                                                                    xl:text-[5px] 
                                                                    lg:text-[4.5px] flex-wrap uppercase top-1  left-2"
                                                                    >
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
                                                                <div
                                                                    className=" bg-white relative rounded-lg border border-[#8590A2] inline-block 
                                                                    3xl:w-[150px] 3xl:h-[76px] 
                                                                    xxl:w-[114px] xxl:h-[45px] 
                                                                    2xl:w-[120px] 2xl:h-[60px]
                                                                    xl:w-[100px] xl:h-[50px]
                                                                    lg:w-[90px] lg:h-[40px]
                                                                    "
                                                                >
                                                                    <div
                                                                        className="text-center w-full h-full flex items-center justify-center px-2.5
                                                                        3xl:text-sm 
                                                                        xxl:text-[12px] 
                                                                        2xl:text-[13px]
                                                                        xl:text-[11px]
                                                                        lg:text-[10px]
                                                                        "
                                                                    >
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
                                                                <div
                                                                    className=" bg-white relative rounded-lg border border-[#8590A2] inline-block 
                                                                    3xl:w-[150px] 3xl:h-[76px] 
                                                                    xxl:w-[114px] xxl:h-[45px] 
                                                                    2xl:w-[120px] 2xl:h-[60px]
                                                                    xl:w-[100px] xl:h-[50px]
                                                                    lg:w-[100px] lg:h-[40px]
                                                                    "
                                                                >
                                                                    <div
                                                                        className="
                                                                    3xl:text-sm 
                                                                    xxl:text-[12px] 
                                                                    2xl:text-[13px] 
                                                                    xl:text-[11px]
                                                                    lg:text-[10px]
                                                                    text-center w-full h-full flex items-center justify-center px-2.5"
                                                                    >
                                                                        {"Kiểm soát chất lượng"}
                                                                    </div>
                                                                    <div
                                                                        className="top-full translate-y-[5%] absolute left-1/2
                                                                    3xl:w-[1020px] 3xl:h-[90px]
                                                                    xxl:w-[767px]  xxl:h-[50px]
                                                                    2xl:w-[820px] 2xl:h-[90px]
                                                                    xl:w-[710px] xl:h-[50px]
                                                                    lg:w-[576px] lg:h-[50px]

                                                                    "
                                                                    >
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
                                    <div className="p-6 3xl:pb-[50px] xxl:pb-[35px] 2xl:pb-[60px] xl:pb-[30px] lg:pb-[40px]">
                                        <div className="grid grid-cols-12 w-full items-center gap-2">
                                            <div className="col-span-12">
                                                <div className="border-l-[6px] border-[#EE1E1E]">
                                                    <h2 className="ml-2 text-[#6A6A6A] font-normal text-base">
                                                        Phân hệ
                                                    </h2>
                                                    <h1 className="ml-2 font-medium text-xl">Sản xuất</h1>
                                                </div>
                                                <div
                                                    className="flex items-center flex-wrap gap-2
                                                    3xl:ml-44 
                                                    xxl:ml-[132px] 
                                                    2xl:ml-[140px]
                                                    xl:ml-[99px]
                                                    lg:ml-[72px]
                                                    "
                                                >
                                                    <div className="relative">
                                                        <div
                                                            className=" relative 
                                                        3xl:w-[70px] 3xl:h-[90px] 
                                                        2xl:w-[50px] 2xl:h-[60px] 
                                                        xl:w-[40px] xl:h-[55px] 
                                                        lg:w-[35px] lg:h-[45px]"
                                                        >
                                                            <img src="/proces_sales/Subtract3.png" />
                                                            <div
                                                                className="absolute text-[10px] font-medium flex  flex-wrap uppercase top-1  left-2
                                                                3xl:text-[10px]  
                                                                2xl:text-[7px] 
                                                                xl:text-[5px] 
                                                                lg:text-[4.5px] "
                                                            >
                                                                <span className="">{"Đơn đặt"}</span>
                                                                <span>{"Hàng mua"}</span>
                                                            </div>
                                                            <Image
                                                                src={"/proces_sales/Frame3.png"}
                                                                width={1920}
                                                                height={1280}
                                                                className="absolute top-1/2 left-[50%] -translate-x-1/2"
                                                            />
                                                        </div>
                                                        <div
                                                            className="absolute top-1/2 right-1/2 
                                                            3xl:-translate-x-[40%] 3xl:w-[118px] 
                                                            xxl:-translate-x-[25%] xxl:w-[89px] 
                                                            2xl:-translate-x-[40%] 2xl:w-[90px] 
                                                            xl:-translate-x-[40%] xl:w-[60px] 
                                                            lg:-translate-x-[35%] lg:w-[55px] 
                                                            "
                                                        >
                                                            <Image
                                                                src={"/procesOvevew/manufacture/Connectorline1.png"}
                                                                width={1920}
                                                                height={1280}
                                                                className="w-full h-full object-contain"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="
                                                        3xl:w-[69px] 
                                                        2xl:w-[40px]
                                                        xl:w-[40px]
                                                        lg:w-[30px]
                                                    "
                                                    >
                                                        <Image
                                                            src={"/procesOvevew/manufacture/Connectorline2.png"}
                                                            width={1920}
                                                            height={1280}
                                                            className="w-full h-full"
                                                        />
                                                    </div>
                                                    <div
                                                        className=" bg-[#ED5151]/20 relative right-1 rounded-lg border border-[#ED5151] inline-block 
                                                        3xl:w-[110px] 3xl:h-[100px] 
                                                        xxl:w-[90px] xxl:h-[75px] 
                                                        2xl:w-[100px] 2xl:h-[90px]
                                                        xl:w-[80px] xl:h-[70px]
                                                        lg:w-[80px] lg:h-[60px]
                                                        "
                                                    >
                                                        <div
                                                            className="text-center w-full h-full flex items-center justify-center px-2.5
                                                            3xl:text-sm 
                                                            xxl:text-[12px] 
                                                            2xl:text-[13px]
                                                            xl:text-[11px] 
                                                            lg:text-[10px] 
                                                            "
                                                        >
                                                            {"Danh sách lệnh cho từng phân xưởng"}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div
                                                    className=" bg-white relative  rounded-lg border border-[#8590A2] inline-block 
                                                    3xl:w-[120px] 3xl:h-[76px] 
                                                    xxl:w-[110px] xxl:h-[45px] 
                                                    2xl:w-[110px] 2xl:h-[60px]
                                                    xl:w-[100px] xl:h-[50px]
                                                    lg:w-[75px] lg:h-[40px]
                                                    "
                                                >
                                                    <div
                                                        className="text-center w-full h-full flex items-center justify-center px-2.5
                                                        3xl:text-sm 
                                                        xxl:text-[12px] 
                                                        2xl:text-[13px] 
                                                        xl:text-[11px] 
                                                        lg:text-[10px]
                                                        "
                                                    >
                                                        {"Thống kê sản lượng"}
                                                    </div>
                                                    <div
                                                        className="absolute top-full translate-y-[5%]
                                                        3xl:left-[43%] 3xl:w-[86px] 3xl:h-[45px]
                                                        xxl:left-[40%] xxl:w-[50px] xxl:h-[45px]
                                                        2xl:left-[40%] 2xl:w-[70px] 2xl:h-[35px]
                                                        xl:left-[40%] xl:w-[45px] xl:h-[35px]
                                                        lg:left-[20%] lg:w-[23px] lg:h-[37px]
                                                        "
                                                    >
                                                        <Image
                                                            src={"/procesOvevew/manufacture/Connectorline3.png"}
                                                            width={1920}
                                                            height={1280}
                                                            className="w-full h-full 3xl:object-contain xxl:object-contain 2xl:object-contain xl:object-contain "
                                                        />
                                                    </div>
                                                </div>
                                                <div
                                                    className="
                                                    3xl:ml-[150px]
                                                    xxl:ml-[100px] 
                                                    2xl:ml-[130px] 
                                                    xl:ml-[90px] 
                                                    lg:ml-[40px] 
                                                
                                                    flex items-center gap-1 3xl:mt-0 xxl:mt-2 2xl:mt-0 xl:mt-1 lg:mt-3"
                                                >
                                                    <div
                                                        className=" bg-white relative  rounded-lg border border-[#8590A2] inline-block 
                                                        3xl:w-[130px] 3xl:h-[76px] 
                                                        xxl:w-[170px] xxl:h-[45px] 
                                                        2xl:w-[120px] 2xl:h-[60px]
                                                        xl:w-[100px] xl:h-[50px]
                                                        lg:w-[90px] lg:h-[40px]
                                                        "
                                                    >
                                                        <div
                                                            className="
                                                            3xl:text-sm 
                                                            xxl:text-[12px] 
                                                            2xl:text-[13px] 
                                                            xl:text-[11px] 
                                                            lg:text-[9.5px]
                                                            text-center w-full h-full flex items-center justify-center px-2.5"
                                                        >
                                                            {"Theo dõi tiến độ sản xuất"}
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="
                                                        3xl:w-[49px] 
                                                        2xl:w-[39]"
                                                    >
                                                        <Image
                                                            src={"/procesOvevew/manufacture/Connectorline4.png"}
                                                            width={1920}
                                                            height={1280}
                                                            className="w-full h-full"
                                                        />
                                                    </div>
                                                    <div
                                                        className=" bg-white relative  rounded-lg border border-[#8590A2] inline-block 
                                                        3xl:w-[120px] 3xl:h-[76px] 
                                                        xxl:w-[170px] xxl:h-[45px] 
                                                        2xl:w-[110px] 2xl:h-[60px]
                                                        xl:w-[100px] xl:h-[50px]
                                                        lg:w-[90px] lg:h-[40px]
                                                    "
                                                    >
                                                        <div
                                                            className="
                                                            3xl:text-sm 
                                                            xxl:text-[12px] 
                                                            2xl:text-[13px] 
                                                            xl:text-[11px] 
                                                            lg:text-[9px]
                                                            text-center w-full h-full flex items-center justify-center px-2.5"
                                                        >
                                                            {"Kiểm soát chất lượng"}
                                                        </div>
                                                        {/* <div className="absolute -top-1/2 translate-y-[30%] -right-full translate-x-1/2 w-[250px] h-[59px]">
                                                            <Image
                                                                src={"/procesOvevew/manufacture/Connectorline5.png"}
                                                                width={1920}
                                                                height={1280}
                                                                className="w-full h-full"
                                                            />
                                                        </div> */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-[#FFF5FD] w-full rounded-2xl col-span-4 h-fit">
                            <div
                                className="p-6 
                                3xl:pb-[50px] 
                                xxl:pb-[25px]
                                2xl:pb-[50px]
                                xl:pb-[30px]
                                lg:pb-[35px]
                                "
                            >
                                <div className="border-l-[6px] border-[#EE1EC0]">
                                    <h2 className="ml-2 text-[#6A6A6A] font-normal text-base">Phân hệ</h2>
                                    <h1 className="ml-2 font-medium text-xl">Kho</h1>
                                </div>

                                <div className="grid grid-cols-12 3xl:mt-[115px] xxl:mt-[70px] 2xl:mt-[88px] xl:mt-[60px] lg:mt-[35px]">
                                    <div className="col-span-6 mx-auto">
                                        <div
                                            className="bg-white relative rounded-lg border border-[#8590A2] inline-block 
                                            3xl:w-[120px] 3xl:h-[76px] 
                                            xxl:w-[110px] xxl:h-[50px] 
                                            2xl:w-[145px] 2xl:h-[50px]
                                            xl:w-[100px] xl:h-[50px]
                                            lg:w-[90px] lg:h-[40px]
                                            "
                                        >
                                            <div
                                                className="
                                            3xl:text-sm xxl:text-[12px] 2xl:text-[13px] xl:text-[11px] lg:text-[11px]
                                            text-center w-full h-full flex items-center justify-center px-2.5"
                                            >
                                                {"Xuất kho nguyên liệu"}
                                            </div>
                                            <div
                                                className="absolute -left-1/3 translate-x-1/2 
                                            3xl:w-[132px] 3xl:h-[122px]
                                            xxl:w-[92px] xxl:h-[122px]
                                            2xl:w-[132px] 2xl:h-[122px]
                                            xl:w-[80px] xl:h-[100px]
                                            lg:w-[70px] lg:h-[90px]"
                                            >
                                                <Image
                                                    src={"/procesOvevew/warehouse/Connectorline1.png"}
                                                    width={1920}
                                                    height={1280}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-6 mx-auto">
                                        <div
                                            className="bg-white relative rounded-lg border border-[#8590A2] inline-block 
                                            3xl:w-[120px] 3xl:h-[76px]
                                            xxl:w-[110px] xxl:h-[50px]
                                            2xl:w-[145px] 2xl:h-[50px]
                                            xl:w-[100px] xl:h-[50px]
                                            lg:w-[90px] lg:h-[40px]
                                            "
                                        >
                                            <div
                                                className="
                                            3xl:text-sm 
                                            xxl:text-[12px]
                                            2xl:text-[13px]  
                                            xl:text-[11px]
                                            lg:text-[11px]
                                            text-center w-full h-full flex items-center justify-center px-2.5"
                                            >
                                                {"Xuất kho bán hàng"}
                                            </div>
                                            {/* <div className="absolute right-1/2 3xl:w-[132px] 2xl:w-[100px] 3xl:h-[81px] 2xl:h-[100px]">
                                                <Image
                                                    src={"/procesOvevew/warehouse/Connectorline2.png"}
                                                    width={1920}
                                                    height={1280}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full mx-auto 3xl:mt-[85px] xxl:mt-[85px] 2xl:mt-[85px] xl:mt-[60px] lg:mt-[60px] flex justify-center">
                                    <div
                                        className="bg-[#EE1EC0] relative rounded-lg border border-pink-600 inline-block 
                                        3xl:w-[115px] 3xl:h-[76px]
                                        xxl:w-[105px] xxl:h-[65px]
                                        2xl:w-[115px] 2xl:h-[76px]
                                        xl:w-[100px] xl:h-[66px]
                                        lg:w-[90px] lg:h-[70px]
                                    "
                                    >
                                        <div
                                            className="text-center text-white w-full h-full flex items-center justify-center px-2.5
                                            3xl:text-base 
                                            xxl:text-[13px]
                                            2xl:text-[14px]
                                            xl:text-[12px]
                                            lg:text-[11px]
                                         "
                                        >
                                            {"Quản lý tồn kho"}
                                        </div>
                                        <div className="absolute left-1/2  -top-full w-full h-full">
                                            <Image
                                                src={"/procesOvevew/warehouse/Connectorline2.png"}
                                                width={1920}
                                                height={1280}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <div
                                            className="absolute  -right-1/2     
                                            3xl:top-1/2 3xl:translate-x-1/2 3xl:w-[73px] 3xl:h-[83px]
                                            xxl:top-[42%] xxl:translate-x-[25%] xxl:w-[66px] xxl:h-[69px]
                                            2xl:top-[42%] 2xl:translate-x-[35%] 2xl:w-[76px] 2xl:h-[89px]
                                            xl:top-[42%] xl:translate-x-[35%] xl:w-[76px] xl:h-[70px]
                                            lg:top-[42%] lg:translate-x-[26%] lg:w-[55px] lg:h-[70px]
                                        "
                                        >
                                            <Image
                                                src={"/procesOvevew/warehouse/Connectorline3.png"}
                                                width={1920}
                                                height={1280}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="relative mx-auto -left-[10%]
                                3xl:w-[130px] 3xl:h-[170px]
                                xxl:w-[130px] xxl:h-[140px]
                                2xl:w-[130px] 2xl:h-[170px]
                                xl:w-[130px] xl:h-[150px]
                                lg:w-[80px] lg:h-[125px]
                                 "
                                >
                                    <Image
                                        src={"/procesOvevew/warehouse/line4.png"}
                                        width={1920}
                                        height={1280}
                                        className="w-full h-full object-contain"
                                    />
                                    <div
                                        className="bg-white absolute top-1/2 -left-1/2 rounded-lg border border-[#8590A2] inline-block 
                                        3xl:w-[120px] 3xl:h-[76px] 
                                        xxl:w-[110px] xxl:h-[50px] 
                                        2xl:w-[110px] 2xl:h-[50px]
                                        xl:w-[100px] xl:h-[50px]
                                        lg:w-[90px] lg:h-[40px]
                                    "
                                    >
                                        <div
                                            className="text-center w-full h-full flex items-center justify-center px-2.5
                                            3xl:text-sm 
                                            xxl:text-[12px]
                                            2xl:text-[12px]
                                            xl:text-[11px]
                                            lg:text-[10px]
                                            "
                                        >
                                            {"Nhập thành phẩm"}
                                        </div>
                                        <div
                                            className="absolute -left-full 
                                            3xl:-translate-x-[28%] 3xl:translate-y-[10%] 3xl:w-[290px] 3xl:h-[49px]
                                            xxl:-translate-x-[0%] xxl:translate-y-[5%] xxl:w-[200px] xxl:h-[39px]
                                            2xl:-translate-x-[5%] 2xl:translate-y-[5%] 2xl:w-[200px] 2xl:h-[40px]
                                            xl:-translate-x-[-2%] xl:translate-y-[5%] xl:w-[180px] xl:h-[50px]
                                            lg:-translate-x-[10%] lg:translate-y-[4%] lg:w-[150px] lg:h-[37px]
                                            "
                                        >
                                            <Image
                                                src={"/procesOvevew/manufacture/Connectorline5.png"}
                                                width={1920}
                                                height={1280}
                                                className="w-full h-full"
                                            />
                                        </div>
                                    </div>
                                    <div
                                        className="absolute left-full 
                                        3xl:translate-x-[40%] 3xl:top-1/4
                                        xxl:translate-x-[40%] xxl:top-1/4
                                        2xl:translate-x-[40%] 2xl:top-1/4
                                        xl:translate-x-[40%] xl:top-1/4
                                        lg:translate-x-[50%] lg:top-[20%]

                                        "
                                    >
                                        <div className="relative">
                                            <div
                                                className="text-white bg-blue-500 rounded-lg border border-blude-600 inline-block 
                                                3xl:w-[132px] 3xl:h-[116px] 
                                                xxl:w-[90px] xxl:h-[100px] 
                                                2xl:w-[110px] 2xl:h-[110px]
                                                xl:w-[90px] xl:h-[80px]
                                                lg:w-[80px] lg:h-[70px]
                                                "
                                            >
                                                <div
                                                    className="text-center w-full h-full flex items-center justify-center px-2.5
                                                3xl:text-sm 
                                                xxl:text-[12px]
                                                2xl:text-[12px]
                                                xl:text-[11px]
                                                lg:text-[10px]
                                                "
                                                >
                                                    {"Hệ thống báo cáo toàn bộ quy trình"}
                                                </div>
                                            </div>
                                            <div className="absolute  left-1/2 top-full translate-y-[5%]">
                                                <Image
                                                    src={"/procesOvevew/warehouse/Connectorline4.png"}
                                                    width={1920}
                                                    height={1280}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                            <div
                                                className="absolute top-full 
                                                3xl:translate-y-[70%] 3xl:left-[28%] 
                                                xxl:translate-y-[50%] xxl:left-[25%] 
                                                2xl:translate-y-[100%] 2xl:left-[35%]
                                                xl:translate-y-[70%] xl:left-[30%]
                                                lg:translate-y-[70%] lg:left-[30%]
                                                "
                                            >
                                                <div
                                                    className="bg-black rounded-full text-white flex items-center justify-center
                                                    3xl:h-[74px] 3xl:w-[74px]  3xl:text-sm 
                                                    xxl:w-[50px] xxl:h-[50px] xxl:text-[11px]
                                                    2xl:w-[50px] 2xl:h-[50px] 2xl:text-[12px]
                                                    xl:w-[45px] xl:h-[45px] xl:text-[9px]
                                                    lg:w-[40px] lg:h-[40px] lg:text-[8px]"
                                                >
                                                    Kết thúc
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mx-auto col-span-12 text-center">
                                    <div
                                        className="bg-white  rounded-lg border border-[#8590A2] inline-block 
                                        3xl:w-[120px] 3xl:h-[76px] 
                                        xxl:w-[110px] xxl:h-[50px] 
                                        2xl:w-[110px] 2xl:h-[50px]
                                        xl:w-[100px] xl:h-[50px]
                                        lg:w-[90px] lg:h-[40px]
                                        "
                                    >
                                        <div className="3xl:text-sm  xxl:text-[12px] 2xl:text-[12px]  xl:text-[11px] lg:text-[10px] text-center w-full h-full flex items-center justify-center px-2.5">
                                            {"Nhập kho nguyên liệu"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-[#EBFFFF] w-full rounded-2xl col-span-12 h-fit">
                            <div className="p-6 grid grid-cols-12">
                                <div className="border-l-[6px] border-[#32D6FA] col-span-2 h-fit">
                                    <h2 className="ml-2 text-[#6A6A6A] font-normal text-base">Phân hệ</h2>
                                    <h1 className="ml-2 font-medium text-xl">Kế toán</h1>
                                </div>
                                <div className="flex items-center col-span-8 justify-between">
                                    {dataAccountant.map((e) => (
                                        <div
                                            className=" bg-white relative rounded-lg border border-[#8590A2] inline-block 
                                            3xl:w-[165px] 3xl:h-[77px] 
                                            xxl:w-[150px] xxl:h-[50px] 
                                            2xl:w-[140px] 2xl:h-[57px]
                                            xl:w-[110px] xl:h-[50px]
                                            lg:w-[120px] lg:h-[40px]
                                            "
                                        >
                                            <div
                                                className="text-center w-full h-full flex items-center justify-center px-2.5
                                                3xl:text-sm 
                                                xxl:text-[12px]
                                                2xl:text-[13px]
                                                xl:text-[11px]
                                                lg:text-[11px]
                                                "
                                            >
                                                {e.name}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="py-12">
                        <div className="flex items-center gap-2">
                            <div className="w-[138px] h-[50px]">
                                <Image
                                    alt=""
                                    src="/logo_1.png"
                                    width={138}
                                    height={50}
                                    className="select-none pointer-events-none object-cover w-auto h-auto"
                                    loading="lazy"
                                    crossOrigin="anonymous"
                                    blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                />
                            </div>
                            <h6 className="text-[28px] xxl:text-[20px] xl:text-base lg:text-base">
                                Quy trình tổng quan các phân hệ
                            </h6>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Index;
