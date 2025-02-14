import Image from "next/image";
import Popup from "reactjs-popup";
import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import ModalImage from "react-modal-image";
import { SearchNormal1 as IconSearch } from "iconsax-react";
import Loading from "@/components/UI/loading/loading";
import Zoom from "@/components/UI/zoomElement/zoomElement";
import useToast from "@/hooks/useToast";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import useSetingServer from "@/hooks/useConfigNumber";
import NoData from "@/components/UI/noData/nodata";
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

    const monthRefs = useRef({});

    const container1Ref = useRef();

    const container2Ref = useRef();

    const container3Ref = useRef();

    const checkRankRef = useRef(null);

    const divRefs = useRef([]);

    const dataSeting = useSetingServer()

    const [heights, setHeights] = useState([]);

    const [checkCkecked, sCheckCkecked] = useState(false);

    const formatNumber = (num) => formatNumberConfig(+num, dataSeting);

    const [currentMonth, setCurrentMonth] = useState('');

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

    useEffect(() => {
        const newHeights = divRefs.current.map(ref => ref?.offsetHeight);
        setHeights(newHeights);
    }, [data]);

    useEffect(() => {
        sCheckCkecked(false);
    }, [router]);

    // Hàm lấy phần tử có ngày lớn nhất với điều kiện active: true
    // const getLatestActiveProcess = (data) => {
    //     let latestProcess = null;

    //     for (let i = 0; i < data.length; i++) {
    //         const item = data[i];
    //         for (let j = 0; j < item.listProducts.length; j++) {
    //             const product = item.listProducts[j];
    //             for (let k = 0; k < product.processArr.length; k++) {
    //                 const process = product.processArr[k];

    //                 if (process.active && item?.show) { // Chỉ xét phần tử có active = true và mở
    //                     const processDate = new Date(process.date.split('/').reverse().join('-')); // Chuyển "dd/MM/yyyy" thành "yyyy-MM-dd"

    //                     if (!latestProcess || processDate > new Date(latestProcess.date.split('/').reverse().join('-'))) {
    //                         latestProcess = process; // Cập nhật phần tử có ngày lớn nhất
    //                     }
    //                 }
    //             }
    //         }
    //     }

    //     return latestProcess;
    // };


    const latestActiveProcess = {}

    // useLayoutEffect(() => {
    //     if (checkRankRef.current && container1Ref.current) {
    //         const target = checkRankRef.current;

    //         const viewport = document.querySelector('.container1')

    //         if (viewport) {
    //             const targetRect = target.getBoundingClientRect()
    //             const viewportRect = viewport.getBoundingClientRect()

    //             const targetScrollLeft = targetRect.left - viewportRect.left + viewport.scrollLeft

    //             const startScrollLeft = viewport.scrollLeft


    //             let startTime = null;

    //             const duration = 8000; // Thời gian cuộn (ms)

    //             const step = (timestamp) => {
    //                 if (!startTime) startTime = timestamp;

    //                 const progress = Math.min((timestamp - startTime) / duration, 1); // Tiến độ từ 0 đến 1
    //                 const ease = progress * (2 - progress); // Tăng tốc rồi giảm tốc (easing)

    //                 viewport.scrollLeft = startScrollLeft + (targetScrollLeft - startScrollLeft) * ease;
    //                 if (progress < 1) {
    //                     requestAnimationFrame(step); // Tiếp tục cuộn nếu chưa hoàn thành
    //                 }
    //             };

    //             requestAnimationFrame(step);
    //         }
    //     }
    // }, [data]);

    // useLayoutEffect(() => {
    //     if (checkRankRef.current && container1Ref.current) {
    //         const target = checkRankRef.current;
    //         const viewport = document.querySelector('.container1');

    //         if (viewport) {
    //             const targetRect = target.getBoundingClientRect();
    //             const viewportRect = viewport.getBoundingClientRect();

    //             // Thiết lập vị trí scroll ngay lập tức mà không cần animation
    //             viewport.scrollLeft = targetRect.left - viewportRect.left + viewport.scrollLeft;
    //         }
    //     }
    // }, [data]);


    const [isFirstRender, setIsFirstRender] = useState(true);

    // Chạy khi component mount lần đầu để thiết lập vị trí scroll ngay lập tức
    // useEffect(() => {
    //     if (checkRankRef.current && container1Ref.current) {
    //         const target = checkRankRef.current;
    //         const viewport = document.querySelector('.container1');

    //         if (viewport) {
    //             const targetRect = target.getBoundingClientRect();
    //             const viewportRect = viewport.getBoundingClientRect();

    //             // Thiết lập vị trí scroll ngay lập tức
    //             viewport.scrollLeft = targetRect.left - viewportRect.left + viewport.scrollLeft;
    //         }
    //     }
    // }, []); // Chạy một lần duy nhất khi component mount

    // Chạy animation khi `data` thay đổi, nhưng bỏ qua lần render đầu tiên
    // useLayoutEffect(() => {
    //     if (isFirstRender) {
    //         setIsFirstRender(false); // Đánh dấu rằng lần đầu đã chạy
    //         return; // Không chạy animation lần đầu
    //     }

    //     if (checkRankRef.current && container1Ref.current) {
    //         const target = checkRankRef.current;
    //         const viewport = document.querySelector('.container1');

    //         if (viewport) {
    //             const targetRect = target.getBoundingClientRect();
    //             const viewportRect = viewport.getBoundingClientRect();
    //             const targetScrollLeft = targetRect.left - viewportRect.left + viewport.scrollLeft;

    //             const startScrollLeft = viewport.scrollLeft;
    //             let startTime = null;
    //             const duration = 500; // Thời gian chạy animation (ms)

    //             const step = (timestamp) => {
    //                 if (!startTime) startTime = timestamp;

    //                 const progress = Math.min((timestamp - startTime) / duration, 1); // Tiến trình từ 0 -> 1
    //                 const ease = progress * (2 - progress); // Hiệu ứng easing

    //                 viewport.scrollLeft = startScrollLeft + (targetScrollLeft - startScrollLeft) * ease;

    //                 if (progress < 1) {
    //                     requestAnimationFrame(step);
    //                 }
    //             };

    //             requestAnimationFrame(step);
    //         }
    //     }
    // }, [data]); // Chạy lại khi `data` thay đổi




    // useLayoutEffect(() => {
    //     if (checkRankRef.current && container1Ref.current) {
    //         const target = checkRankRef.current;
    //         const viewport = document.querySelector('.container1');

    //         if (viewport) {
    //             const targetRect = target.getBoundingClientRect();
    //             const viewportRect = viewport.getBoundingClientRect();
    //             const targetScrollLeft = targetRect.left - viewportRect.left + viewport.scrollLeft;

    //             const startScrollLeft = viewport.scrollLeft;
    //             let startTime = null;
    //             const duration = 200; // Thời gian chạy animation (ms)

    //             const step = (timestamp) => {
    //                 if (!startTime) startTime = timestamp;

    //                 const progress = Math.min((timestamp - startTime) / duration, 1); // Tiến trình từ 0 -> 1
    //                 const ease = progress * (2 - progress); // Hiệu ứng easing

    //                 viewport.scrollLeft = startScrollLeft + (targetScrollLeft - startScrollLeft) * ease;

    //                 if (progress < 1) {
    //                     requestAnimationFrame(step);
    //                 }
    //             };

    //             requestAnimationFrame(step);
    //         }
    //     }
    // }, [data]); // Chạy lại khi `data` thay đổi




    const datsa = [
        {
            listProducts: [
                {
                    processArr: [
                        { active: false, date: "08/03/2024", day: "T6 03", id: "1", outDate: false },
                        { active: true, date: "09/03/2024", day: "T7 03", id: "2", outDate: false }
                    ]
                }
            ]
        },
        {
            listProducts: [
                {
                    processArr: [
                        { active: true, date: "10/03/2024", day: "CN 03", id: "3", outDate: false },
                        { active: true, date: "11/03/2024", day: "T2 03", id: "5", outDate: false }
                    ]
                }
            ]
        }
    ];


    // useEffect(() => {
    //     if (container1Ref.current && timeLine?.length > 0) {
    //         // Lấy tháng và năm hiện tại
    //         const currentDate = new Date();
    //         const currentMonth = currentDate.getMonth() + 1;
    //         const currentYear = currentDate.getFullYear();

    //         // Tìm đối tượng trong data khớp với tháng và năm hiện tại
    //         const currentMonthData = timeLine?.find(item => {
    //             const itemMonth = parseInt(item.month, 10);
    //             const itemYear = parseInt(item?.title.split(' ')[2], 10); // Lấy năm từ "Tháng 03 2024"
    //             return itemMonth === currentMonth && itemYear === currentYear;
    //         });

    //         if (currentMonthData) {
    //             const monthKey = currentMonthData.month.padStart(2, '0');
    //             const targetElement = monthRefs.current[monthKey];
    //             const viewport = document.querySelector('.container1');

    //             if (targetElement && container1Ref.current) {
    //                 const targetPosition = targetElement.offsetLeft - container1Ref.current.offsetLeft;
    //                 viewport.scrollLeft = targetPosition;
    //             }
    //         }
    //     }
    // }, [data, timeLine]);

    const hasScrolled = useRef(false);

    useEffect(() => {
        if (!hasScrolled.current && container1Ref.current && timeLine?.length > 0 && data?.length > 0) {
            // Đánh dấu là đã chạy
            hasScrolled.current = true;

            // Lấy tháng và năm hiện tại
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth() + 1;
            const currentYear = currentDate.getFullYear();

            // Tìm tháng hiện tại trong năm hiện tại
            let targetMonthData = timeLine.find(item => {
                const itemMonth = parseInt(item.month, 10);
                const itemYear = parseInt(item.title.split(' ')[2], 10);
                return itemMonth === currentMonth && itemYear === currentYear;
            });

            // Nếu không tìm thấy, tìm tháng hiện tại trong năm trước
            if (!targetMonthData) {
                targetMonthData = timeLine.find(item => {
                    const itemMonth = parseInt(item.month, 10);
                    const itemYear = parseInt(item.title.split(' ')[2], 10);
                    return itemMonth === currentMonth && itemYear === currentYear - 1;
                });
            }

            // Nếu tìm thấy dữ liệu, cuộn tới tháng tương ứng
            if (targetMonthData) {
                const monthKey = targetMonthData.month.padStart(2, '0');
                const targetElement = monthRefs.current[monthKey];
                const viewport = document.querySelector('.container1');

                if (targetElement && container1Ref.current) {
                    const targetPosition = targetElement.offsetLeft - container1Ref.current.offsetLeft;
                    viewport.scrollLeft = targetPosition;
                }
            }
        }
    }, [timeLine, data]);


    return (
        <React.Fragment>
            {data?.length > 0 ? (
                <div className="flex flex-col ">
                    <div className="flex items-end overflow-hidden border-t border-b">
                        <div className={`min-w-[35%]  w-[35%]`}>
                            <div className="flex items-center gap-2 pb-1 pl-2">
                                {[
                                    { name: dataLang?.production_plan_gantt_order || 'production_plan_gantt_order', tab: "order" },
                                    { name: dataLang?.production_plan_gantt_internal || 'production_plan_gantt_internal', tab: "plan" },
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
                            <div className="grid grid-cols-12 gap-2">
                                <div className="flex items-center col-span-1 gap-1">
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
                                            <div className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="w-3 h-3"
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
                                    <div onClick={() => handleSort()} className="flex flex-col gap-1 cursor-pointer ">
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
                                <div className="grid w-full grid-cols-11 col-span-11">
                                    <div className="text-[#52575E] font-normal 3xl:text-sm  xxl:text-[11px] 2xl:text-[12px] xl:text-[11px] lg:text-[10px] text-[13px] col-span-3">
                                        {dataLang?.production_plan_gantt_table_order || 'production_plan_gantt_table_order'}
                                    </div>
                                    <div className="text-[#52575E] font-normal 3xl:text-sm  xxl:text-[11px] 2xl:text-[12px] xl:text-[11px] lg:text-[10px] text-[13px] col-span-2">
                                        {dataLang?.production_plan_gantt_table_status || 'production_plan_gantt_table_status'}
                                    </div>
                                    <div className="text-[#52575E] text-center font-normal 3xl:text-sm  xxl:text-[11px] 2xl:text-[12px] xl:text-[11px] lg:text-[10px] text-[13px] col-span-2">
                                        {dataLang?.production_plan_gantt_table_quantity || 'production_plan_gantt_table_quantity'}
                                    </div>
                                    <div className="text-[#52575E] text-center font-normal 3xl:text-sm  xxl:text-[11px] 2xl:text-[12px] xl:text-[11px] lg:text-[10px] text-[13px] col-span-2">
                                        {dataLang?.production_plan_gantt_table_quantity_plan || 'production_plan_gantt_table_quantity_plan'}
                                    </div>
                                    <div className="text-[#52575E] text-center font-normal 3xl:text-sm  xxl:text-[11px] 2xl:text-[12px] xl:text-[11px] lg:text-[10px] text-[13px] col-span-2">
                                        {dataLang?.production_plan_gantt_table_quantity_remaining || 'production_plan_gantt_table_quantity_remaining'}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={` flex  gap-4 divide-x border-l overflow-hidden`} ref={container2Ref}>
                            {timeLine.map((e, index) => (
                                <div
                                    key={e.id}
                                    className="relative"
                                    ref={(el) => (monthRefs.current[e.month] = el)}
                                >
                                    <div className="text-[#202236] font-semibold text-sm px-1 py-1 sticky top-0 z-10 ">
                                        {e.title}
                                    </div>

                                    <div className="flex items-end gap-2 divide-x">
                                        {
                                            e.days.map((i, iIndex) => {
                                                const day = i?.date.split("/")
                                                const date = i.day.split(" ");
                                                return (
                                                    <div key={i.id} className="flex items-center gap-2 w-[70.5px]">
                                                        <h1 className="text-[#667085] font-light 3xl:text-base text-sm  3xl:px-1.5 px-3">
                                                            {date[0]}
                                                        </h1>
                                                        {
                                                            iIndex == e.days?.length - 1
                                                                ? (
                                                                    <h1
                                                                        className={`bg-[#5599EC] my-0.5  px-1.5 py-0.5 rounded-full text-white font-semibold 3xl:text-base text-sm`}
                                                                    >
                                                                        {Number(day[0])}
                                                                    </h1>
                                                                ) : (
                                                                    <h1
                                                                        className={`text-[#667085] rounded-full py-0.5 font-semibold 3xl:text-base text-sm `}
                                                                    >
                                                                        {Number(day[0])}
                                                                    </h1>
                                                                )
                                                        }
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {isFetching ? (
                        <Loading className="3xl:h-[61vh] xxl:h-[51vh] 2xl:h-[52.5vh] xl:h-[48vh] lg:h-[46vh] h-[55vh]" />
                    ) : (
                        <div className="flex divide-x">
                            <div
                                ref={container3Ref}
                                onScroll={handleScrollContainer2}
                                className="flex-col min-w-[35%] w-[35%]  overflow-y-auto scrollbar-thin  scrollbar-thumb-transparent scrollbar-track-transparent
                                3xl:h-[61vh] xxl:h-[51vh] 2xl:h-[52.5vh] xl:h-[48vh] lg:h-[46vh] h-[55vh]"
                            >
                                {data?.map((e, eIndex) => {
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
                                                            <div className="grid items-center w-full grid-cols-11 col-span-11 gap-2">
                                                                <h2
                                                                    className={`text-[#52575E] ${(outDate && "group-hover:text-[#EE1E1E]") ||
                                                                        (processing && "group-hover:text-[#3276FA]") ||
                                                                        (sussces && "group-hover:text-[#0BAA2E]") ||
                                                                        (unfulfilled && "group-hover:text-[#FF8F0D]")
                                                                        } 3xl:text-sm  transition-all ease-in-out xxl:text-[11px] 2xl:text-[12px] xl:text-[11px] lg:text-[10px] text-[13px] font-semibold col-span-3`}
                                                                >
                                                                    {e.nameOrder}
                                                                </h2>
                                                                <div className="flex items-center col-span-2 gap-1">
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
                                                            <label ref={el => divRefs.current[eIndex + iIndex] = el} key={i.id} htmlFor={i.id} className={`cursor-pointer grid grid-cols-12 gap-2 items-center my-2 h-full`}
                                                            // <label ref={heightItems} key={i.id} htmlFor={i.id} className={`cursor-pointer grid grid-cols-12 gap-2 items-center my-2 h-[50px]`}
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
                                                                <div className="flex items-center col-span-3 gap-1 3xl:gap-2">
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
                                                                            small="/nodata.png"
                                                                            large="/nodata.png"
                                                                            className="object-cover rounded-md min-w-[36px] min-h-[36px] w-[36px] h-[36px] max-w-[36px] max-h-[36px]"
                                                                        ></ModalImage>
                                                                    )}
                                                                    <div className="flex flex-col ">
                                                                        <h1 className="text-[#000000] font-semibold 3xl:text-xs  xxl:text-[11px] 2xl:text-[10px] xl:text-[9px] lg:text-[9px] text-[11px] ">
                                                                            {i.name}
                                                                        </h1>
                                                                        <h1 className="text-[#9295A4] font-normal 3xl:text-[10px] xxl:text-[8px] 2xl:text-[9px] xl:text-[8px] lg:text-[7px]">
                                                                            {/* {i.productVariation} */}
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
                                                                    {i.status == "outDate" && dataLang?.production_plan_gantt_table_status_over}
                                                                    {i.status == "sussces" && dataLang?.production_plan_gantt_table_status_complete}
                                                                    {i.status == "unfulfilled" && dataLang?.production_plan_gantt_table_status_not_done}
                                                                </h3>
                                                                <h3 className="text-[#52575E] pl-4 text-center font-normal 3xl:text-sm  xxl:text-[11px] 2xl:text-[12px] xl:text-[11px] lg:text-[10px] text-[13px] col-span-2">
                                                                    {i.quantity > 0 ? formatNumber(i.quantity) : "-"}
                                                                </h3>
                                                                <h3 className="text-blue-600 pl-4 text-center font-normal 3xl:text-sm  xxl:text-[11px] 2xl:text-[12px] xl:text-[11px] lg:text-[10px] text-[13px] col-span-2">
                                                                    {i.quantityPlan > 0 ? formatNumber(i.quantityPlan) : "-"}
                                                                </h3>
                                                                <h3 className="text-[#FF8F0D] text-center  font-medium 3xl:text-sm  xxl:text-[11px] 2xl:text-[12px] xl:text-[11px] lg:text-[10px] text-[13px] col-span-2 ">
                                                                    {i.quantityRemaining > 0 ? formatNumber(i.quantityRemaining) : "-"}
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
                                id="container1"
                                className="container1 flex-col w-full overflow-x-auto  overflow-y-auto scrollbar-thin   scrollbar-thumb-slate-300 scrollbar-track-slate-100
                             3xl:h-[61vh] xxl:h-[51vh] 2xl:h-[52.5vh] xl:h-[48vh] lg:h-[46vh] h-[55vh]"
                            >
                                {data?.map((e, eIndex) => {
                                    return (
                                        <div key={e.id} className={``}>
                                            <div className={`${!e.show ? "my-1" : "mt-1"}`}>
                                                <div className={`${e.listProducts[eIndex]?.name.split(" ")?.length > 3 ? "py-3" : "py-2"}  h-[37px]`}>

                                                </div>

                                                {e.show &&
                                                    e.listProducts.map((i, iIndex) => {
                                                        return (
                                                            <div
                                                                key={i.id}
                                                                style={{ height: heights[eIndex + iIndex] }}
                                                                className={`flex items-center  w-[65%] my-2`}
                                                                id={`div-${i.id}`}

                                                            >
                                                                {i.processArr.map((ci, ciIndex) => {
                                                                    const isActive = ci?.id == latestActiveProcess?.id;
                                                                    return (
                                                                        <div
                                                                            ref={isActive ? checkRankRef : null}
                                                                            key={ci?.id} className={`w-[80px]`}
                                                                        >

                                                                            {ci.active && !ci.outDate ?
                                                                                <Popup
                                                                                    className="popover-productionPlan"
                                                                                    arrow={true}
                                                                                    arrowStyle={{
                                                                                        color:
                                                                                            (!ci.active && !ci.outDate && "#fecaca") ||
                                                                                            (ci.active && !ci.outDate && "#bae6fd"),
                                                                                        transform: "translateY(130%)",
                                                                                    }}
                                                                                    trigger={
                                                                                        <div
                                                                                            className={`${ci.active && !ci.outDate ? "bg-[#5599EC] hover:bg-sky-200" : ""
                                                                                                }  h-[20px] w-[80px] relative  transition-all duration-200 ease-in-out`}
                                                                                        >

                                                                                        </div>
                                                                                    }
                                                                                    position="top center"
                                                                                    on={["hover", "focus"]}

                                                                                >
                                                                                    <div
                                                                                        className={`flex flex-col ${(!ci.active && !ci.outDate && "bg-red-200") ||
                                                                                            (ci.active && !ci.outDate && "bg-sky-200")
                                                                                            } px-2.5 py-0.5 font-medium text-sm rounded-sm capitalize -translate-y-[40%]`}
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
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            ) :
                <NoData />
            }
        </React.Fragment >
    );
};

export default React.memo(BodyGantt);
