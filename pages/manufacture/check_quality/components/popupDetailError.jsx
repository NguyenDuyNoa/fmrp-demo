import { useState } from "react";
import PopupEdit from "/components/UI/popup";

import { ColumnTablePopup, GeneralInformation, HeaderTablePopup } from "@/components/UI/common/TablePopup";
import useToast from "@/hooks/useToast";
import { SelectCore, componentsCore } from "@/utils/lib/Select";
import NoData from "@/components/UI/noData/nodata";
const PopupDetailError = (props) => {
    const isShow = useToast();

    const dataLang = props?.dataLang;

    const initilaState = {
        open: false,
    };

    const [isState, sIsState] = useState(initilaState);

    const queryState = (key) => sIsState((prev) => ({ ...prev, ...key }));

    console.log("props", props);

    const MenuList = (props) => {
        return (
            <componentsCore.MenuList {...props}>
                {/* {allItems?.length > 0 && ( */}
                <div className="grid grid-cols-2 items-center  cursor-pointer">
                    <div
                        className="hover:bg-slate-200 p-2 col-span-1 text-center "
                        // onClick={_HandleSelectAll.bind(this)}
                    >
                        Chọn tất cả
                    </div>
                    <div
                        className="hover:bg-slate-200 p-2 col-span-1 text-center"
                        // onClick={_HandleDeleteAll.bind(this)}
                    >
                        Bỏ chọn tất cả
                    </div>
                </div>
                {/* )} */}
                {props.children}
            </componentsCore.MenuList>
        );
    };

    return (
        <PopupEdit
            title={"Thêm chi tiết lỗi"}
            button={props?.name}
            onClickOpen={() => queryState({ open: true })}
            open={isState.open}
            onClose={() => queryState({ open: false })}
            classNameBtn={`${props?.className}`}
        >
            <div className="flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]" />

            <div className="3xl:w-[1200px] 2xl:w-[1100px] xl:w-[999px] w-[950px] 3xl:h-auto 2xl:max-h-auto xl:h-auto h-auto ">
                <div className="overflow-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 flex flex-col">
                    <GeneralInformation {...props} />
                </div>
                <div className="grid grid-cols-2 gap-5 mb-3">
                    <div className="">
                        <label className="text-[#344054] font-normal text-sm mb-1 ">
                            Danh mục lỗi
                            <span className="text-red-500">*</span>
                        </label>
                        <SelectCore
                            options={[]}
                            onChange={(e) => {
                                // if (isStateQlty.idBranch && isStateQlty.listData?.length > 0) {
                                //     checkListData(e);
                                // } else {
                                //     queryStateQlty({ idBranch: e });
                                // }
                            }}
                            // value={isStateQlty.idBranch}
                            // isLoading={isStateQlty.idBranch != null ? false : isStateQlty.onLoading}
                            isClearable={true}
                            closeMenuOnSelect={true}
                            hideSelectedOptions={false}
                            placeholder={"Danh mục lỗi"}
                            className={`border-transparent placeholder:text-slate-300 w-full z-30 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
                            isSearchable={true}
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
                                placeholder: (base) => ({
                                    ...base,
                                    color: "#cbd5e1",
                                }),
                                menu: (provided) => ({
                                    ...provided,
                                    // zIndex: 9999, // Giá trị z-index tùy chỉnh
                                }),
                                control: (base, state) => ({
                                    ...base,
                                    boxShadow: "none",
                                    padding: "2.7px",
                                    ...(state.isFocused && {
                                        border: "0 0 0 1px #92BFF7",
                                    }),
                                }),
                            }}
                        />
                    </div>
                    <div className="">
                        <label className="text-[#344054] font-normal text-sm mb-1 ">
                            Chi tiết lỗi
                            <span className="text-red-500">*</span>
                        </label>
                        <SelectCore
                            options={[]}
                            components={{ MenuList }}
                            onChange={(e) => {
                                // if (isStateQlty.idBranch && isStateQlty.listData?.length > 0) {
                                //     checkListData(e);
                                // } else {
                                //     queryStateQlty({ idBranch: e });
                                // }
                            }}
                            // value={isStateQlty.idBranch}
                            // isLoading={isStateQlty.idBranch != null ? false : isStateQlty.onLoading}
                            isClearable={true}
                            closeMenuOnSelect={true}
                            hideSelectedOptions={false}
                            placeholder={"Chi tiết lỗi"}
                            className={`border-transparent placeholder:text-slate-300 w-full z-30 bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
                            isSearchable={true}
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
                                placeholder: (base) => ({
                                    ...base,
                                    color: "#cbd5e1",
                                }),
                                menu: (provided) => ({
                                    ...provided,
                                    // zIndex: 9999, // Giá trị z-index tùy chỉnh
                                }),
                                control: (base, state) => ({
                                    ...base,
                                    boxShadow: "none",
                                    padding: "2.7px",
                                    ...(state.isFocused && {
                                        border: "0 0 0 1px #92BFF7",
                                    }),
                                }),
                            }}
                        />
                    </div>
                </div>
                <div className="w-full">
                    <HeaderTablePopup gridCols={10}>
                        <ColumnTablePopup colSpan={2}>{"Mã chi tiết lỗi"}</ColumnTablePopup>
                        <ColumnTablePopup colSpan={2}>{"Tên chi tiết lỗi"}</ColumnTablePopup>
                        <ColumnTablePopup colSpan={2}>{"Ghi chú"}</ColumnTablePopup>
                        <ColumnTablePopup colSpan={2}>{"Chi nhánh"}</ColumnTablePopup>
                        <ColumnTablePopup colSpan={2}>{"Tác vụ"}</ColumnTablePopup>
                    </HeaderTablePopup>
                    <NoData />
                </div>
            </div>
        </PopupEdit>
    );
};
export default PopupDetailError;
