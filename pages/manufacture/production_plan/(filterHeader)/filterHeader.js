import dynamic from "next/dynamic";
import DatePicker from "react-datepicker";
import { ArrowDown2 } from "iconsax-react";
import vi from "date-fns/locale/vi"; // Import ngôn ngữ tiếng Việt

const SelectComponent = dynamic(() => import("@/components/UI/filterComponents/selectComponent"), {
    ssr: false,
});

const FilterHeader = ({ onChangeValue, isValue }) => {
    const renderMonthContent = (month, shortMonth, longMonth) => {
        const tooltipText = `Tooltip for month: ${longMonth}`;
        return <span title={tooltipText}>{shortMonth}</span>;
    };
    return (
        <>
            <div className="grid grid-cols-12 items-center gap-10 ">
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
                                selected={isValue.startDate}
                                onChange={onChangeValue("startDate")}
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
                                id="start"
                                calendarClassName="rasta-stripes"
                                clearButtonClassName="text"
                                selected={isValue.endDate}
                                onChange={onChangeValue("endDate")}
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
                    <h3 className="text-sm text-[#051B44] font-medium ml-1">Khách hàng</h3>
                    <SelectComponent
                        isClearable={true}
                        value={isValue.idClient}
                        onChange={onChangeValue("idClient")}
                        options={[
                            { label: "test1", value: 1 },
                            { label: "test2", value: 2 },
                        ]}
                        classNamePrefix={"productionSmoothing"}
                        placeholder={"Khách hàng"}
                    />
                </div>
                <div className="col-span-2">
                    <h3 className="text-sm text-[#051B44] font-medium ml-1">Nhóm thành phẩm</h3>
                    <SelectComponent
                        value={isValue.idProductGroup}
                        isClearable={true}
                        options={[
                            { label: "test1", value: 1 },
                            { label: "test2", value: 2 },
                        ]}
                        onChange={onChangeValue("idProductGroup")}
                        classNamePrefix={"productionSmoothing"}
                        placeholder={"Nhóm thành phẩm"}
                    />
                </div>
                <div className="col-span-2">
                    <div class="">
                        <label htmlFor="start" className="text-sm text-[#051B44] font-medium ml-1">
                            Thành phẩm
                        </label>
                        <div className="w-full relative">
                            <DatePicker
                                selected={isValue.idProduct}
                                renderMonthContent={renderMonthContent}
                                showFourColumnMonthYearPicker
                                showMonthYearPicker
                                locale={vi}
                                isClearable
                                onChange={onChangeValue("idProduct")}
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
                    <div class="">
                        <label htmlFor="start" className="text-sm text-[#051B44] font-medium ml-1">
                            Trạng thái kết hoạch
                        </label>
                        <div className="w-full relative">
                            <DatePicker
                                selected={isValue.planStatus}
                                renderMonthContent={renderMonthContent}
                                showFourColumnMonthYearPicker
                                showMonthYearPicker
                                locale={vi}
                                isClearable
                                onChange={onChangeValue("planStatus")}
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
