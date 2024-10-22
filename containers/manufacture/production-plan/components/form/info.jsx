import { Customscrollbar } from "@/components/UI/common/Customscrollbar";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import Zoom from "@/components/UI/zoomElement/zoomElement";
import useToast from "@/hooks/useToast";
import Image from "next/image";
import React from "react";
import DatePicker from "react-datepicker";

const InFo = ({ dataLang, data, listBranch, handleRemoveBtn, isValue, onChangeValue, tab }) => {
    const showToat = useToast();

    const isBreakpoint = {
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
    };

    const newArray = data.dataProduction.reduce((acc, current) => {
        const existingItem = acc.find((item) => item.idParent == current.idParent);

        if (!existingItem) {
            acc.push(current);
        }

        return acc;
    }, []);

    return (
        <>
            <div className="bg-[#ECF0F4] font text-[#141522] font-medium 3xl:text-sm text-xs p-3 rounded">
                {dataLang?.production_plan_form_materials_info || "production_plan_form_materials_info"}
            </div>
            <div className="grid grid-cols-12 gap-4">
                <div className="flex flex-col col-span-6 gap-2">
                    <div className="flex flex-col">
                        <label htmlFor="" className="text-[#344054] font-normal 3xl:text-sm text-xs">
                            {dataLang?.production_plan_form_materials_plan_number || 'production_plan_form_materials_plan_number'} <span className="text-xs text-red-500 3xl:text-sm">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Tự động"
                            disabled={true}
                            className="border mt-1 border-[#D0D5DD] 3xl:py-[6px] py-2 px-4 rounded-[6px] placeholder:text-[#9295A4] 
                            3xl:placeholder:text-sm  xxl:placeholder:text-xs 2xl:placeholder:text-[11px] xl:placeholder:text-[10px] lg:placeholder:text-[9px] text-sm"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="start" className="3xl:text-sm text-xs  text-[#344054] font-normal ml-1">
                            {dataLang?.production_plan_form_materials_date || 'production_plan_form_materials_date'}<span className="text-sm text-red-500">*</span>
                        </label>
                        <div className="relative w-full">
                            <DatePicker
                                id="start"
                                dateFormat={"dd/MM/yyyy h:mm aa"}
                                calendarClassName="rasta-stripes"
                                selected={isValue.date}
                                onChange={onChangeValue("date")}
                                monthsShown={2}
                                showTimeSelect
                                timeFormat="p"
                                timeIntervals={15}
                                isClearable
                                clearButtonClassName="mr-6 hover:scale-150 transition-all duration-150 ease-linear"
                                placeholderText={dataLang?.production_plan_form_materials_select_date || 'production_plan_form_materials_select_date'}
                                className={`py-[8px] px-4 3xl:placeholder:text-sm  xxl:placeholder:text-xs 2xl:placeholder:text-[11px] xl:placeholder:text-[10px] lg:placeholder:text-[9px] text-sm placeholder:text-[#6b7280] text-sm w-full outline-none focus:outline-none 
                                ${isValue.date == null ? "border-red-500" : "border-[#E1E1E1]"
                                    } focus:border-[#0F4F9E] focus:border-1 border  rounded-[6px] `}
                            />
                            <Image
                                alt=""
                                src={"/productionPlan/Union.png"}
                                width={18}
                                height={18}
                                className="absolute right-0 -translate-x-1/2 -translate-y-1/2 top-1/2 opacity-60"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="start" className="3xl:text-sm text-xs  text-[#344054] font-normal ml-1">
                            {dataLang?.production_plan_form_materials_timeline || 'production_plan_form_materials_timeline'}<span className="text-sm text-red-500">*</span>
                        </label>
                        <div className="relative w-full">
                            <DatePicker
                                selected={isValue.dateRange.startDate}
                                onChange={(dates) => {
                                    const [start, end] = dates;
                                    onChangeValue("dateRange")({ startDate: start, endDate: end });
                                }}
                                startDate={isValue.dateRange.startDate}
                                endDate={isValue.dateRange.endDate}
                                selectsRange
                                monthsShown={2}
                                shouldCloseOnSelect={false}
                                dateFormat={"dd/MM/yyyy"}
                                portalId="menu-time"
                                isClearable
                                clearButtonClassName="mr-6 hover:scale-150 transition-all duration-150 ease-linear"
                                placeholderText={dataLang?.production_plan_form_materials_date_to_date || 'production_plan_form_materials_date_to_date'}
                                className={`${isValue.dateRange.startDate == null && isValue.dateRange.endDate == null
                                    ? "border-red-500"
                                    : "border-[#E1E1E1]"
                                    } py-[8px] px-4 3xl:placeholder:text-sm  xxl:placeholder:text-xs 2xl:placeholder:text-[11px] xl:placeholder:text-[10px] lg:placeholder:text-[9px] text-sm placeholder:text-[#6b7280]  w-full outline-none focus:outline-none 
                                 focus:border-[#0F4F9E] focus:border-1 border  rounded-[6px] z-[999] `}
                            />

                            <Image
                                alt=""
                                src={"/productionPlan/Union.png"}
                                width={18}
                                height={18}
                                className="absolute right-0 -translate-x-1/2 -translate-y-1/2 top-1/2 opacity-60"
                            />
                        </div>
                    </div>
                    {/* <div className="flex items-center gap-2">
                        <input
                            id="auto"
                            type="checkbox"
                            checked={isValue.auto}
                            onChange={(event) => onChangeValue("auto")(event.target.checked)}
                            className="w-4 h-4"
                        ></input>
                        <label
                            htmlFor="auto"
                            className="text-[#344054] font-medium 3xl:text-base text-sm cursor-pointer"
                        >
                            Tự động tạo LSX tổng
                        </label>
                    </div>
                    <div className="text-sm font-normal text-red-500 3xl:text-base">
                        Ghi chú: chỉ lấy những phiếu đã duyệt
                    </div> */}
                </div>
                <div className="flex flex-col col-span-6 gap-2">
                    <div>
                        <label htmlFor="" className="text-[#344054] font-normal 3xl:text-sm text-xs">
                            {dataLang?.production_plan_form_materials_factory_branch || 'production_plan_form_materials_factory_branch'} <span className="text-xs text-red-500 3xl:text-sm">*</span>
                        </label>
                        <SelectComponent
                            classNamePrefix={"productionSmoothing"}
                            placeholder={dataLang?.production_plan_form_materials_select_branch || 'production_plan_form_materials_select_branch'}
                            isClearable={true}
                            value={isValue.idBrach}
                            onChange={onChangeValue("idBrach")}
                            options={listBranch}
                            className={`${isValue.idBrach == null && "border-red-500 border rounded-md"} w-full z-[999] cursor-pointer`}
                            styles={isBreakpoint}
                        />
                    </div>
                    <div>
                        <label htmlFor="start" className="3xl:text-sm text-xs  text-[#344054] font-normal ml-1">
                            {dataLang?.production_plan_form_materials_options || 'production_plan_form_materials_options'}
                        </label>
                        <div className="flex items-center gap-8 my-1">
                            <div className="flex items-center cursor-pointer">
                                <input
                                    id="default-radio-1"
                                    type="radio"
                                    value=""
                                    checked={isValue.order}
                                    onChange={() => {
                                        if (tab == "order") {
                                            onChangeValue("order")(!isValue.order);
                                            onChangeValue("internalPlan")(false);
                                        } else {
                                            showToat("error", dataLang?.production_plan_form_materials_cannot_convert || 'production_plan_form_materials_cannot_convert');
                                        }
                                    }}
                                    name="default-radio1"
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 cursor-pointer focus:ring-blue-500 focus:ring-2"
                                />
                                <label
                                    htmlFor="default-radio-1"
                                    className="ml-2 cursor-pointer 3xl:text-sm text-xs font-medium text-[#52575E]"
                                >
                                    {dataLang?.production_plan_gantt_table_order || 'production_plan_gantt_table_order'}
                                </label>
                            </div>
                            <div className="flex items-center cursor-pointer">
                                <input
                                    id="default-radio-2"
                                    type="radio"
                                    value=""
                                    checked={isValue.internalPlan}
                                    onChange={() => {
                                        if (tab == "plan") {
                                            onChangeValue("internalPlan")(!isValue.internalPlan);
                                            onChangeValue("order")(false);
                                        } else {
                                            showToat("error", dataLang?.production_plan_form_materials_cannot_convert_order || 'production_plan_form_materials_cannot_convert_order');
                                        }
                                    }}
                                    name="default-radio2"
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 cursor-pointer focus:ring-blue-500 focus:ring-2"
                                />
                                <label
                                    htmlFor="default-radio-2"
                                    className="ml-2 cursor-pointer 3xl:text-sm text-xs font-medium text-[#52575E]"
                                >
                                    {dataLang?.production_plan_gantt_internal || 'production_plan_gantt_internal'}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label
                            className={`${tab == "order" ? "bg-sky-200 text-sky-600" : "bg-green-200 text-green-600"
                                } 3xl:text-sm text-xs font-normal ml-1 py-0.5 px-1 rounded-md`}
                        >
                            {tab == "order" ? (dataLang?.production_plan_gantt_order || 'production_plan_gantt_order') : (dataLang?.production_plan_gantt_internal || "production_plan_gantt_internal")}
                        </label>
                        <div className="text-[#344054] font-normal 3xl:text-sm text-xs mt-0.5">
                            <Customscrollbar
                                className="3xl:max-h-[10.5vh] xxl:max-h-[8vh] 2xl:max-h-[12vh] xl:max-h-[10vh] lg:max-h-[9vh] max-h-[10vh] overflow-y-auto overflow-hidden"
                            >
                                <div className="flex flex-wrap items-center justify-start gap-x-4 gap-y-2">
                                    {newArray?.map((e) => (
                                        <Zoom key={e.idParent} className="h-full w-fit">
                                            <button
                                                onClick={() => {
                                                    handleRemoveBtn(e.idParent);
                                                }}
                                                type="button"
                                                className="bg-[#F3F4F6] h-full rounded-lg outline-none focus:outline-none 3xl:py-[7px] xxl:py-2 2xl:py-2 xl:py-1 lg:py-1 py-3  px-4 "
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
                                    {newArray?.length > 1 && (
                                        <Zoom className="w-fit h-full bg-red-200 p-1.5 rounded">
                                            <Image
                                                onClick={() => handleRemoveBtn("deleteAll")}
                                                src={"/productionPlan/trash-2.png"}
                                                width={24}
                                                height={24}
                                                alt=""
                                                className="object-cover rounded-md cursor-pointer"
                                            />
                                        </Zoom>
                                    )}
                                </div>
                            </Customscrollbar>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default React.memo(InFo);
