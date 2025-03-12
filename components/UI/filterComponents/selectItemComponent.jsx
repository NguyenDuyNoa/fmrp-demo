import { SelectCore } from '@/utils/lib/Select'
import React from 'react'
import { CustomMenuList, CustomOption } from './selectComponent'
import { TagColorProduct } from '../common/Tag/TagStatus';
import { components } from "react-select";
import formatNumberConfig from "@/utils/helpers/formatnumber";
import useSetingServer from '@/hooks/useConfigNumber';
import MultiValue from '../mutiValue/multiValue';
import { Customscrollbar } from '../common/Customscrollbar';
export const MenuListClickAll = ({
    children,
    options,
    onClickSelectAll,
    onClickDeleteSelectAll,
    ...props
}) => {
    return (
        <Customscrollbar className='max-h-[300px]'>
            {[...options]?.length > 0 && (
                <div className="grid items-center grid-cols-2 cursor-pointer">
                    <div
                        className="col-span-1 p-2 text-xs text-center 2xl:text-sm hover:bg-slate-200 "
                        onClick={() => onClickSelectAll()}
                    >
                        Chọn tất cả
                    </div>
                    <div
                        className="col-span-1 p-2 text-xs text-center 2xl:text-sm hover:bg-slate-200"
                        onClick={() => onClickDeleteSelectAll()}
                    >
                        Bỏ chọn tất cả
                    </div>
                </div>
            )}
            {children}
        </Customscrollbar>
    );
};
const SelectItemComponent = (props) => {
    const dataLang = props.dataLang

    const dataSeting = useSetingServer()

    const formatNumber = (number) => {
        return formatNumberConfig(+number, dataSeting);
    };
    console.log("props?.styles", props?.styles);

    return (
        <SelectCore
            {...props}
            components={{
                ...components,
                ...props.components,
                Option: CustomOption,
                MenuList: props.components?.MenuList ? props.components?.MenuList : CustomMenuList,
                MultiValue
            }}
            isMulti={props.isMulti ? props.isMulti : false}
            formatOptionLabel={props?.formatOptionLabel ? props?.formatOptionLabel : (option) => (
                <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                        <div>
                            {option.e?.images != null ? (
                                <img
                                    src={option.e?.images}
                                    alt="Product Image"
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                    }}
                                    className="object-cover rounded"
                                />
                            ) : (
                                <div className="w-[40px] h-[40px] object-cover  flex items-center justify-center rounded">
                                    <img
                                        src="/icon/noimagelogo.png"
                                        alt="Product Image"
                                        style={{
                                            width: "40px",
                                            height: "40px",
                                        }}
                                        className="object-cover rounded"
                                    />
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="font-normal 2xl:text-[12px] xl:text-[13px] text-[12.5px]">
                                {option.e?.name}
                            </h3>
                            <div className="flex gap-2">
                                <h5 className="text-gray-400 font-normal 2xl:text-[12px] xl:text-[13px] text-[12.5px]">
                                    {option.e?.code}
                                </h5>
                                <h5 className="font-normal 2xl:text-[12px] xl:text-[13px] text-[12.5px]">
                                    {option?.e?.product_variation}
                                </h5>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <h5 className="text-gray-400 font-normal 2xl:text-[12px] xl:text-[13px] text-[12.5px]">
                                    {dataLang[option.e?.text_type]}
                                </h5>
                                {"-"}
                                <div className="flex items-center gap-1">
                                    <h5 className="text-gray-400 font-normal 2xl:text-[12px] xl:text-[13px] text-[12.5px]">
                                        {dataLang?.purchase_survive || "purchase_survive"}  :
                                    </h5>
                                    <h5 className=" font-normal text-black 2xl:text-[12px] xl:text-[13px] text-[12.5px]">
                                        {option.e?.qty_warehouse ? formatNumber(option.e?.qty_warehouse) : "0"}
                                    </h5>
                                </div>
                            </div>
                            {
                                option?.e?.id_plan > 0 && <TagColorProduct lang={false} dataKey={1} name={option?.e?.reference_no_plan} />
                            }
                        </div>
                    </div>
                </div>
            )}
            // placeholder={dataLang?.purchase_items || "purchase_items"}
            hideSelectedOptions={false}
            className={`${props.className} rounded-md bg-white  2xl:text-[12px] xl:text-[13px] text-[12.5px] z-20`}
            isSearchable={true}
            noOptionsMessage={() => "Không có dữ liệu"}
            menuPortalTarget={document.body}
            menuPlacement="auto"
            style={{
                border: "none",
                boxShadow: "none",
                outline: "none",
            }}
            theme={(theme) => ({
                ...theme,
                colors: {
                    ...theme.colors,
                    primary25: "#EBF5FF",
                    primary50: "#92BFF7",
                    primary: "#0F4F9E",
                },
            })}

            styles={{
                ...props.styles,
                placeholder: (base) => ({
                    ...base,
                    color: "#cbd5e1",
                }),
                menuPortal: (base) => ({
                    ...base,
                    // zIndex: 100,
                }),
                control: (base, state) => ({
                    ...base,
                    boxShadow: "none",
                    padding: "2.7px",
                    ...(state.isFocused && {
                        border: "0 0 0 1px #92BFF7",
                    }),
                }),

                menu: (provided, state) => {
                    const isSmallScreen = window.matchMedia("(max-width: 1280px)").matches;
                    return {
                        // ...props?.styles?.menu,
                        ...provided,
                        width: props?.styles?.menu?.width ? (isSmallScreen ? '120%' : props?.styles?.menu?.width) : (isSmallScreen ? "200%" : "150%"),
                    }
                },

                option: (provided, state) => ({
                    ...provided,
                    backgroundColor: 'transparent',
                    // backgroundColor: state?.isSelected ? 'transparent' : provided?.backgroundColor, // Bỏ nền khi selected
                    color: state?.isSelected ? '#2563eb' : provided?.color, // Giữ màu chữ
                    '&:hover': {
                        backgroundColor: 'transparent',
                        // backgroundColor: state?.isSelected ? 'transparent' : provided['&:hover']?.backgroundColor, // Giữ transparent khi hover
                        color: state?.isDisabled ? provided['&:hover']?.color : '#3b82f6'
                    },
                }),
            }}
        />
    )
}

export default SelectItemComponent