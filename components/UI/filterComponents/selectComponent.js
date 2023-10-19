import configSelectFillter from "../configs/configSelectFillter";
import Select from "react-select";
const SelectComponent = ({
    options,
    value,
    onChange,
    onInputChange,
    placeholder,
    colSpan,
    isMulti,
    components,
    closeMenuOnSelect,
    formatOptionLabel,
    classNamePrefix,
    classNames,
    maxMenuHeight,
    isClearable,
    menuPortalTarget,
    className,
    styles,
}) => {
    return (
        <div className="ml-1" style={{ gridColumn: `span ${colSpan || 1}` }}>
            <Select
                options={options}
                value={value}
                onInputChange={onInputChange ? onInputChange : ""}
                onChange={onChange}
                placeholder={placeholder}
                {...configSelectFillter}
                className={className ? className : configSelectFillter.className}
                isMulti={isMulti ? isMulti : false}
                components={components}
                closeMenuOnSelect={closeMenuOnSelect}
                formatOptionLabel={formatOptionLabel}
                classNamePrefix={classNamePrefix}
                maxMenuHeight={`${maxMenuHeight}`}
                isClearable={isClearable}
                menuPortalTarget={menuPortalTarget}
                styles={styles ? styles : configSelectFillter.styles}
            />
        </div>
    );
};
export default SelectComponent;
