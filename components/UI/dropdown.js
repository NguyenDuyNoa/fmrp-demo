import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import Popup from "reactjs-popup";
import { Tooltip } from "react-tippy";

import Loading from "./loading";

import { Lexend_Deca } from "@next/font/google";
import { useSelector } from "react-redux";
import ExpandableContent from "./more";
import TabFilter from "./TabFilter";
import { ArrowCircleDown, Cd, SearchNormal1, TickCircle } from "iconsax-react";
const deca = Lexend_Deca({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
});

export const Dropdown = (props) => {
    const [isZoomed, setIsZoomed] = useState(false);

    const handleClick = () => {
        setIsZoomed(true);

        setTimeout(() => {
            setIsZoomed(false);
        }, 200);
    };

    const zoomedStyle = {
        transform: isZoomed ? "scale(1.1)" : "scale(1)",
        transition: "transform 0.2s",
        willChange: "transform",
    };
    return (
        <div className="">
            <Popup
                trigger={
                    <button
                        className={`text-slate-200 3xl:text-[18px] 2xl:text-[14px] xl:text-[12px] lg:text-[10px]  hover:text-white hover:drop-shadow-[0_0_5px_#eabd7a99] 
              `}
                    >
                        {props.children}
                    </button>
                }
                closeOnDocumentClick
                arrow={props.position}
                on={["hover"]}
                position={props.position}
                className={`popover-edit -translate-y-10 ` + props.className}
            >
                <div className={`w-auto ${deca.className} `}>
                    <div className="bg-white 2xl:py-2 lg:py-0.5 px-0.5 rounded-lg justify-between flex divide-x divide-[#DDDDE2]">
                        {props.data?.map((e, i) => (
                            <div
                                className={`${
                                    e.title
                                        ? "3xl:px-6 3xl:py-3 2xl:px-3 2xl:py-1 xl:px-0.5 xl:py-0.5 lg:px-0.5 lg:py-0.5"
                                        : "px-1"
                                } 2xl:space-y-2 lg:space-y-1 min-w-[200px]`}
                                key={i}
                            >
                                {e.title && (
                                    <h3 className="3xl:text-[22px] 2xl:text-[20px] xl:text-[18px] lg:text-[18px] font-medium px-3">
                                        {e.title}
                                    </h3>
                                )}
                                {e.sub?.map((ce, ci) => (
                                    <div className="space-y-0.5" key={ci}>
                                        {ce.link ? (
                                            <Link
                                                title={ce.title}
                                                href={`${ce.link}`}
                                                className="flex  items-center 2xl:space-x-2 2xl:mb-2 2xl:px-3 2xl:py-2 xl:space-x-1 xl:mb-2 xl:px-3 xl:py-1 lg:space-x-1 lg:mb-1 lg:px-1 lg:py-1 rounded hover:bg-[#ececee87] text-[#344054]"
                                            >
                                                {ce?.img ? (
                                                    <React.Fragment>
                                                        <Image
                                                            alt={ce.title}
                                                            src={ce?.img}
                                                            width={24}
                                                            height={24}
                                                            quality={100}
                                                            className={`object-contain"`}
                                                            loading="lazy"
                                                            crossOrigin="anonymous"
                                                            placeholder="blur"
                                                            blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                                        />
                                                        <h5 className="uppercase 3xl:text-base 2xl:text-[14px] xl:text-[10px] lg:text-[10px] ">
                                                            {ce.title}
                                                        </h5>
                                                    </React.Fragment>
                                                ) : (
                                                    <li className="3xl:text-base 2xl:text-[14px] xl:text-[12px] lg:text-[10px] text-[#344054] marker:text-[#9295A4] outline-none">
                                                        {ce.title}
                                                    </li>
                                                )}
                                            </Link>
                                        ) : (
                                            <React.Fragment>
                                                {ce.title && (
                                                    <div className="flex items-center space-x-2 mb-2 px-3">
                                                        <Image
                                                            alt={ce.title}
                                                            src={ce?.img}
                                                            width={24}
                                                            height={24}
                                                            quality={100}
                                                            className="object-contain"
                                                            loading="lazy"
                                                            crossOrigin="anonymous"
                                                            placeholder="blur"
                                                            blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                                        />
                                                        <h5 className="uppercase text-[#141522] 3xl:text-base 2xl:text-[14px] xl:text-[10px] lg:text-[10px]">
                                                            {ce.title}
                                                        </h5>
                                                    </div>
                                                )}
                                            </React.Fragment>
                                        )}
                                        {ce.items?.map((e, i) => (
                                            <Link
                                                href={e.link ? e.link : "#"}
                                                title={e.name}
                                                className="outline-none"
                                                key={i}
                                            >
                                                {/* <a title={e.name} className="outline-none"> */}
                                                <ZoomableElement
                                                    name={e?.name}
                                                />
                                                {/* <li 
                                                     style={zoomedStyle} 
                                                     onMouseDown={handleMouseDown}
                                                     onMouseUp={handleMouseUp}
                                                     onMouseEnter={handleMouseEnter}
                                                     className="text-[14px] text-[#344054] focus:transform-gpu marker:text-[#9295A4] px-3 py-2 rounded hover:bg-[#ececee87]">
                                                    {e.name}
                                                    </li> */}
                                                {/* </a> */}
                                            </Link>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </Popup>
        </div>
    );
};

const ZoomableElement = (props) => {
    const [isZoomed, setIsZoomed] = useState(false);

    const handleClick = () => {
        setIsZoomed(true);

        setTimeout(() => {
            setIsZoomed(false);
        }, 200);
    };

    const zoomedStyle = {
        transform: isZoomed ? "scale(1.1)" : "scale(1)",
        transition: "transform 0.2s",
        willChange: "transform",
    };
    return (
        <div style={zoomedStyle} onClick={handleClick}>
            <li className="3xl:text-base 2xl:text-[14px] xl:text-[12px] lg:text-[10px] text-[#344054] focus:transform-gpu marker:text-[#9295A4] px-3 py-2 rounded hover:bg-[#ececee87]">
                {props?.name}
            </li>
        </div>
    );
};

export const DropdownThongBao = (props) => {
    const [tab, sTab] = useState(0);
    const [onFetching, sOnFetching] = useState(false);
    const [checkStt, sCheckStt] = useState(false);
    const _HandleSelectTab = (e) => {
        sTab(e);
        !e && sOnFetching(true);
        if (e == 7) {
            sCheckStt(!checkStt);
        }
    };
    useEffect(() => {
        sOnFetching(true);
        setTimeout(() => {
            sOnFetching(false);
        }, 500);
    }, [tab]);
    useEffect(() => {
        sOnFetching(true);
        setTimeout(() => {
            sOnFetching(false);
        }, 500);
    }, []);

    return (
        <div className="">
            <Popup
                trigger={
                    <button
                        className={`text-slate-200 3xl:text-[18px] 2xl:text-[14px] xl:text-[12px] lg:text-[10px]  hover:text-white hover:drop-shadow-[0_0_5px_#eabd7a99] 
              `}
                    >
                        {props.children}
                    </button>
                }
                closeOnDocumentClick
                arrow={props.position}
                on={["hover"]}
                // open={true}
                position={props.position}
                className={`popover-edit -translate-y-10 ${props.className}`}
            >
                <div
                    className={`w-auto ${deca.className} bg-white mb-1  overflow-auto scrollbar-thin  scrollbar-thumb-slate-300 scrollbar-track-slate-100 3xl:max-h-[700px] xxl:max-h-[500px] 2xl:max-h-[500px] xl:max-h-[400px] lg:max-h-[370px] max-h-[500px]  px-0.5 rounded-lg justify-between  `}
                >
                    <div className="flex items-center sticky top-0  bg-white  rounded z-[999]  p-0 pt-2">
                        {props?.data?.tab &&
                            props?.data?.tab.map((e, index, array) => {
                                return (
                                    <div>
                                        <TabFilters
                                            tab={tab}
                                            key={e.id}
                                            onClick={_HandleSelectTab.bind(
                                                this,
                                                e.id
                                            )}
                                            sub={e?.sub}
                                            total={e?.total}
                                            active={e.id}
                                            checkStt={checkStt}
                                            className="text-[#0F4F9E] mt-2 mx-2 bg-[#e2f0fe] hover:bg-blue-400 z-[999] hover:text-white transition-all ease-linear"
                                        >
                                            {e.title}
                                        </TabFilters>
                                    </div>
                                );
                            })}
                    </div>
                    <div className="">
                        <div
                            className={`3xl:px-2 3xl:py-3 2xl:px-3 2xl:py-1 xl:px-0.5 xl:py-0.5 lg:px-0.5 lg:py-0.5 2xl:space-y-2 lg:space-y-1 min-w-[200px]`}
                        >
                            <div className="space-y-0.5">
                                {onFetching ? (
                                    <Loading />
                                ) : (
                                    <>
                                        <TabContent
                                            subItems={
                                                props.data?.tab.find(
                                                    (e) => e.id === tab
                                                )?.sub || []
                                            }
                                            checkStt={checkStt}
                                        />

                                        {props.data?.tab.find(
                                            (e) => e.id === tab
                                        )?.sub?.length > 0 && (
                                            <Link
                                                href={`${props.data?.tab[tab]?.link}`}
                                            >
                                                <ZoomableElements className="text-center    items-center ">
                                                    <h5 className="tex-center my-1 3xl:text-base 2xl:text-[14px] xl:text-[10px] lg:text-[10px] 2xl:space-x-2 2xl:mb-2 2xl:px-3 2xl:py-2 xl:space-x-1 xl:mb-2 xl:px-3 xl:py-1 lg:space-x-1 lg:mb-1 lg:px-1 lg:py-1 rounded hover:bg-[#ececee87] text-[#344054]">
                                                        {
                                                            props.data?.tab[tab]
                                                                ?.more
                                                        }
                                                    </h5>
                                                </ZoomableElements>
                                            </Link>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Popup>
        </div>
    );
};
const TabContent = ({ subItems, checkStt }) => {
    const [checkStatus, setCheckStatus] = useState({}); // Sử dụng một đối tượng để theo dõi trạng thái của từng phần tử

    const _HandleStatus = (index) => {
        setCheckStatus((prevStatus) => ({
            ...prevStatus,
            [index]: !prevStatus[index], // Thay đổi trạng thái cho phần tử tại index hiện tại
        }));
    };
    return (
        <div className="tab-content">
            {subItems.length === 0 ? (
                <div className=" max-w-[352px] mt-14 mx-auto">
                    <div className="text-center">
                        <div className="bg-[#EBF4FF] rounded-[100%] inline-block ">
                            <SearchNormal1 />
                        </div>
                        <h1 className="textx-[#141522] text-base opacity-90 font-medium">
                            Không tìm thấy các mục
                        </h1>
                        <div className="flex items-center justify-around mt-6 "></div>
                    </div>
                </div>
            ) : (
                <div
                    className={`3xl:px-2 3xl:py-1 2xl:px-3 2xl:py-1 xl:px-0.5 xl:py-0.5 lg:px-0.5 lg:py-0.5 2xl:space-y-2 lg:space-y-1 min-w-[200px]`}
                >
                    {subItems.map((ce, index) => (
                        <React.Fragment>
                            <Link title={ce.title} href={`${ce?.link}`}>
                                <ZoomableElements className="border-b  items-center 2xl:space-x-2 2xl:mb-2 2xl:px-3 2xl:py-2 xl:space-x-1 xl:mb-2 xl:px-3 xl:py-1 lg:space-x-1 lg:mb-1 lg:px-1 lg:py-1 rounded hover:bg-[#ececee87] text-[#344054]">
                                    <div className="flex items-center gap-2">
                                        <div className="relative ">
                                            <Image
                                                alt={ce.title}
                                                src={ce?.img}
                                                width={24}
                                                height={24}
                                                quality={100}
                                                className={`object-contain" ${ce?.class}`}
                                                loading="lazy"
                                                crossOrigin="anonymous"
                                                placeholder="blur"
                                                blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                            />
                                            <span className="h-2 w-2 absolute 3xl:bottom-full 3xl:translate-y-[150%] 3xl:left-1/2  3xl:translate-x-[100%] 2xl:bottom-[80%] 2xl:translate-y-full 2xl:left-1/2 bottom-[50%] left-1/2 translate-x-full translate-y-full">
                                                <span className="inline-flex relative rounded-full h-2 w-2 bg-lime-500">
                                                    <span className="animate-ping  inline-flex h-full w-full rounded-full bg-lime-400 opacity-75 absolute"></span>
                                                </span>
                                            </span>
                                        </div>
                                        <div className="flex items-center w-full justify-between">
                                            <div className="w-[90%]">
                                                <h5 className="3xl:text-base 2xl:text-[14px] xl:text-[10px] lg:text-[10px] ">
                                                    {ce?.title.slice(0, 82)}
                                                    {ce?.title.length > 82 && (
                                                        <span className="">
                                                            ...
                                                        </span>
                                                    )}
                                                </h5>

                                                <h5 className="text-xs text-gray-600 italic">
                                                    {ce.time}
                                                </h5>
                                            </div>
                                            <div className="">
                                                {checkStt ||
                                                checkStatus[index] ? (
                                                    <TickCircle
                                                        size="16"
                                                        color="green"
                                                    />
                                                ) : (
                                                    <Tooltip
                                                        title={
                                                            "Đánh dấu là đã đọc"
                                                        }
                                                        arrow
                                                        theme="dark"
                                                    >
                                                        <Cd
                                                            onClick={() =>
                                                                _HandleStatus(
                                                                    index
                                                                )
                                                            } // Truyền index vào hàm xử lý
                                                            size="16"
                                                            className="hover:text-green-600 hover:scale-105 transition-all ease-linear "
                                                        />
                                                    </Tooltip>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </ZoomableElements>
                            </Link>
                        </React.Fragment>
                    ))}
                </div>
            )}
        </div>
    );
};
const TabFilters = React.memo((props) => {
    return (
        <button
            style={props.style}
            onClick={props.onClick}
            className={`${
                props.tab == props.active && "bg-blue-400 text-white"
            } ${
                props.className
            } justify-center 3xl:text-[12px] xxl:text-[11px]  2xl:text-[8.5px] xl:text-[8px] lg:text-[7.5px] text-[9px] flex  items-center rounded-md px-2 py-1 outline-none relative`}
        >
            {props.children}
            {!props.checkStt && (
                <span
                    className={`${
                        props?.sub?.length > 0 &&
                        "absolute 3xl:w-[20px] 2xl:w-[20px] xl:w-[18px] lg:w-[18px] 3xl:h-[20px] 2xl:h-[20px] xl:h-[18px] lg:h-[18px] 3xl:py-1 3xl:px-2  2xl:py-1 2xl:px-2  xl:py-1 xl-px-2  lg:py-1 lg:px-2 3xl:text-[10px] 2xl:text-[9px] xl:text-[9px] lg:text-[9px] text-[9px] top-0 right-0 bg-[#ff6f00]  3xl:translate-x-[30%] 2xl:translate-x-2.5 xl:translate-x-2 lg:translate-x-[40%] 3xl:-translate-y-[50%] 2xl:-translate-y-2  xl:-translate-y-[40%] lg:-translate-y-[40%] text-white rounded-full text-center items-center flex justify-center"
                    } `}
                >
                    {/* {props?.total > 0 && props?.total} */}
                    {props?.sub?.length > 0 && props?.sub?.length}
                </span>
            )}
        </button>
    );
});

const ZoomableElements = (props) => {
    const [isZoomed, setIsZoomed] = useState(false);

    const handleClick = () => {
        setIsZoomed(true);

        setTimeout(() => {
            setIsZoomed(false);
        }, 200);
    };

    const zoomedStyle = {
        transform: isZoomed ? "scale(1.01)" : "scale(1)",
        transition: "transform 0.2s",
        willChange: "transform",
    };
    return (
        <div
            style={zoomedStyle}
            onClick={handleClick}
            className={props.className}
        >
            {props.children}
        </div>
    );
};
