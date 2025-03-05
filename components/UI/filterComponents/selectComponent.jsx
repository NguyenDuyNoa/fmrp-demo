import configSelectFillter from "@/configs/configSelectFillter";
import { SelectCore } from "@/utils/lib/Select";
import { FaCheck } from "react-icons/fa";
import { components } from "react-select";
import { Customscrollbar } from "../common/Customscrollbar";


export const CustomOption = (props) => {
    return (
        <components.Option {...props}>
            <div className={`flex items-center justify-between w-full ${props.isDisabled ? "cursor-default" : "cursor-pointer"}`}>
                <div>{props.children}</div>
                {props.isSelected && <FaCheck className="w-2.5 h-2.5 ml-2 text-primary" />}
            </div>
        </components.Option>
    )
}
export const CustomMenuList = (props) => {
    return (
        <Customscrollbar className='max-h-[300px]'>
            {props.children}
        </Customscrollbar>
    )
}

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
    onMenuOpen,
    maxShowMuti,
    id
}) => {
    // const styles = {
    //     menuList: (base) => ({
    //         ...base,
    //         height: "100px",

    //         "::-webkit-scrollbar": {
    //             width: "9px"
    //         },
    //         "::-webkit-scrollbar-track": {
    //             background: "red"
    //         },
    //         "::-webkit-scrollbar-thumb": {
    //             background: "#888"
    //         },
    //         "::-webkit-scrollbar-thumb:hover": {
    //             background: "#555"
    //         }
    //     })
    // }
    return (
        <div className={`${classParent ? classParent : "ml-1"}`} style={{ gridColumn: `span ${colSpan || 1}` }}>
            <SelectCore
                id={id ?? "parentSelect"}
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
                components={{
                    ...components,
                    Option: CustomOption,
                    MenuList: CustomMenuList
                }}
                maxShowMuti={maxShowMuti}
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
