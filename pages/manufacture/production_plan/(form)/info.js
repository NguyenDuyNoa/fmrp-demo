import Image from "next/image";
import { useState } from "react";
import dynamic from "next/dynamic";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Datepicker from "react-tailwindcss-datepicker";
import Zoom from "@/components/UI/zoomElement/zoomElement";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
const ScrollArea = dynamic(() => import("react-scrollbar"), { ssr: false });
const InFo = ({ data, handleRemoveBtn }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const handleDateChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    };

    return (
        <>
            <div className="bg-[#ECF0F4] font text-[#141522] font-medium 3xl:text-sm text-xs p-3 rounded">
                Thông tin
            </div>
            <div className="grid grid-cols-12 items-center 3xl:gap-x-6 3xl:gap-y-6 xxl:gap-y-0 xxl:gap-x-6  2xl:gap-y-1 2xl:gap-x-5 xl:gap-y-1 xl:gap-x-5 lg:gap-2 gap-2">
                <div className="flex flex-col col-span-6">
                    <label htmlFor="" className="text-[#344054] font-normal 3xl:text-sm text-xs">
                        Số kế hoạch NVL <span className="text-red-500 3xl:text-sm text-xs">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Tự động"
                        disabled={true}
                        className="border mt-1 border-[#D0D5DD] 3xl:py-[6px] py-2 px-4 rounded-[6px] placeholder:text-[#9295A4] 
                        3xl:placeholder:text-sm  xxl:placeholder:text-xs 2xl:placeholder:text-[11px] xl:placeholder:text-[10px] lg:placeholder:text-[9px] text-sm"
                    />
                </div>
                <div className="col-span-6">
                    <label htmlFor="" className="text-[#344054] font-normal 3xl:text-sm text-xs">
                        Chi nhánh xưởng <span className="text-red-500 3xl:text-sm text-xs">*</span>
                    </label>
                    <SelectComponent
                        classNamePrefix={"productionSmoothing"}
                        placeholder={"Chọn chi nhánh"}
                        className={"w-full"}
                        styles={{
                            placeholder: (base) => ({
                                ...base,
                                color: "#cbd5e1",
                                fontSize: "13px !important",
                                "@media screen and (max-width: 1600px)": {
                                    fontSize: "14px !important",
                                },
                                "@media screen and (max-width: 1400px)": {
                                    fontSize: "12px !important",
                                },
                                "@media screen and (max-width: 1536px)": {
                                    fontSize: "11px !important",
                                },
                                "@media screen and (max-width: 1280px)": {
                                    fontSize: "10px !important",
                                },
                                "@media screen and (max-width: 1024px)": {
                                    fontSize: "9px !important",
                                },
                            }),
                        }}
                    />
                </div>
                <div className="col-span-6">
                    <label htmlFor="start" className="3xl:text-sm text-xs  text-[#344054] font-normal ml-1">
                        Ngày<span className="text-red-500 text-sm">*</span>
                    </label>
                    <div className="w-full relative">
                        <DatePicker
                            id="start"
                            calendarClassName="rasta-stripes"
                            clearButtonClassName="text"
                            // selected={startDate}
                            monthsShown={2}
                            showTimeSelect
                            timeFormat="p"
                            timeIntervals={15}
                            dateFormat="Pp"
                            placeholderText="13/02/2023 12:12:11"
                            className="py-[8px] px-4 3xl:placeholder:text-sm  xxl:placeholder:text-xs 2xl:placeholder:text-[11px] xl:placeholder:text-[10px] lg:placeholder:text-[9px] text-sm placeholder:text-[#6b7280] text-sm w-full outline-none focus:outline-none 
                                    border-[#E1E1E1] focus:border-[#0F4F9E] focus:border-1 border  rounded-[6px] "
                        />
                        <Image
                            alt=""
                            src={"/productionPlan/Union.png"}
                            width={18}
                            height={18}
                            className="absolute top-1/2 right-0 -translate-x-1/2 -translate-y-1/2 opacity-60"
                        />
                    </div>
                </div>
                <div className="col-span-6">
                    <label htmlFor="start" className="3xl:text-sm text-xs  text-[#344054] font-normal ml-1">
                        Tùy chọn
                    </label>
                    <div className="flex items-center gap-8 my-1">
                        <div className="flex items-center cursor-pointer">
                            <input
                                id="default-radio-1"
                                type="radio"
                                value=""
                                name="default-radio"
                                className="w-4 h-4 cursor-pointer text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500  focus:ring-2"
                            />
                            <label
                                for="default-radio-1"
                                className="ml-2 cursor-pointer 3xl:text-sm text-xs font-medium text-[#52575E]"
                            >
                                Đơn hàng
                            </label>
                        </div>
                        <div className="flex items-center cursor-pointer">
                            <input
                                checked
                                id="default-radio-2"
                                type="radio"
                                value=""
                                name="default-radio"
                                className="w-4 h-4 cursor-pointer text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500  focus:ring-2"
                            />
                            <label
                                for="default-radio-2"
                                className="ml-2 cursor-pointer 3xl:text-sm text-xs font-medium text-[#52575E]"
                            >
                                Kế hoạch nội nộ
                            </label>
                        </div>
                    </div>
                </div>
                <div className="col-span-6">
                    <label htmlFor="start" className="3xl:text-sm text-xs  text-[#344054] font-normal ml-1">
                        Chu kỳ kế hoạch<span className="text-red-500 text-sm">*</span>
                    </label>
                    <div className="w-full relative">
                        <DatePicker
                            selected={startDate}
                            onChange={handleDateChange}
                            startDate={startDate}
                            endDate={endDate}
                            selectsRange
                            monthsShown={2}
                            shouldCloseOnSelect={false}
                            dateFormat={"dd/MM/yyyy"}
                            portalId="menu-time"
                            isClearable
                            clearButtonClassName="mr-6 hover:scale-150 transition-all duration-150 ease-linear"
                            placeholderText="Ngày - Ngày"
                            className="py-[8px] px-4 3xl:placeholder:text-sm  xxl:placeholder:text-xs 2xl:placeholder:text-[11px] xl:placeholder:text-[10px] lg:placeholder:text-[9px] text-sm placeholder:text-[#6b7280]  w-full outline-none focus:outline-none 
                            border-[#E1E1E1] focus:border-[#0F4F9E] focus:border-1 border  rounded-[6px] z-[999] "
                        />

                        <Image
                            alt=""
                            src={"/productionPlan/Union.png"}
                            width={18}
                            height={18}
                            className="absolute top-1/2 right-0 -translate-x-1/2 -translate-y-1/2 opacity-60"
                        />
                    </div>
                    {/* <Datepicker
                        value={""}
                        i18n={"vi"}
                        separator={"đến"}
                        primaryColor={"blue"}
                        onChange={""}
                        showShortcuts={true}
                        displayFormat={"DD/MM/YYYY"}
                        placeholder={"13/02/2023 đến 28/10/2023"}
                        toggleIcon={() => {
                            return (
                                <Image
                                    alt=""
                                    src={"/productionPlan/Union.png"}
                                    width={18}
                                    height={18}
                                    className="absolute top-1/2 right-0 -translate-x-1/2 -translate-y-1/2 opacity-60"
                                />
                            );
                        }}
                        configs={{
                            shortcuts: {
                                today: "Hôm nay",
                                yesterday: "Hôm qua",
                                past: (period) => `${period}  ngày qua`,
                                currentMonth: "Tháng này",
                                pastMonth: "Tháng trước",
                            },
                            footer: {
                                cancel: "Từ bỏ",
                                apply: "Áp dụng",
                            },
                        }}
                        inputClassName="rounded-[6px] w-full pl-4 py-1.5 bg-white 2xl:placeholder:text-xs xl:placeholder:text-xs placeholder:text-[8px]
                         border-[#E1E1E1] border  2xl:text-base xl:text-xs text-[10px] outline-none  focus:outline-none focus:ring-0 focus:border-[#0F4F9E]"
                    /> */}
                </div>
                <div className="col-span-6">
                    <label htmlFor="" className="text-[#344054] font-normal 3xl:text-sm text-xs">
                        Chọn đơn hàng bán
                    </label>
                    <SelectComponent
                        classNamePrefix={"productionSmoothing"}
                        placeholder={"Chọn hoặc tìm kiếm đơn hàng"}
                        className={"w-full"}
                        styles={{
                            placeholder: (base) => ({
                                ...base,
                                color: "#cbd5e1",
                                fontSize: "13px !important",
                                "@media screen and (max-width: 1600px)": {
                                    fontSize: "14px !important",
                                },
                                "@media screen and (max-width: 1400px)": {
                                    fontSize: "12px !important",
                                },
                                "@media screen and (max-width: 1536px)": {
                                    fontSize: "11px !important",
                                },
                                "@media screen and (max-width: 1280px)": {
                                    fontSize: "10px !important",
                                },
                                "@media screen and (max-width: 1024px)": {
                                    fontSize: "9px !important",
                                },
                            }),
                        }}
                    />
                </div>
                <div className="col-span-6 flex flex-col gap-y-4">
                    <div className="flex items-center gap-4">
                        <input type="checkbox" className="h-4 w-4"></input>
                        <label className="text-[#344054] font-medium 3xl:text-base text-sm">Tự động tạo LSX tổng</label>
                    </div>
                    <div className="text-red-500 font-normal 3xl:text-base text-sm">
                        Ghi chú: chỉ lấy những phiếu đã duyệt
                    </div>
                </div>
                <div className="col-span-6 ">
                    <ScrollArea
                        className="3xl:h-[10.5vh] xxl:h-[8vh] 2xl:h-[12vh] xl:h-[10vh] lg:h-[9vh] h-[10vh] overflow-y-auto overflow-hidden  scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 "
                        speed={1}
                        smoothScrolling={true}
                    >
                        <div className="flex items-start justify-start gap-x-4 gap-y-2 flex-wrap">
                            {data?.map((e) => (
                                <Zoom className="w-fit h-full">
                                    <button
                                        key={e.id}
                                        onClick={() => handleRemoveBtn(e.id)}
                                        type="button"
                                        className="bg-[#F3F4F6] h-full rounded-lg outline-none focus:outline-none 3xl:py-2 xxl:py-2 2xl:py-2 xl:py-1 lg:py-1 py-3  px-4 "
                                    >
                                        <div className="flex items-center gap-[10px]">
                                            <span className="text-[#141522] font-normal 3xl:text-base text-sm">
                                                {e.nameOrder}
                                            </span>
                                            <Image
                                                alt=""
                                                src={"/productionPlan/x.png"}
                                                width={16}
                                                height={16}
                                                className="object-cover"
                                            />
                                        </div>
                                    </button>
                                </Zoom>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </>
    );
};
export default InFo;
