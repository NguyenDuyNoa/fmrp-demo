import styleDatePicker from "@/configs/configDatePicker";
import "react-datepicker/dist/react-datepicker.css";
import Datepicker from "react-tailwindcss-datepicker";
const DateToDateComponent = ({ value, onChange, colSpan, className }) => {
    return (
        <div
            id="parentDatepicker"
            className={`z-20 ml-1 parentDatepicker ${className}`}
            style={{ gridColumn: `span ${colSpan || 1}` }}>
            <Datepicker
                {...styleDatePicker}
                value={value}
                onChange={onChange}
                placeholder='Từ ngày - Ngày'
            />
        </div>
    );
};
export default DateToDateComponent;
