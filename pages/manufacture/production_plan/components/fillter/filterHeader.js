import React from "react";
import dynamic from "next/dynamic";
import DatePicker from "react-datepicker";
import { ArrowDown2 } from "iconsax-react";
import { components } from "react-select";

const SelectComponent = dynamic(() => import("@/components/UI/filterComponents/selectComponent"), { ssr: false });

const FilterHeader = ({ onChangeValue, _HandleSeachApi, isValue, isData, options, dataLang }) => {
    return (
        <>
            <div className="grid grid-cols-14 items-center gap-2 ">
                <div className="col-span-2">
                    <h3 className="text-sm text-[#051B44] font-medium ml-1">Khách hàng</h3>
                    <SelectComponent
                        isClearable={true}
                        value={isValue.idClient}
                        onChange={onChangeValue("idClient")}
                        options={[{ label: "Khách hàng", value: "", isDisabled: true }, ...isData?.client]}
                        classNamePrefix={"productionSmoothing"}
                        placeholder={"Khách hàng"}
                    />
                </div>
                <div className="col-span-2">
                    <h3 className="text-sm text-[#051B44] font-medium ml-1">{dataLang?.purchase_order_table_branch || 'purchase_order_table_branch'}</h3>
                    <SelectComponent
                        isClearable={true}
                        value={isValue.valueBr}
                        onChange={onChangeValue("valueBr")}
                        options={isData.listBr}
                        classNamePrefix={"productionSmoothing"}
                        placeholder={dataLang?.purchase_order_table_branch || 'purchase_order_table_branch'} />
                </div>
                <div className="col-span-2">
                    <h3 className="text-sm text-[#051B44] font-medium ml-1">Nhóm thành phẩm</h3>
                    <SelectComponent
                        value={isValue.idProductGroup}
                        isClearable={true}
                        options={[{ label: "Nhóm thành phẩm", value: "", isDisabled: true }, ...isData?.productGroup]}
                        formatOptionLabel={({ level, label }) => {
                            return (
                                <div className="flex gap-2 truncate">
                                    {level == 1 && <span>--</span>}
                                    {level == 2 && <span>----</span>}
                                    {level == 3 && <span>------</span>}
                                    {level == 4 && <span>--------</span>}
                                    <span className="2xl:max-w-[300px] max-w-[150px] w-fit truncate">{label}</span>
                                </div>
                            );
                        }}
                        onChange={onChangeValue("idProductGroup")}
                        classNamePrefix={"productionSmoothing"}
                        placeholder={"Nhóm thành phẩm"}
                    />
                </div>
                <div className="col-span-2">
                    <h3 className="text-sm text-[#051B44] font-medium ml-1">Thành phẩm</h3>
                    <SelectComponent
                        isClearable={true}
                        value={isValue.idProduct}
                        onChange={onChangeValue("idProduct")}
                        onInputChange={_HandleSeachApi.bind(this)}
                        components={{ MultiValue }}
                        isMulti={true}
                        options={[{ label: "Thành phẩm", value: "", isDisabled: true }, ...options]}
                        closeMenuOnSelect={false}
                        formatOptionLabel={(option) => {
                            return (
                                <div className="">
                                    {option?.isDisabled ? (
                                        <div className="custom-text">
                                            <h3 className="font-medium text-base">{option.label}</h3>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <div className="custom-none max-w-[30px] w-[30px] h-[30px] max-h-[30px]">
                                                {option.e?.images != null ? (
                                                    <img
                                                        src={option.e?.images}
                                                        alt="Product Image"
                                                        className="max-max-w-[30px] w-[30px] h-[30px] max-h-[30px] text-[8px] object-cover rounded"
                                                    />
                                                ) : (
                                                    <div className=" max-w-[30px] w-[30px] h-[30px] max-h-[30px] object-cover  flex items-center justify-center rounded">
                                                        <img
                                                            src="/no_img.png"
                                                            alt="Product Image"
                                                            className="max-w-[30px] w-[30px] h-[30px] max-h-[30px] object-cover rounded"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="custom-text">
                                                <h3 className="font-medium 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px]">
                                                    {option.e?.item_name}
                                                </h3>
                                                <h5 className="font-medium 3xl:text-[12px] 2xl:text-[10px] xl:text-[9.5px] text-[9px] ">
                                                    {option.e?.product_variation}
                                                </h5>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        }}
                        styles={{
                            multiValueLabel: (provided) => ({
                                ...provided,
                                "& .custom-none": {
                                    display: "none",
                                },
                                "& .custom-text": {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "5px",
                                    maxWidth: "50px",
                                },
                                "& .custom-text h5": {
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                },
                            }),

                            menu: (provided) => ({
                                ...provided,
                                width: "150%",
                            }),
                        }}
                        classNamePrefix={"productionSmoothing"}
                        placeholder={"Thành phẩm"}
                    />
                </div>
                <div className="col-span-2">
                    <h3 className="text-sm text-[#051B44] font-medium ml-1">Trạng thái kế hoạch</h3>
                    <SelectComponent
                        isClearable={true}
                        value={isValue.planStatus}
                        onChange={onChangeValue("planStatus")}
                        options={[{ label: "Trạng thái kế hoạch", value: "", isDisabled: true }, ...isData?.planStatus]}
                        classNamePrefix={"productionSmoothing"}
                        placeholder={"Trạng thái kế hoạch"}
                    />
                </div>
                <div className="col-span-2">
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
                            dateFormat={"dd/MM/yyyy"}
                            isClearable
                            placeholderText="Ngày bắt đầu"
                            className="p-2 mb-[5px] placeholder:text-[12px] placeholder:text-[#6b7280] text-[14px] w-full outline-none focus:outline-none border-[#d8dae5] focus:border-[#0F4F9E] focus:border-2 border  rounded-md"
                        />
                        <ArrowDown2
                            size="11"
                            color="#6b7280"
                            className="absolute top-1/2 right-0 -translate-x-1/2 -translate-y-1/2"
                        />
                    </div>
                </div>
                <div className="col-span-2">
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
                            dateFormat={"dd/MM/yyyy"}
                            placeholderText="Ngày kết thúc"
                            className="p-2 mb-[5px] placeholder:text-[12px] placeholder:text-[#6b7280] text-[14px] w-full outline-none focus:outline-none border-[#d8dae5] focus:border-[#0F4F9E] focus:border-2 border  rounded-md"
                        />
                        <ArrowDown2
                            size="11"
                            color="#6b7280"
                            className="absolute top-1/2 right-0 -translate-x-1/2 -translate-y-1/2"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

const MoreSelectedBadge = ({ items }) => {
    const style = {
        marginLeft: "auto",
        background: "#d4eefa",
        borderRadius: "4px",
        fontSize: "14px",
        padding: "1px 3px",
        order: 99,
    };

    const title = items.join(", ");
    const length = items.length;
    const label = `+ ${length}`;

    return (
        <div style={style} title={title}>
            {label}
        </div>
    );
};

const MultiValue = ({ index, getValue, ...props }) => {
    const maxToShow = 2;
    const overflow = getValue()
        .slice(maxToShow)
        .map((x) => x.label);

    return index < maxToShow ? (
        <components.MultiValue {...props} />
    ) : index === maxToShow ? (
        <MoreSelectedBadge items={overflow} />
    ) : null;
};
export default React.memo(FilterHeader);
