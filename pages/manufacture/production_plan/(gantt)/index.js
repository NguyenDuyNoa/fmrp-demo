import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import Popup from "reactjs-popup";
import TransitionMotion from "@/components/UI/transition/motionTransition";

const BodyGantt = ({ handleShowSub, handleCheked, handleSort, data, isAscending, timeLine }) => {
    const header = [
        { id: uuid(), name: "Đơn hàng" },
        { id: uuid(), name: "Trạng thái" },
        { id: uuid(), name: "Số lượng" },
        { id: uuid(), name: "Action" },
    ];

    const container1Ref = useRef();
    const container2Ref = useRef();
    const container3Ref = useRef();

    const handleScroll = (e) => {
        const container1Element = container1Ref.current;
        const container2Element = container2Ref.current;

        container2Element.scrollLeft = container1Element.scrollLeft;
        container1Ref.current.scrollTop = e.target.scrollTop;
        container3Ref.current.scrollTop = e.target.scrollTop;
    };

    const handleScrollContainer2 = (e) => {
        container1Ref.current.scrollTop = e.target.scrollTop;
        container3Ref.current.scrollTop = e.target.scrollTop;
    };

    return (
        <div className="flex flex-col ">
            <div className="flex items-end  border-t overflow-hidden border-b">
                <div className={`min-w-[35%]  w-[35%]`}>
                    <div className="flex items-center  gap-2  px-1 ">
                        <div onClick={() => handleSort()} className="flex-col flex gap-1 cursor-pointer w-[2%]">
                            <Image
                                alt=""
                                width={7}
                                height={4}
                                src={!isAscending ? "/productionPlan/Shapedow.png" : "/productionPlan/Shapedrop.png"}
                                className={`${
                                    isAscending ? "" : "rotate-180"
                                } object-cover hover:scale-110 transition-all ease-linear duration-200`}
                            />
                            <Image
                                alt=""
                                width={7}
                                height={4}
                                src={isAscending ? "/productionPlan/Shapedow.png" : "/productionPlan/Shapedrop.png"}
                                className={`${
                                    !isAscending ? "rotate-180" : ""
                                } object-cover hover:scale-110 transition-all ease-linear duration-200`}
                            />
                        </div>
                        <div className="grid grid-cols-12 w-full">
                            {header.map((e) => (
                                <div
                                    key={e.id}
                                    className="text-[#52575E] font-normal 3xl:text-sm  xxl:text-[11px] 2xl:text-[12px] xl:text-[11px] lg:text-[10px] text-[13px] col-span-3"
                                >
                                    {e.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className={` flex  gap-4 divide-x border-l overflow-hidden`} ref={container2Ref}>
                    {timeLine.map((e) => (
                        <div key={e.id} className="">
                            <div className="text-[#202236] font-semibold text-sm px-1 py-1">{e.title}</div>
                            <div className="flex items-end gap-2 divide-x">
                                {e.days.map((i, iIndex) => {
                                    const parts = i.day.split(" ");
                                    return (
                                        <div key={i.id} className="flex items-center gap-2 w-[70.5px]">
                                            <h1 className="text-[#667085] font-light 3xl:text-base text-sm  3xl:px-1.5 px-3">
                                                {parts[0]}
                                            </h1>
                                            {iIndex == e.days.length - 1 ? (
                                                <h1
                                                    className={`bg-[#5599EC] my-0.5  px-1 py-0.5 rounded-full text-white font-semibold 3xl:text-base text-sm`}
                                                >
                                                    {parts[1]}
                                                </h1>
                                            ) : (
                                                <h1
                                                    className={`text-[#202236] rounded-full py-0.5 font-semibold 3xl:text-base text-sm `}
                                                >
                                                    {parts[1]}
                                                </h1>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex  items-center divide-x">
                <div
                    ref={container3Ref}
                    onScroll={handleScrollContainer2}
                    className="flex-col min-w-[35%] w-[35%] overflow-y-auto scrollbar-thin  scrollbar-thumb-transparent scrollbar-track-transparent
                        3xl:h-[65.2vh] xxl:h-[51vh] 2xl:h-[57.5vh] xl:h-[53vh] lg:h-[51vh] h-[55vh]"
                >
                    {data.map((e, eIndex) => {
                        const outDate = ["outDate"].includes(e.status);
                        const processing = ["processing"].includes(e.status);
                        const sussces = ["sussces"].includes(e.status);
                        return (
                            <React.Fragment>
                                <div className={`w-full`}>
                                    <div className={`${!e.show ? "my-1" : "mt-1"}`}>
                                        <div
                                            onClick={() => handleShowSub(eIndex)}
                                            type="button"
                                            key={e.id}
                                            className="flex w-full  cursor-pointer items-center group gap-2 py-2 bg-[#F3F4F6] rounded  px-1"
                                        >
                                            <Image
                                                alt=""
                                                width={7}
                                                height={4}
                                                src={"/productionPlan/Shapedow.png"}
                                                className={`${
                                                    e.show ? "rotate-0 t" : "-rotate-90 "
                                                } object-cover duration-500  transition-all ease-in-out`}
                                            />
                                            <div className="grid grid-cols-12 w-full items-center gap-4">
                                                <h2
                                                    className={`text-[#52575E] ${
                                                        (outDate && "group-hover:text-[#EE1E1E]") ||
                                                        (processing && "group-hover:text-[#3276FA]") ||
                                                        (sussces && "group-hover:text-[#0BAA2E]")
                                                    } 3xl:text-sm  transition-all ease-in-out xxl:text-[11px] 2xl:text-[12px] xl:text-[11px] lg:text-[10px] text-[13px] font-semibold col-span-3`}
                                                >
                                                    {e.nameOrder}
                                                </h2>
                                                <div className="flex items-center gap-1 col-span-3">
                                                    <h2
                                                        className={`${
                                                            (outDate && "text-[#EE1E1E]") ||
                                                            (processing && "text-[#3276FA]") ||
                                                            (sussces && "text-[#0BAA2E]")
                                                        }  3xl:text-[13px] whitespace-nowrap  xxl:text-[11px] 2xl:text-[12px] xl:text-[11px] lg:text-[10px] text-[13px] font-medium`}
                                                    >
                                                        {(outDate && "Đã quá hạn") ||
                                                            (processing && "Đang thực hiện") ||
                                                            (sussces && "Hoàn thành")}
                                                    </h2>
                                                    <h3
                                                        className={`${
                                                            (outDate &&
                                                                "text-[#EE1E1E] border-[#EE1E1E] bg-[#FFEEF0]") ||
                                                            (processing &&
                                                                "text-[#3276FA] border-[#3276FA] bg-[#EBF5FF]") ||
                                                            (sussces && "text-[#0BAA2E] border-[#0BAA2E] bg-[#EBFEF2]")
                                                        } 3xl:text-xs  xxl:text-[9px] 2xl:text-[10px] xl:text-[10px] lg:text-[9px] text-[13px] font-normal  py-0.5 px-2 rounded-lg border`}
                                                    >
                                                        {e.process}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                        {e.show &&
                                            e.listProducts.map((i, iIndex) => (
                                                <TransitionMotion>
                                                    <label
                                                        key={i.id}
                                                        htmlFor={i.id}
                                                        className={`
                                                       cursor-pointer grid grid-cols-12 items-center my-2 `}
                                                    >
                                                        <div className="flex items-center 3xl:gap-2 gap-1 col-span-3">
                                                            {/* <input
                                                            id={i.id}
                                                            type="checkbox"
                                                            className="h-5 w-5 rounded-full"
                                                            checked={i.checked}
                                                            onChange={() => handleCheked(e.id, i.id)}
                                                        /> */}
                                                            <label htmlFor={i.id} className="inline-flex items-center">
                                                                <input
                                                                    id={i.id}
                                                                    type="checkbox"
                                                                    className="hidden"
                                                                    checked={i.checked}
                                                                    onChange={() => handleCheked(e.id, i.id)}
                                                                />
                                                                <div
                                                                    className={`w-4 h-4 rounded-full  border border-gray-300 flex justify-center items-center ${
                                                                        i.checked ? "bg-blue-600" : "bg-white"
                                                                    }`}
                                                                    onClick={() => handleCheked(e.id, i.id)}
                                                                >
                                                                    {i.checked && (
                                                                        <svg
                                                                            className="w-3 h-3 text-white"
                                                                            fill="none"
                                                                            stroke="currentColor"
                                                                        >
                                                                            <circle cx="50%" cy="50%" r="40%" />
                                                                        </svg>
                                                                    )}
                                                                </div>
                                                            </label>

                                                            <Image
                                                                src={i.images}
                                                                width={36}
                                                                height={36}
                                                                alt=""
                                                                className="object-cover rounded-md"
                                                            />
                                                            <div className="flex flex-col">
                                                                <h1 className="text-[#000000] font-semibold 3xl:text-sm  xxl:text-[11px] 2xl:text-[12px] xl:text-[11px] lg:text-[10px] text-[13px]">
                                                                    {i.name}
                                                                </h1>
                                                                <h1 className="text-[#9295A4] font-normal 3xl:text-[10px] xxl:text-[8px] 2xl:text-[9px] xl:text-[8px] lg:text-[7px]">
                                                                    {i.desription}
                                                                </h1>
                                                            </div>
                                                        </div>
                                                        <h3
                                                            className={`${
                                                                (i.status == "outDate" && "text-[#EE1E1E]") ||
                                                                (i.status == "sussces" && "text-[#0BAA2E]") ||
                                                                (i.status == "unfulfilled" && "text-[#FF8F0D]")
                                                            } font-medium 3xl:text-sm  xxl:text-[11px] 2xl:text-[12px] xl:text-[11px] lg:text-[10px] text-[13px] col-span-3  px-4`}
                                                        >
                                                            {i.status == "outDate" && "Đã quá hạn"}
                                                            {i.status == "sussces" && "Hoàn thành"}
                                                            {i.status == "unfulfilled" && "Chưa thực hiện"}
                                                        </h3>
                                                        <h3 className="text-[#52575E] font-normal 3xl:text-sm  xxl:text-[11px] 2xl:text-[12px] xl:text-[11px] lg:text-[10px] text-[13px] col-span-3">
                                                            {i.quantity}
                                                        </h3>
                                                        <h3 className="text-[#667085] border-b w-fit font-medium 3xl:text-sm  xxl:text-[11px] 2xl:text-[12px] xl:text-[11px] lg:text-[10px] text-[13px] col-span-3 ">
                                                            {i.actions}
                                                        </h3>
                                                    </label>
                                                </TransitionMotion>
                                            ))}
                                    </div>
                                </div>
                            </React.Fragment>
                        );
                    })}
                </div>
                <div
                    ref={container1Ref}
                    onScroll={handleScroll}
                    className="flex-col  overflow-x  overflow-y-auto scrollbar-thin   scrollbar-thumb-slate-300 scrollbar-track-slate-100
                 3xl:h-[65.2vh] xxl:h-[51vh] 2xl:h-[57.5vh] xl:h-[53vh] lg:h-[51vh] h-[55vh]"
                >
                    {data.map((e, eIndex) => {
                        return (
                            <div className="">
                                <div className={`py-2 h-[41px]`}>
                                    <div className="flex gap-1 items-center ">
                                        <p className="text-[#11315B]  3xl:text-xs  xxl:text-[9px] 2xl:text-[10px] xl:text-[10px] lg:text-[9px] text-[13px] font-normal">
                                            {e.nameOrder}
                                        </p>
                                        {e.status == "sussces" && (
                                            <div className="w-[18px] h-[18px]">
                                                <Image
                                                    src={"/productionPlan/tick-circle.png"}
                                                    width={36}
                                                    height={36}
                                                    alt=""
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center ">
                                        {e.processDefault.map((ce, ceIndex) => {
                                            return ce.days.map((ci, ciIndex) => {
                                                return (
                                                    <div key={ci.id} className={`w-[80px] flex items-center`}>
                                                        <div
                                                            className={`${
                                                                ci.active ? "bg-[#D0D5DD]" : ""
                                                            } py-1 w-[80px] `}
                                                        ></div>
                                                    </div>
                                                );
                                            });
                                        })}
                                    </div>
                                </div>

                                {e.show &&
                                    e.listProducts.map((i, iIndex) => {
                                        return (
                                            <TransitionMotion>
                                                <div className="flex  w-[65%] h-[35px] my-2 ">
                                                    {i.processArr.map((ce, ceIndex) => {
                                                        return ce.days.map((ci, ciIndex) => {
                                                            return (
                                                                <div key={ci.id} className={`w-[80px] `}>
                                                                    <Popup
                                                                        className="popover-productionPlan"
                                                                        arrow={true}
                                                                        arrowStyle={{
                                                                            color:
                                                                                (ci.active &&
                                                                                    !ci.outDate &&
                                                                                    "#fecaca") ||
                                                                                (ci.active && ci.outDate && "#bae6fd"),
                                                                        }}
                                                                        trigger={
                                                                            <div
                                                                                className={`${
                                                                                    ci.active && ci.outDate
                                                                                        ? "bg-[#5599EC] hover:bg-sky-200"
                                                                                        : ""
                                                                                }  h-[20px] w-[80px] relative  transition-all duration-200 ease-in-out `}
                                                                            >
                                                                                <div
                                                                                    className={`${
                                                                                        ci.active && !ci.outDate
                                                                                            ? "bg-[#EE1E1E] hover:bg-red-200"
                                                                                            : ""
                                                                                    } 
                                                                                 h-[20px] w-[80px] absolute top-0 left-0 transition-all duration-200 ease-in-out  `}
                                                                                ></div>
                                                                            </div>
                                                                        }
                                                                        position="top center"
                                                                        on={["hover", "focus"]}
                                                                    >
                                                                        <div
                                                                            className={`flex flex-col ${
                                                                                (ci.active &&
                                                                                    !ci.outDate &&
                                                                                    "bg-red-200") ||
                                                                                (ci.active &&
                                                                                    ci.outDate &&
                                                                                    "bg-sky-200")
                                                                            } px-2.5 py-0.5 font-medium text-sm rounded-sm capitalize`}
                                                                        >
                                                                            {ci.type}
                                                                        </div>
                                                                    </Popup>
                                                                </div>
                                                            );
                                                        });
                                                    })}
                                                </div>
                                            </TransitionMotion>
                                        );
                                    })}
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="w-full border-b flex flex-col">
                <div className="border-b">
                    <button type="button" className="flex items-center gap-2 my-2">
                        <Image src={"/productionPlan/Vector.png"} width={10} height={10} className="object-cover" />
                        <h1 className="text-[#52575E] font-normal text-sm"> Thêm sản phẩm</h1>
                    </button>
                </div>
            </div>
        </div>
    );
};
export default BodyGantt;
