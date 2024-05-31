import { ArrowDown2 } from "iconsax-react";
import DatePicker from "react-datepicker";
const DatePickerComponent = ({ selected, isClearable, placeholderText }) => {
    return (
        <div className="w-full relative">
            <DatePicker
                id="start"
                portalId="menu-time"
                calendarClassName="rasta-stripes"
                clearButtonClassName="text"
                selected={selected}
                // onChange={(date) => setStartDate(date)}
                isClearable={isClearable}
                placeholderText={placeholderText}
                className="p-2  placeholder:text-[#cbd5e1]  2xl:text-base text-xs w-full outline-none focus:outline-none focus:border-[#0F4F9E] focus:border-2  rounded-md"
            />
            <ArrowDown2
                size="11"
                color="#6b7280"
                className="absolute top-1/2 right-0 -translate-x-1/2 -translate-y-1/2"
            />
        </div>
    );
};
export default DatePickerComponent;
