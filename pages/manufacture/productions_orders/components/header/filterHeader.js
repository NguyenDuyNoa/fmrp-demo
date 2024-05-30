
import DatePicker from "react-datepicker";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
import { ArrowDown2 } from "iconsax-react";
import { memo } from "react";

const FilterHeader = memo(({ dataLang, isState, queryState, }) => {
    return (
        <>
            <div className="grid grid-cols-12 items-center gap-2">

                <div className="col-span-2">
                    <h3 className="text-sm text-[#051B44] font-medium ml-1">{'Số lệnh sản xuất'}</h3>
                    <SelectComponent
                        isClearable={true}
                        value={[]}
                        onChange={(e) => queryState({ valueOrder: e, page: 1 })}
                        options={[]}
                        classNamePrefix={"productionSmoothing"} placeholder={'Số lệnh sản xuất'} />
                </div >
                <div className="col-span-2">
                    <h3 className="text-sm text-[#051B44] font-medium ml-1">{'Chi nhánh'}</h3>
                    <SelectComponent
                        isClearable={true}
                        value={[]}
                        onChange={(e) => queryState({ valueOrder: e, page: 1 })}
                        options={[]}
                        classNamePrefix={"productionSmoothing"} placeholder={'Chi nhánh'} />
                </div>
                <div className="col-span-2">
                    <h3 className="text-sm text-[#051B44] font-medium ml-1">{'Số LSX chi tiết'}</h3>
                    <SelectComponent
                        isClearable={true}
                        value={[]}
                        onChange={(e) => queryState({ valuePlan: e, page: 1 })}
                        options={[]}
                        classNamePrefix={"productionSmoothing"}
                        placeholder={'Số LSX chi tiết'} />
                </div>
                <div className="col-span-2">
                    <h3 className="text-sm text-[#051B44] font-medium ml-1">{'Mặt hàng'}</h3>
                    <SelectComponent
                        isClearable={true}
                        value={[]}
                        options={[]}
                        classNamePrefix={"productionSmoothing"}
                        placeholder={'Mặt hàng'} />
                </div>
                <div className="col-span-2">
                    <h3 className="text-sm text-[#051B44] font-medium ml-1">{'Đơn hàng bán/ KHNB'}</h3>
                    <SelectComponent
                        isClearable={true}
                        value={[]}
                        options={[]}
                        classNamePrefix={"productionSmoothing"}
                        placeholder={'Đơn hàng bán/ KHNB'} />
                </div>
                <div className="w-full col-span-2 relative">
                    <h3 className="text-sm text-[#051B44] font-medium ml-1">{'Từ ngày đến ngày'}</h3>
                    <DatePicker
                        id="start"
                        portalId="menu-time"
                        calendarClassName="rasta-stripes"
                        clearButtonClassName="text"
                        // selected={startDate}
                        // selected={startDate}
                        // onChange={onChange}
                        // startDate={startDate}
                        // endDate={endDate}
                        selectsRange
                        // onChange={(date) => setStartDate(date)}
                        isClearable
                        placeholderText="Từ ngày đến ngày"
                        className="p-2 placeholder:text-[12px] placeholder:text-[#6b7280] text-[14px] w-full outline-none focus:outline-none border-[#d8dae5] focus:border-[#0F4F9E] focus:border-2 border  rounded-md"
                    />
                    <ArrowDown2
                        size="11"
                        color="#6b7280"
                        className="absolute top-1/2 right-0 -translate-x-1/2 -translate-y-1/2"
                    />
                </div>
            </div >
        </>
    );
})
export default FilterHeader;
