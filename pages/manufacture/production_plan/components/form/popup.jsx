import Image from "next/image";
import { useEffect, useState } from "react";

import { useToggle } from "@/hooks/useToggle";

import PopupEdit from "@/components/UI/Popup";
import Loading from "@/components/UI/loading";
import Zoom from "@/components/UI/zoomElement/zoomElement";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";

const PopupEditer = ({ }) => {
    const { isOpen, handleOpen } = useToggle(false);

    const [isLoading, sIsLoading] = useState(false);

    useEffect(() => {
        isOpen && sIsLoading(true);

        setTimeout(() => {
            sIsLoading(false);
        }, 1000);
    }, [isOpen]);

    return (
        <PopupEdit
            title={
                <>
                    <h1 className="font-medium text-xl text-[#101828]">Danh sách bán thành phẩm (SO-1233123)</h1>
                    <h1 className="font-light text-sm text-[#667085] my-1">Cập nhật thông tin BOM, công đoạn BTP</h1>
                </>
            }
            classNameTittle="items-start"
            button={
                <Zoom className="w-fit flex items-center">
                    <Image
                        src={"/productionPlan/edit-3.png"}
                        width={24}
                        height={24}
                        alt=""
                        className="object-cover rounded-md cursor-pointer"
                    />
                </Zoom>
            }
            onClickOpen={() => handleOpen(true)}
            open={isOpen}
            onClose={() => handleOpen(false)}
        // classNameBtn={props?.className}
        >
            <div className="flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]"></div>
            <div className="space-x-1 3xl:w-[950px]  xxl:w-[850px] 2xl:w-[800px] xl:w-[800px] lg:w-[800px] w-[750px] 3xl:h-auto xxl:h-[480px]  2xl:h-[520px] xl:h-[480px] lg:h-[500px] h-[500px] ">
                <div className="grid grid-cols-11 items-center bg-[#F7F8F9] rounded sticky top-0 !z-[2000]">
                    <h3 className="text-[#64748B] col-span-3 py-1 text-center font-medium 3xl:text-sm text-xs capitalize flex items-center">
                        <h3 className="text-[#64748B] text-center w-fit py-1 px-8 font-medium 3xl:text-sm text-xs capitalize">
                            {"STT"}
                        </h3>
                        <h3 className="text-[#64748B] w-full py-1 px-1 font-medium 3xl:text-sm text-xs capitalize">
                            {"Mã BTP"}
                        </h3>
                    </h3>
                    <h3 className="text-[#64748B] col-span-4 py-1 text-center font-medium 3xl:text-sm text-xs">
                        Tên BTP
                    </h3>
                    <h3 className="text-[#64748B] col-span-2 py-1 text-center font-medium 3xl:text-sm text-xs uppercase">
                        bom
                    </h3>
                    <h3 className="text-[#64748B] col-span-2 py-1 text-center font-medium 3xl:text-sm text-xs uppercase">
                        cÔNG ĐOẠN
                    </h3>
                </div>
                <div className="3xl:h-[36vh] xxl:h-[57.5vh] 2xl:h-[57vh] xl:h-[58vh] lg:h-[60vh] h-[40vh] overflow-y-auto overflow-hidden  scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                    {isLoading ? (
                        <Loading className="h-80" color="#0f4f9e" />
                    ) : (
                        [...Array(10)].map((e, _) => (
                            <div key={_} className="grid grid-cols-11 items-center border-b border-[#E7EAEE] ">
                                <h3 className="text-[#64748B] col-span-3 py-2 text-center font-medium 3xl:text-sm text-xs capitalize flex items-center">
                                    <h3 className="text-[#64748B] text-center w-fit py-2 px-9 font-medium 3xl:text-sm text-xs capitalize">
                                        {_ + 1}
                                    </h3>
                                    <h3 className="text-[#64748B] w-full py-2 px-1 font-medium 3xl:text-sm text-xs capitalize">
                                        {"COAOTHUN"}
                                    </h3>
                                </h3>
                                <h3 className="text-[#64748B] col-span-4 py-3 font-medium 3xl:text-sm text-xs capitalize flex items-center gap-2">
                                    <Image
                                        src={"/productionPlan/coaothun.png"}
                                        width={36}
                                        height={36}
                                        alt=""
                                        className="object-cover rounded-md"
                                    />
                                    <h2 className="text-[#000000] 3xl:text-base text-sm font-medium">Cổ áo</h2>
                                </h3>
                                <h3 className=" text-[#64748B] col-span-2 py-3 px-3 text-center font-medium 3xl:text-sm text-xs uppercase">
                                    <SelectComponent
                                        classNamePrefix={"productionSmoothing"}
                                        placeholder={"BOM"}
                                        menuPortalTarget={document.body}
                                        options={[
                                            { label: "test1", value: 1 },
                                            { label: "test2", value: 2 },
                                        ]}
                                        formatOptionLabel={(options) => {
                                            return <div className="3xl:text-sm text-xs">{options.label}</div>;
                                        }}
                                        noOptionsMessage={() => {
                                            return <div className="3xl:text-sm text-xs">Không có dữ liệu</div>;
                                        }}
                                        menuShouldBlockScroll
                                        styles={{
                                            placeholder: (base) => ({
                                                ...base,
                                                color: "#cbd5e1",
                                                fontSize: "11px !important",
                                                "@media screen and (max-width: 1600px)": {
                                                    fontSize: "11px !important",
                                                },
                                                "@media screen and (max-width: 1400px)": {
                                                    fontSize: "11px !important",
                                                },
                                                "@media screen and (max-width: 1536px)": {
                                                    fontSize: "8.5px !important",
                                                },
                                                "@media screen and (max-width: 1280px)": {
                                                    fontSize: "9px !important",
                                                },
                                                "@media screen and (max-width: 1024px)": {
                                                    fontSize: "7px !important",
                                                },
                                            }),
                                            menuPortal: (base) => ({
                                                ...base,
                                                zIndex: 999,
                                            }),
                                        }}
                                    />
                                </h3>
                                <h3 className="text-[#64748B] col-span-2 py-3 px-3 text-center font-medium 3xl:text-sm text-xs uppercase">
                                    <SelectComponent
                                        classNamePrefix={"productionSmoothing"}
                                        placeholder={"Công đoạn"}
                                        menuPortalTarget={document.body}
                                        options={[
                                            { label: "test", value: 1 },
                                            { label: "test2", value: 2 },
                                        ]}
                                        formatOptionLabel={(options) => {
                                            return <div className="3xl:text-sm text-xs">{options.label}</div>;
                                        }}
                                        noOptionsMessage={() => {
                                            return <div className="3xl:text-sm text-xs">Không có dữ liệu</div>;
                                        }}
                                        menuShouldBlockScroll
                                        styles={{
                                            placeholder: (base) => ({
                                                ...base,
                                                color: "#cbd5e1",
                                                fontSize: "11px !important",
                                                "@media screen and (max-width: 1600px)": {
                                                    fontSize: "11px !important",
                                                },
                                                "@media screen and (max-width: 1400px)": {
                                                    fontSize: "11px !important",
                                                },
                                                "@media screen and (max-width: 1536px)": {
                                                    fontSize: "8.5px !important",
                                                },
                                                "@media screen and (max-width: 1280px)": {
                                                    fontSize: "9px !important",
                                                },
                                                "@media screen and (max-width: 1024px)": {
                                                    fontSize: "7px !important",
                                                },
                                            }),
                                            menuPortal: (base) => ({
                                                ...base,
                                                zIndex: 999,
                                            }),
                                        }}
                                    />
                                </h3>
                            </div>
                        ))
                    )}
                </div>
                <div className="text-right mt-5 space-x-2">
                    <button
                        type="button"
                        onClick={() => handleOpen(false)}
                        className="button text-[#344054] font-normal text-base py-2 px-4 rounded-[5.5px] border border-solid border-[#D0D5DD] hover:scale-105 transition-all ease-linear"
                    >
                        {"Hủy"}
                    </button>
                    <button
                        type="submit"
                        className="button text-[#FFFFFF]  font-normal text-base py-2 px-4 rounded-[5.5px] bg-[#0F4F9E] hover:scale-105 transition-all ease-linear"
                    >
                        {"Lưu"}
                    </button>
                </div>
            </div>
        </PopupEdit>
    );
};
export default PopupEditer;
