import { SelectCore } from "@/utils/lib/Select";
import configSelectFillter from "@/configs/configSelectFillter";

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
    maxMenuHeight,
    isClearable,
    menuPortalTarget,
    className,
    styles,
    defaultValue,
    noOptionsMessage,
    menuShouldBlockScroll,
    classParent,
    onMenuOpen
}) => {
    return (
        <div className={`${classParent ? classParent : "ml-1"}`} style={{ gridColumn: `span ${colSpan || 1}` }}>
            <SelectCore
                options={options}
                value={value}
                onInputChange={onInputChange ? onInputChange : ""}
                onChange={onChange}
                placeholder={placeholder}
                onMenuOpen={onMenuOpen}
                {...configSelectFillter}
                defaultValue={defaultValue}
                className={className ? className : configSelectFillter.className}
                isMulti={isMulti ? isMulti : false}
                components={components}
                noOptionsMessage={noOptionsMessage ? noOptionsMessage : configSelectFillter.noOptionsMessage}
                closeMenuOnSelect={closeMenuOnSelect}
                formatOptionLabel={formatOptionLabel}
                classNamePrefix={classNamePrefix}
                maxMenuHeight={maxMenuHeight}
                isClearable={isClearable}
                menuPortalTarget={menuPortalTarget}
                menuShouldBlockScroll={menuShouldBlockScroll}
                styles={styles ? styles : configSelectFillter.styles}
            />
        </div>
    );
};
export default SelectComponent;
