import SelectComponent from "components/UI/filterComponents/selectComponent";
import { ArrowDown2 } from "iconsax-react";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { v4 as uuid } from "uuid";
import vi from "date-fns/locale/vi"; // Import ngôn ngữ tiếng Việt
const FilterHeader = () => {
    const renderMonthContent = (month, shortMonth, longMonth) => {
        const tooltipText = `Tooltip for month: ${longMonth}`;
        return <span title={tooltipText}>{shortMonth}</span>;
    };
    return (
        <>
            <div className="grid grid-cols-10 items-center gap-10 ">
                <div className="col-span-2">
                    <h3 className="text-sm text-[#051B44] font-medium ml-1">Công đoạn</h3>
                    <SelectComponent classNamePrefix={"productionSmoothing"} placeholder={"Công đoạn"} />
                </div>
                <div className="col-span-2">
                    <div className="">
                        <label htmlFor="start" className="text-sm text-[#051B44] font-medium ml-1">
                            Ngày bắt đầu
                        </label>
                        <div className="w-full relative">
                            <DatePicker
                                id="start"
                                portalId="menu-time"
                                calendarClassName="rasta-stripes"
                                clearButtonClassName="text"
                                // selected={startDate}
                                // onChange={(date) => setStartDate(date)}
                                isClearable
                                placeholderText="Ngày bắt đầu"
                                className="p-2 placeholder:text-[12px] placeholder:text-[#6b7280] text-[14px] w-full outline-none focus:outline-none border-[#d8dae5] focus:border-[#0F4F9E] focus:border-2 border  rounded-md"
                            />
                            <ArrowDown2
                                size="11"
                                color="#6b7280"
                                className="absolute top-1/2 right-0 -translate-x-1/2 -translate-y-1/2"
                            />
                        </div>
                    </div>
                </div>
                <div className="col-span-2">
                    <div className="">
                        <label htmlFor="start" className="text-sm text-[#051B44] font-medium ml-1">
                            Ngày kết thúc
                        </label>
                        <div className="w-full relative">
                            <DatePicker
                                id="start"
                                portalId="menu-time"
                                calendarClassName="rasta-stripes"
                                clearButtonClassName="text"
                                // selected={startDate}
                                // onChange={(date) => setStartDate(date)}
                                isClearable
                                placeholderText="Ngày kết thúc"
                                className="p-2 placeholder:text-[12px] placeholder:text-[#6b7280] text-[14px] w-full outline-none focus:outline-none border-[#d8dae5] focus:border-[#0F4F9E] focus:border-2 border  rounded-md"
                            />
                            <ArrowDown2
                                size="11"
                                color="#6b7280"
                                className="absolute top-1/2 right-0 -translate-x-1/2 -translate-y-1/2"
                            />
                        </div>
                    </div>
                </div>
                <div className="col-span-2">
                    <h3 className="text-sm text-[#051B44] font-medium ml-1">Nhân viên</h3>
                    <SelectComponent classNamePrefix={"productionSmoothing"} placeholder={"Nhân viên"} />
                </div>
                <div className="col-span-2">
                    <div className="">
                        <label htmlFor="start" className="text-sm text-[#051B44] font-medium ml-1">
                            Loại thống kê
                        </label>
                        <div className="w-full relative">
                            <DatePicker
                                // selected={new Date()}
                                renderMonthContent={renderMonthContent}
                                showFourColumnMonthYearPicker
                                showMonthYearPicker
                                locale={vi}
                                showFullMonthYearPicker
                                dateFormat="MM/yyyy"
                                monthPlaceholder="Tháng"
                                placeholderText="Theo tháng"
                                className="p-2 placeholder:text-[12px] focus:border-[#0F4F9E] focus:border-2 placeholder:text-[#6b7280] text-[14px] w-full outline-none focus:outline-none border-[#d8dae5] border  rounded-md"
                            />
                            <ArrowDown2
                                size="11"
                                color="#6b7280"
                                className="absolute top-1/2 right-0 -translate-x-1/2 -translate-y-1/2"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default FilterHeader;
