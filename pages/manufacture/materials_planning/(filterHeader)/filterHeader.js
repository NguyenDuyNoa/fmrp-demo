import dynamic from "next/dynamic";
const SelectComponent = dynamic(() => import("@/components/UI/filterComponents/selectComponent"), {
    ssr: false,
});
import { ArrowDown2 } from "iconsax-react";
import DatePicker from "react-datepicker";
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
                    <h3 className="text-sm text-[#051B44] font-medium ml-1">Số đơn hàng</h3>
                    <SelectComponent classNamePrefix={"productionSmoothing"} placeholder={"Số đơn hàng"} />
                </div>
                <div className="col-span-2">
                    <h3 className="text-sm text-[#051B44] font-medium ml-1">Kế hoạch nội bộ</h3>
                    <SelectComponent classNamePrefix={"productionSmoothing"} placeholder={"Kế hoạch nội bộ"} />
                </div>
                <div className="col-span-2">
                    <div class="">
                        <label htmlFor="start" className="text-sm text-[#051B44] font-medium ml-1">
                            Ngày bắt đầu
                        </label>
                        <div className="w-full relative">
                            <DatePicker
                                id="start"
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
                    <div class="">
                        <label htmlFor="start" className="text-sm text-[#051B44] font-medium ml-1">
                            Ngày kết thúc
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
                <div className="col-span-2">
                    <h3 className="text-sm text-[#051B44] font-medium ml-1">Loại KH NVL</h3>
                    <SelectComponent
                        value={{ label: "Tất cả", value: 0 }}
                        options={[{ label: "Tất cả", value: 0 }]}
                        classNamePrefix={"productionSmoothing"}
                        placeholder={"Loại KH NVL"}
                    />
                </div>
            </div>
        </>
    );
};
export default FilterHeader;
