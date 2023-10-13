import configSelectFillter from "../configs/configSelectFillter";
import Select from "react-select";
const SelectComponent = ({ options, value, onChange, placeholder, colSpan }) => {
    return (
        <div className="ml-1 " style={{ gridColumn: `span ${colSpan || 1}` }}>
            <Select
                options={options}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                {...configSelectFillter}
            />
        </div>
    );
};
export default SelectComponent;
