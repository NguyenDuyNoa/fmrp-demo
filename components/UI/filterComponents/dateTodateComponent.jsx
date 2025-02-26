import styleDatePicker from "@/configs/configDatePicker";
import "react-datepicker/dist/react-datepicker.css";
import Datepicker from "react-tailwindcss-datepicker";
const DateToDateComponent = ({ value, onChange, colSpan, className }) => {
    return (
        <div className={`z-20 ml-1 ${className}`} style={{ gridColumn: `span ${colSpan || 1}` }}>
            <Datepicker {...styleDatePicker} value={value} onChange={onChange} />
        </div>
    );
};
export default DateToDateComponent;
