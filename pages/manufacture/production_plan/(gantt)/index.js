import Image from "next/image";
import Popup from "reactjs-popup";
import React, { useRef, useState, useEffect } from "react";
import ModalImage from "react-modal-image";
import { SearchNormal1 as IconSearch } from "iconsax-react";

import Loading from "@/components/UI/loading";
import Zoom from "@/components/UI/zoomElement/zoomElement";

import formatNumber from "@/utils/helpers/formatnumber";
import { FnlocalStorage } from "@/utils/helpers/localStorage";
import useToast from "@/hooks/useToast";

const BodyGantt = ({
    handleShowSub,
    handleCheked,
    handleSort,
    data,
    isSort,
    timeLine,
    handleToggle,
    dataLang,
    handleQueryId,
    router,
    isFetching,
    handleTab,
    arrIdChecked,
    handleChekedAll,
}) => {
    const showToast = useToast();

    const container1Ref = useRef();
    const container2Ref = useRef();
    const container3Ref = useRef();

    //chiều cao của mặt hàng 

    const heightItems = useRef(null)


    const { getItem } = FnlocalStorage();

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

    const tab = getItem("tab");

    const [checkCkecked, sCheckCkecked] = useState(false);


    console.log("daaa", data);


    useEffect(() => {
        sCheckCkecked(false);
    }, [router]);

    return (
        <React.Fragment>
            {data?.length > 0 ? (
                <div className="flex flex-col ">
                    <div className="flex items-end  border-t overflow-hidden border-b">
                        <div className={`min-w-[35%]  w-[35%]`}>
                            <div className="flex items-center gap-2 pb-1 pl-2">
                                {[
                                    { name: " Đơn hàng bán", tab: "order" },
                                    { name: "Kế hoạch nội bộ", tab: "plan" },
                                ].map((e) => (
                                    <Zoom className="w-fit">
                                        <button
                                            key={e.tab}
                                            onClick={() =>
                                                arrIdChecked?.length > 0
                                                    ? handleQueryId({ status: true, initialKey: e.tab })
                                                    : handleTab(e.tab)
                                            }
                                            type="button"
                                            className={`${router == e.tab ? "bg-sky-200 text-sky-600" : "bg-sky-50 text-sky-500"
                                                }  hover:bg-sky-200 hover:text-sky-600 font-semibold text-[11px] text-sky-400 px-2 py-[5px] rounded-xl transition-all duration-150 ease-linear`}
                                        >
                                            {e.name}
                                        </button>
                                    </Zoom>
                                ))}
                            </div>
                            <div className="grid grid-cols-12  gap-2">
                                <div className="col-span-1 flex items-center gap-1">
                                    <div className="mr-1">
                                        {/* <button
                                            type="button"
                                            onClick={() => handleChekedAll()}
                                            className={`min-w-4 w-4 max-w-4 relative min-h-4 max-h-4  h-4 rounded-full cursor-pointer outline-none focus:outline-none   flex justify-center items-center ${
                                                arrIdChecked?.length > 0
                                                    ? "bg-blue-500 before:w-2 before:h-2 before:rounded-full before:border-gray-300 before:border before:bg-white border border-gray-100"
                                                    : "bg-white border border-gray-300 "
                                            }`}
                                        ></button> */}
                                        <label
                                            className="relative flex items-center  cursor-pointer rounded-[4px] "
                                            htmlFor={"checkbox"}
                                        >
                                            <input
                                                id="checkbox"
                                                type="checkbox"
                                                checked={checkCkecked}
                                                className="peer relative h-[15px] w-[15px] cursor-pointer appearance-none rounded-[4px] border border-blue-gray-200 transition-all  checked:border-blue-500 checked:bg-blue-500 "
                                                onChange={() => {
                                                    handleChekedAll();
                                                    sCheckCkecked(!checkCkecked);
                                                }}
                                            />
                                            <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-3 w-3"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                    stroke="currentColor"
                                                    stroke-width="1"
                                                >
                                                    <path
                                                        fill-rule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clip-rule="evenodd"
                                                    ></path>
                                                </svg>
                                            </div>
                                        </label>
                                    </div>
                                    <div onClick={() => handleSort()} className="flex-col flex gap-1 cursor-pointer ">
                                        <Image
                                            alt={!isSort ? "/productionPlan/Shapedow.png" : "/productionPlan/Shapedrop.png"
                                            }
                                            width={7}
                                            height={4}
                                            src={
                                                !isSort ? "/productionPlan/Shapedow.png" : "/productionPlan/Shapedrop.png"
                                            }
                                            className={`${isSort ? "" : "rotate-180"} object-cover hover:scale-110 transition-all ease-linear duration-200`}
                                        />
                                        <Image
                                            alt={
                                                isSort ? "/productionPlan/Shapedow.png" : "/productionPlan/Shapedrop.png"
                                            }
                                            width={7}
                                            height={4}
                                            src={
                                                isSort ? "/productionPlan/Shapedow.png" : "/productionPlan/Shapedrop.png"
                                            }
                                            className={`${!isSort ? "rotate-180" : ""} object-cover hover:scale-110 transition-all ease-linear duration-200`}
                                        />
                                    </div>
                                </div>
                                <div className="col-span-11 grid grid-cols-11 w-full">
                                    <div className="text-[#52575E] font-normal 3xl:text-sm  xxl:text-[11px] 2xl:text-[12px] xl:text-[11px] lg:text-[10px] text-[13px] col-span-3">
                                        Đơn hàng
                                    </div>
                                    <div className="text-[#52575E] font-normal 3xl:text-sm  xxl:text-[11px] 2xl:text-[12px] xl:text-[11px] lg:text-[10px] text-[13px] col-span-2">
                                        Trạng thái
                                    </div>
                                    <div className="text-[#52575E] text-center font-normal 3xl:text-sm  xxl:text-[11px] 2xl:text-[12px] xl:text-[11px] lg:text-[10px] text-[13px] col-span-2">
                                        SL
                                    </div>
                                    <div className="text-[#52575E] text-center font-normal 3xl:text-sm  xxl:text-[11px] 2xl:text-[12px] xl:text-[11px] lg:text-[10px] text-[13px] col-span-2">
                                        SL đã lập KHSX
                                    </div>
                                    <div className="text-[#52575E] text-center font-normal 3xl:text-sm  xxl:text-[11px] 2xl:text-[12px] xl:text-[11px] lg:text-[10px] text-[13px] col-span-2">
                                        SL còn lại
                                    </div>
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
                                                            className={`bg-[#5599EC] my-0.5  px-2.5 py-0.5 rounded-full text-white font-semibold 3xl:text-base text-sm`}
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
                    {isFetching ? (
                        <Loading />
                    ) : (
                        <div className="flex divide-x">
                            <div
                                ref={container3Ref}
                                onScroll={handleScrollContainer2}
                                className="flex-col min-w-[35%] w-[35%]  overflow-y-auto scrollbar-thin  scrollbar-thumb-transparent scrollbar-track-transparent
                            3xl:h-[61vh] xxl:h-[51vh] 2xl:h-[52.5vh] xl:h-[48vh] lg:h-[46vh] h-[55vh]"
                            >
                                {data?.map((e) => {
                                    const outDate = ["outDate"].includes(e.status);
                                    const processing = ["processing"].includes(e.status);
                                    const sussces = ["sussces"].includes(e.status);
                                    const unfulfilled = ["unfulfilled"].includes(e.status);
                                    return (
                                        <React.Fragment>
                                            <div key={e.id} className={``}>
                                                <div className={`${!e.show ? "my-1" : "mt-1"}`}>
                                                    <div className="grid grid-cols-12">
                                                        <div
                                                            onClick={() => handleShowSub(e.id)}
                                                            type="button"
                                                            className="col-span-12 grid grid-cols-12 w-full  cursor-pointer items-center group gap-2 py-2 bg-[#F3F4F6] rounded"
                                                        >
                                                            <Image
                                                                alt="sub"
                                                                width={7}
                                                                height={4}
                                                                src={"/productionPlan/Shapedow.png"}
                                                                className={`${e.show ? "rotate-0 t" : "-rotate-90 "} object-cover duration-500 col-span-1 mx-auto  transition-all ease-in-out`}
                                                            />
                                                            <div className="grid grid-cols-11 col-span-11 w-full items-center gap-2">
                                                                <h2
                                                                    className={`text-[#52575E] ${(outDate && "group-hover:text-[#EE1E1E]") ||
                                                                        (processing && "group-hover:text-[#3276FA]") ||
                                                                        (sussces && "group-hover:text-[#0BAA2E]") ||
                                                                        (unfulfilled && "group-hover:text-[#FF8F0D]")
                                                                        } 3xl:text-sm  transition-all ease-in-out xxl:text-[11px] 2xl:text-[12px] xl:text-[11px] lg:text-[10px] text-[13px] font-semibold col-span-3`}
                                                                >
                                                                    {e.nameOrder}
                                                                </h2>
                                                                <div className="flex items-center gap-1 col-span-2">
                                                                    <h2
                                                                        className={`${(outDate && "text-[#EE1E1E]") ||
                                                                            (processing && "text-[#3276FA]") ||
                                                                            (sussces && "text-[#0BAA2E]") ||
                                                                            (unfulfilled && "text-[#FF8F0D]")
                                                                            }  3xl:text-[13px] whitespace-nowrap  xxl:text-[11px] 2xl:text-[12px] xl:text-[11px] lg:text-[10px] text-[13px] font-medium`}
                                                                    >
                                                                        {(outDate && "Đã quá hạn") ||
                                                                            (processing && "Đang thực hiện") ||
                                                                            (sussces && "Hoàn thành") ||
                                                                            (unfulfilled && "Chưa thực hiện")}
                                                                    </h2>
                                                                    <h3
                                                                        className={`${(outDate &&
                                                                            "text-[#EE1E1E] border-[#EE1E1E] bg-[#FFEEF0]") ||
                                                                            (processing && "text-[#3276FA] border-[#3276FA] bg-[#EBF5FF]") ||
                                                                            (sussces && "text-[#0BAA2E] border-[#0BAA2E] bg-[#EBFEF2]") ||
                                                                            (unfulfilled && "text-[#FF8F0D] border-[#FF8F0D] bg-[#fef3c7]")
                                                                            } 3xl:text-xs  xxl:text-[9px] 2xl:text-[10px] xl:text-[10px] lg:text-[9px] text-[13px] font-normal  py-0.5 px-2 rounded-lg border`}
                                                                    >
                                                                        {e.process}
                                                                    </h3>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {e.show &&
                                                        e.listProducts.map((i, iIndex) => (
                                                            <label ref={heightItems} key={i.id} htmlFor={i.id} className={`cursor-pointer grid grid-cols-12 gap-2 items-center my-2 h-[50px]`}
                                                            >
                                                                <div className="col-span-1 mx-auto">
                                                                    <button
                                                                        type="button"
                                                                        id={i.id}
                                                                        onClick={async () => {
                                                                            if (i?.quantityRemaining == 0) {
                                                                                showToast("error", "Vui lòng chọn đơn hàng có số lượng còn lại lớn hơn 0", 4000);
                                                                                return;
                                                                            }
                                                                            await handleCheked(e.id, i.id);
                                                                        }}
                                                                        className={`min-w-4 w-4 max-w-4 relative min-h-4 max-h-4  h-4 rounded-full cursor-pointer outline-none focus:outline-none   flex justify-center items-center ${i.checked
                                                                            ? "bg-blue-500 before:w-2 before:h-2 before:-translate-x-[5%] before:translate-y-[5%] before:rounded-full before:border-gray-300 before:border before:bg-white border border-gray-100"
                                                                            : "bg-white border border-gray-300 "
                                                                            }`}
                                                                    ></button>
                                                                </div>
                                                                <div className="flex items-center 3xl:gap-2 gap-1 col-span-3">
                                                                    {i.images != null ? (
                                                                        <ModalImage
                                                                            small={i.images}
                                                                            large={i.images}
                                                                            width={36}
                                                                            height={36}
                                                                            alt={i.name}
                                                                            className="object-cover rounded-md min-w-[36px] min-h-[36px] w-[36px] h-[36px] max-w-[36px] max-h-[36px]"
                                                                        />
                                                                    ) : (
                                                                        <ModalImage
                                                                            width={36}
                                                                            height={36}
                                                                            small="/no_img.png"
                                                                            large="/no_img.png"
                                                                            className="object-cover rounded-md min-w-[36px] min-h-[36px] w-[36px] h-[36px] max-w-[36px] max-h-[36px]"
                                                                        ></ModalImage>
                                                                    )}
                                                                    <div className="flex flex-col ">
                                                                        <h1 className="text-[#000000] font-semibold 3xl:text-xs  xxl:text-[11px] 2xl:text-[10px] xl:text-[9px] lg:text-[9px] text-[11px] ">
                                                                            {i.name}
                                                                        </h1>
                                                                        <h1 className="text-[#9295A4] font-normal 3xl:text-[10px] xxl:text-[8px] 2xl:text-[9px] xl:text-[8px] lg:text-[7px]">
                                                                            {i.desription} - {i.productVariation}
                                                                        </h1>
                                                                    </div>
                                                                </div>
                                                                <h3
                                                                    className={`${(i.status == "outDate" && "text-[#EE1E1E]") ||
                                                                        (i.status == "sussces" && "text-[#0BAA2E]") ||
                                                                        (i.status == "unfulfilled" && "text-[#FF8F0D]")
                                                                        } font-medium col-span-2 3xl:text-[13px] whitespace-nowrap  xxl:text-[11px] 2xl:text-[12px] xl:text-[11px] lg:text-[10px] text-[13px]`}
                                                                >
                                                                    {i.status == "outDate" && "Đã quá hạn"}
                                                                    {i.status == "sussces" && "Hoàn thành"}
                                                                    {i.status == "unfulfilled" && "Chưa thực hiện"}
                                                                </h3>
                                                                <h3 className="text-[#52575E] pl-4 text-center font-normal 3xl:text-sm  xxl:text-[11px] 2xl:text-[12px] xl:text-[11px] lg:text-[10px] text-[13px] col-span-2">
                                                                    {formatNumber(i.quantity)}
                                                                </h3>
                                                                <h3 className="text-[#52575E] pl-4 text-center font-normal 3xl:text-sm  xxl:text-[11px] 2xl:text-[12px] xl:text-[11px] lg:text-[10px] text-[13px] col-span-2">
                                                                    {formatNumber(i.quantityPlan)}
                                                                </h3>
                                                                <h3 className="text-[#667085] text-center  font-medium 3xl:text-sm  xxl:text-[11px] 2xl:text-[12px] xl:text-[11px] lg:text-[10px] text-[13px] col-span-2 ">
                                                                    {formatNumber(i.quantityRemaining)}
                                                                </h3>
                                                            </label>
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
                                className="flex-col w-full overflow-x-auto  overflow-y-auto scrollbar-thin   scrollbar-thumb-slate-300 scrollbar-track-slate-100
                             3xl:h-[61vh] xxl:h-[51vh] 2xl:h-[52.5vh] xl:h-[48vh] lg:h-[46vh] h-[55vh]"
                            >
                                {data?.map((e, eIndex) => {
                                    return (
                                        <>
                                            {/* <div
                                                className={`${e.listProducts[eIndex]?.name.split(" ")?.length > 3 ? "py-3" : "py-2"}  h-[41px]`}
                                            >
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
                                                                alt="hii"
                                                                className="object-cover w-full h-full"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center ">
                                                    {e.processDefault.map((ce) => {
                                                        return ce.days.map((ci) => {
                                                            return (
                                                                <div key={ci.id} className={`w-[80px] flex items-center`}>
                                                                    <div className={`${ci.active ? "bg-[#D0D5DD]" : ""} py-1 w-[80px] `}></div>
                                                                </div>
                                                            );
                                                        });
                                                    })}
                                                </div>
                                            </div>

                                            {e.show &&
                                                e.listProducts.map((i, iIndex) => {
                                                    return (
                                                        <div
                                                            key={i.id}
                                                            className={`${i.name?.split(" ")?.length > 3 ? "mt-3" : "mt-2"} flex items-center  w-[65%] h-[40px]`}>
                                                            {i.processArr.map((ce) => {
                                                                return ce.days.map((ci) => {
                                                                    return (
                                                                        <div key={ci.id} className={`w-[80px]`}>
                                                                            <Popup
                                                                                className="popover-productionPlan"
                                                                                arrow={true}
                                                                                arrowStyle={{
                                                                                    color: (ci.active && !ci.outDate && "#fecaca") || (ci.active && ci.outDate && "#bae6fd"),
                                                                                }}
                                                                                trigger={
                                                                                    <div
                                                                                        className={`${ci.active && ci.outDate
                                                                                            ? "bg-[#5599EC] hover:bg-sky-200" : ""}  h-[20px] w-[80px] relative  transition-all duration-200 ease-in-out `}
                                                                                    >
                                                                                        <div
                                                                                            className={`${ci.active && !ci.outDate ? "bg-[#EE1E1E] hover:bg-red-200" : ""} 
                                                                                        h-[20px] w-[80px] absolute top-0 left-0 transition-all duration-200 ease-in-out  `}></div>
                                                                                    </div>
                                                                                }
                                                                                position="top center"
                                                                                on={["hover", "focus"]}
                                                                            >
                                                                                <div
                                                                                    className={`flex flex-col ${(ci.active && !ci.outDate && "bg-red-200") || (ci.active && ci.outDate && "bg-sky-200")
                                                                                        } px-2.5 py-0.5 font-medium text-sm rounded-sm capitalize`}
                                                                                >
                                                                                    {ci.date}
                                                                                </div>
                                                                            </Popup>
                                                                        </div>
                                                                    );
                                                                });
                                                            })}
                                                        </div>
                                                    );
                                                })} */}

                                            <div key={e.id} className={``}>
                                                <div className={`${!e.show ? "my-1" : "mt-1"}`}>
                                                    <div
                                                        className={`${e.listProducts[eIndex]?.name.split(" ")?.length > 3 ? "py-3" : "py-2"}  h-[37px]`}
                                                    >
                                                        {/* <div className="flex gap-1 items-center ">
                                                            <p className="text-[#11315B]  3xl:text-xs  xxl:text-[9px] 2xl:text-[10px] xl:text-[10px] lg:text-[9px] text-[13px] font-normal">
                                                                {e.nameOrder}
                                                            </p>
                                                            {e.status == "sussces" && (
                                                                <div className="w-[18px] h-[18px]">
                                                                    <Image
                                                                        src={"/productionPlan/tick-circle.png"}
                                                                        width={36}
                                                                        height={36}
                                                                        alt="hii"
                                                                        className="object-cover w-full h-full"
                                                                    />
                                                                </div>
                                                            )}
                                                        </div> */}
                                                        {/* <div className="flex items-center ">
                                                            {e.processDefault.map((ce) => {
                                                                <div key={ce.id} className={`w-[80px] flex items-center`}>
                                                                    <div className={`${ce.active ? "bg-[#D0D5DD]" : ""} py-1 w-[80px] `}></div>
                                                                </div>
                                                            })}
                                                        </div> */}
                                                    </div>

                                                    {e.show &&
                                                        e.listProducts.map((i, iIndex) => {
                                                            return (
                                                                <div
                                                                    key={i.id}
                                                                    className={`flex items-center  w-[65%] my-2 h-[50px]`} id={`div-${i.id}`}>
                                                                    {i.processArr.map((ci) => {
                                                                        return (
                                                                            <div key={ci?.id} className={`w-[80px]`}>
                                                                                {/* <Popup
                                                                                    className="popover-productionPlan"
                                                                                    arrow={true}
                                                                                    arrowStyle={{
                                                                                        color: (!ci?.active && "#fecaca") || (ci?.active && "#bae6fd"),
                                                                                    }}
                                                                                    trigger={
                                                                                        <div
                                                                                            className={`${ci?.active ? "bg-[#5599EC] hover:bg-sky-200" : ""}  h-[20px] w-[80px] relative  transition-all duration-200 ease-in-out `}
                                                                                        >
                                                                                            <div
                                                                                                className={`${!ci?.active ? "bg-[#EE1E1E] hover:bg-red-200" : ""} 
                                                                                        h-[20px] w-[80px] absolute top-0 left-0 transition-all duration-200 ease-in-out  `}></div>
                                                                                        </div>
                                                                                    }
                                                                                    position="top center"
                                                                                    on={["hover", "focus"]}
                                                                                >
                                                                                    <div
                                                                                        className={`flex flex-col ${(!ci?.active && "bg-red-200") || (ci?.active && "bg-sky-200")
                                                                                            } px-2.5 py-0.5 font-medium text-sm rounded-sm capitalize`}
                                                                                    >
                                                                                        {ci?.date}
                                                                                    </div>
                                                                                </Popup> */}
                                                                                {ci.active && !ci.outDate ?
                                                                                    <Popup
                                                                                        className="popover-productionPlan"
                                                                                        arrow={true}
                                                                                        arrowStyle={{
                                                                                            color:
                                                                                                (!ci.active &&
                                                                                                    !ci.outDate &&
                                                                                                    "#fecaca") ||
                                                                                                (ci.active &&
                                                                                                    !ci.outDate &&
                                                                                                    "#bae6fd"),
                                                                                        }}
                                                                                        trigger={
                                                                                            <div
                                                                                                className={`${ci.active && !ci.outDate
                                                                                                    ? "bg-[#5599EC] hover:bg-sky-200"
                                                                                                    : ""
                                                                                                    }  h-[20px] w-[80px] relative  transition-all duration-200 ease-in-out `}
                                                                                            >
                                                                                                {/* <div
                                                                                                className={`${!ci.active && !ci.outDate
                                                                                                    ? "bg-[#EE1E1E] hover:bg-red-200"
                                                                                                    : ""
                                                                                                    } 
                                                                                 h-[20px] w-[80px] absolute top-0 left-0 transition-all duration-200 ease-in-out  `}
                                                                                            ></div> */}
                                                                                            </div>
                                                                                        }
                                                                                        position="top center"
                                                                                        on={["hover", "focus"]}
                                                                                    >
                                                                                        <div
                                                                                            className={`flex flex-col ${(!ci.active &&
                                                                                                !ci.outDate &&
                                                                                                "bg-red-200") ||
                                                                                                (ci.active &&
                                                                                                    !ci.outDate &&
                                                                                                    "bg-sky-200")
                                                                                                } px-2.5 py-0.5 font-medium text-sm rounded-sm capitalize`}
                                                                                        >
                                                                                            {ci.date}
                                                                                        </div>
                                                                                    </Popup> : <div className="w-[80px] h-[20px]"></div>
                                                                                }
                                                                            </div>
                                                                        );
                                                                    })}

                                                                </div>
                                                            );
                                                        })}
                                                </div>
                                            </div>
                                        </>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    <div className="w-full border-b flex flex-col">
                        <div className="border-b">
                            <button type="button" onClick={handleToggle} className="flex items-center gap-2 my-2">
                                <Image
                                    alt=""
                                    src={"/productionPlan/Vector.png"}
                                    width={10}
                                    height={10}
                                    className="object-cover"
                                />
                                <h1 className="text-[#52575E] font-normal text-sm"> Thêm sản phẩm</h1>
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className=" flex flex-col justify-center items-center h-[70%] mx-auto">
                    <div className="text-center">
                        <div className="bg-[#EBF4FF] rounded-[100%] inline-block ">
                            <IconSearch />
                        </div>
                        <h1 className="textx-[#141522] text-base opacity-90 font-medium">
                            {dataLang?.purchase_order_table_item_not_found || "purchase_order_table_item_not_found"}
                        </h1>
                        <div className="flex items-center justify-around mt-6 "></div>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};

export default React.memo(BodyGantt);
