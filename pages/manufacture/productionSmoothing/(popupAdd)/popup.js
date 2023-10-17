import { Add } from "iconsax-react";
import PopupEdit from "/components/UI/popup";
import { useState } from "react";
import Image from "next/image";
import DatePicker from "react-datepicker";
import { v4 as uuid } from "uuid";
import vi from "date-fns/locale/vi";
import { components } from "react-select";
import SelectComponent from "components/UI/filterComponents/selectComponent";
const PopupAdd = ({ data }) => {
    const [isOpenPopup, sIsOpenPopup] = useState(false);
    const initialValue = {
        startDate: null,
        endDate: null,
        stages: [],
        satff: [],
    };
    const [valueChange, sValueChange] = useState(initialValue);
    const handleOpenPopup = (e) => sIsOpenPopup(e);
    const dataFake = { ...data };
    const [checkboxes, setCheckboxes] = useState(dataFake.data.map((i) => ({ ...i, checked: false })));

    const handleCheckboxChange = (id) => {
        setCheckboxes(
            checkboxes.map((checkbox) => (checkbox.id === id ? { ...checkbox, checked: !checkbox.checked } : checkbox))
        );
    };
    const handleSelectAll = () => {
        const anyChecked = checkboxes.some((checkbox) => checkbox.checked);
        setCheckboxes(
            checkboxes.map((checkbox) => ({
                ...checkbox,
                checked: !anyChecked,
            }))
        );
    };
    const handleChange = (type) => (event) => sValueChange((e) => ({ ...e, [type]: event }));

    return (
        <PopupEdit
            title={
                <>
                    <h1 className="font-medium text-xl text-[#101828]">Phân bổ nhân viên</h1>
                    <h1 className="font-light text-sm text-[#667085] my-1">
                        Thêm nhân viên vào các công đoạn của lệnh sản xuất
                    </h1>
                </>
            }
            classNameTittle="items-start"
            button={
                <button
                    type="button"
                    className="bg-[#0F4F9E] rounded-md hover:scale-105 transition-all duration-200 ease-linear 3xl:py-2.5 xxl:py-2 2xl:py-2 xl:py-1 lg:py-1 py-3  px-4 flex items-center gap-2"
                >
                    <Image src={"/productionSmoothing/Icon.png"} width={16} height={16} className="object-cover" />
                    <h3 className="text-white font-medium transition-all duration-200 ease-linear text-sm">
                        Phân bổ nhân viên
                    </h3>
                </button>
            }
            onClickOpen={() => handleOpenPopup(true)}
            open={isOpenPopup}
            onClose={() => handleOpenPopup(false)}
            // classNameBtn={props?.className}
        >
            <div className="flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]"></div>
            <div className="space-x-1 3xl:w-[950px] 2xl:w-[600] xl:w-[500px] lg:w-[500px] w-[700px] 3xl:h-auto  2xl:h-auto xl:h-auto lg:h-[400px] h-[500px] ">
                <div className="flex gap-6 items-center my-4">
                    <div class="w-1/2">
                        <label htmlFor="start" className="text-sm text-[#344054] font-normal ml-1">
                            Ngày bắt đầu
                        </label>
                        <div className="w-full relative">
                            <DatePicker
                                id="start"
                                calendarClassName="rasta-stripes"
                                clearButtonClassName="text"
                                // selected={startDate}
                                onChange={handleChange("startDate")}
                                isClearable
                                placeholderText="Ngày bắt đầu"
                                className="p-2.5 placeholder:text-[12px] placeholder:text-[#6b7280] text-[14px] w-full outline-none focus:outline-none 
                                    border-[#E1E1E1] focus:border-[#0F4F9E] focus:border-2 border  rounded-[9px]"
                            />
                            <Image
                                alt=""
                                src={"/productionSmoothing/calendar.png"}
                                width={24}
                                height={24}
                                className="absolute top-1/2 right-0 -translate-x-1/2 -translate-y-1/2"
                            />
                        </div>
                    </div>
                    <div class="w-1/2">
                        <label htmlFor="start" className="text-sm text-[#344054] font-normal ml-1">
                            Ngày kết thúc
                        </label>
                        <div className="w-full relative">
                            <DatePicker
                                id="start"
                                calendarClassName="rasta-stripes"
                                clearButtonClassName="text"
                                // selected={startDate}
                                onChange={handleChange("endDate")}
                                isClearable
                                placeholderText="Ngày kết thúc"
                                className="p-2.5 placeholder:text-[12px] placeholder:text-[#6b7280] text-[14px] w-full outline-none focus:outline-none 
                                    border-[#E1E1E1] focus:border-[#0F4F9E] focus:border-2 border  rounded-[9px]"
                            />
                            <Image
                                alt=""
                                src={"/productionSmoothing/calendar.png"}
                                width={24}
                                height={24}
                                className="absolute top-1/2 right-0 -translate-x-1/2 -translate-y-1/2"
                            />
                        </div>
                    </div>
                </div>
<<<<<<< HEAD
                {/* <div className="flex gap-2 items-center">
=======
                <div className="flex gap-2 items-center">
>>>>>>> 5d6beb6219fe5ed3de934d04c075b6aeb0f3b6cf
                    <h2 className="text-[#344054] font-normal">Chọn lệnh sản xuất</h2>
                    <button
                        onClick={() => handleSelectAll()}
                        type="button"
                        className="text-[#3276FA] text-sm font-normal transition-all duration-200 ease-linear hover:text-blue-700"
                    >
                        {checkboxes.filter((e) => e.checked).length > 0
                            ? `Bỏ chọn tất cả (${checkboxes.filter((e) => e.checked).length})`
                            : `Chọn tất cả (${checkboxes.length})`}
                    </button>
                </div>
                <div
                    className={` flex flex-wrap justify-between ${
                        checkboxes?.length > 9 ? "max-h-[250px] overflow-y-auto overflow-x-hidden" : ""
                    } scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 `}
                >
                    {checkboxes.map((checkbox) => (
                        <div key={checkbox.id} className="border border-[#D0D5DD] my-3 mx-1 rounded-lg shadow">
                            <label htmlFor={checkbox.id} className="flex items-center p-2 gap-2 cursor-pointer">
                                <input
                                    id={checkbox.id}
                                    className=""
                                    type="checkbox"
                                    checked={checkbox.checked}
                                    onChange={() => handleCheckboxChange(checkbox.id)}
                                />
                                <div className="grid grid-cols-13 items-center gap-1 justify-center  ">
                                    <Image
                                        src={checkbox.image}
                                        alt=""
                                        className="object-cover col-span-3"
                                        width={44}
                                        height={44}
                                    />
                                    <div className="col-span-10">
                                        <h3 className="text-[#0F4F9E] text-sm font-semibold my-0.5">{checkbox.name}</h3>
                                        <h3 className="text-[#52575E] text-sm font-normal">{checkbox.desriptions}</h3>
                                    </div>
                                </div>
                            </label>
                        </div>
                    ))}
                </div>
                <div className="">
                    <h2 className="text-[#344054] font-normal my-3">Chọn công đoạn</h2>
                    <SelectComponent
                        isMulti={true}
                        closeMenuOnSelect={false}
                        value={valueChange.stages}
                        onChange={handleChange("stages")}
                        options={[
                            { label: "test1", value: "1" },
                            { label: "test2", value: "2" },
                        ]}
                        components={{ MultiValue }}
                        classNamePrefix={"productionSmoothingPopupStages"}
                        placeholder={"Chọn 1 hoặc nhiều công đoạn"}
                        formatOptionLabel={(option) => (
                            <div className="flex items-center  justify-between  cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <div className="w-fit">
                                        <div className="">
                                            <h1 className="font-normal text-xs ">{option.label}</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        styles={{
                            multiValue: (base) => ({
                                ...base,
                                backgroundColor: "#1760B9", // Đặt màu nền cho giá trị đã chọn,
                                borderRadius: "4px",
                                padding: "4px 0px", // Thêm padding 5px
                                color: "white", // Đặt màu chữ cho giá trị đã chọn
                            }),
                            multiValueLabel: (styles, { data }) => ({
                                ...styles,
                                color: "white",
                            }),
                            multiValueRemove: (styles, { data }) => ({
                                ...styles,
                                color: "white",
                                ":hover": {
                                    backgroundColor: "transparent",
                                    color: "white",
                                },
                            }),
                            option: (styles, { data, isDisabled, isFocused, isSelected }) => {
                                return {
                                    ...styles,
                                    backgroundColor: isDisabled
                                        ? undefined
                                        : isSelected
                                        ? "#3A3E4C"
                                        : isFocused
                                        ? "white"
                                        : undefined,
                                    cursor: isDisabled ? "not-allowed" : "default",
                                    color: !isDisabled ? (isSelected ? "white" : "#3A3E4C") : undefined,
                                    ":active": {
                                        ...styles[":active"],
                                        backgroundColor: !isDisabled ? (isSelected ? "#3A3E4C" : "white") : undefined,
                                        color: "white",
                                    },
                                };
                            },
                        }}
                        className="z-[999]"
                    />
                </div>
                <div className="">
                    <h2 className="text-[#344054] font-normal my-3">Chọn nhân viên</h2>
                    <SelectComponent
                        isMulti={true}
                        closeMenuOnSelect={false}
                        value={valueChange.satff}
                        onChange={handleChange("satff")}
                        options={[{ label: "test", value: "1" }]}
                        components={{ MultiValue }}
                        classNamePrefix={"productionSmoothingPopupStaf"}
                        placeholder={"Chọn 1 hoặc nhiều nhân viên"}
                        formatOptionLabel={(option) => (
                            <div className="flex items-center  justify-between  cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <div className="w-fit">
                                        <div className="text-[#0F4F9E] w-full flex items-center  gap-1 font-medium text-sm py-1 pl-2 pr-10 bg-[#EBF5FF] rounded-2xl ">
                                            <div className="bg-gradient-to-l from-blue-400/80 to-[#1556D9] text-sm  rounded-full h-[24px]  w-[24px] text-[#FFFFFF] flex items-center justify-center">
                                                {option.label[0]}
                                            </div>
                                            <h1>{option.label}</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        // maxMenuHeight="200px"
                        // isClearable={true}
                        // menuPortalTarget={document.body}
                    />
                </div>
                <div className="text-right mt-5 space-x-2">
                    <button
                        type="button"
                        // onClick={_ToggleModal.bind(this, false)}
                        className="button text-[#344054] font-normal text-base py-2 px-4 rounded-[5.5px] border border-solid border-[#D0D5DD] hover:scale-105 transition-all ease-linear"
                    >
                        {"Hủy"}
                    </button>
                    <button
                        type="submit"
                        className="button text-[#FFFFFF]  font-normal text-base py-2 px-4 rounded-[5.5px] bg-[#0F4F9E] hover:scale-105 transition-all ease-linear"
                    >
                        {"Thực hiện"}
                    </button>
<<<<<<< HEAD
                </div> */}
=======
                </div>
>>>>>>> 5d6beb6219fe5ed3de934d04c075b6aeb0f3b6cf
            </div>
        </PopupEdit>
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
    const maxToShow = 3;
    const overflow = getValue()
        .slice(maxToShow)
        .map((x) => x.label);

    return index < maxToShow ? (
        <components.MultiValue {...props} />
    ) : index === maxToShow ? (
        <MoreSelectedBadge items={overflow} />
    ) : null;
};
export default PopupAdd;
