import moment from "moment";
import Swal from "sweetalert2";
import dynamic from "next/dynamic";
import ModalImage from "react-modal-image";
import React, { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { _ServerInstance as Axios } from "/services/axios";
const ScrollArea = dynamic(() => import("react-scrollbar"), { ssr: false });
import {
    SearchNormal1 as IconSearch,
    Trash as IconDelete,
    Box1,
    TickCircle,
    BoxSearch,
    ArrowDown2,
} from "iconsax-react";
import PopupEdit from "@/components/UI/popup";
import Loading from "@/components/UI/loading";
import Zoom from "@/components/UI/zoomElement/zoomElement";
import formatNumber from "@/components/UI/formanumber/formanumber";
import ToatstNotifi from "@/components/UI/alerNotification/alerNotification";
import SelectComponent from "@/components/UI/filterComponents/selectComponent";
const Popup_DetailKeepStock = ({ dataLang, status, id, onRefresh, ...props }) => {
    const initialFetch = {
        onSending: false,
        onFetching: false,
        onFetchingWarehouse: false,
        onFetchingCondition: false,
    };

    const [data, sData] = useState({});
    const [open, sOpen] = useState(false);
    const [isFetching, sIsFetching] = useState(initialFetch);

    const _ToggleModal = (e) => sOpen(e);

    const setIsFetch = (e) => sIsFetching((prve) => ({ ...prve, ...e }));
    const handleSubmit = (e) => {};
    return (
        <>
            <PopupEdit
                title={"Chi tiết giữ kho"}
                onClickOpen={_ToggleModal.bind(this, true)}
                open={open}
                onClose={_ToggleModal.bind(this, false)}
                classNameBtn={""}
                button={
                    <button className="group transition-all ease-in-out flex items-center justify-center gap-2  2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 w-full">
                        <BoxSearch
                            size={20}
                            className="group-hover:text-amber-500 group-hover:scale-110 group-hover:shadow-md "
                        />
                        <p className="group-hover:text-amber-500 pr-2.5">{"Xem giữ kho"}</p>
                    </button>
                }
            >
                <div className="flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]"></div>
                <div className="3xl:w-[1300px] 2xl:w-[1150px] xl:w-[999px] w-[950px] 3xl:h-auto 2xl:max-h-auto xl:h-auto h-auto ">
                    <div className=" customsroll overflow-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 flex flex-col">
                        <h2 className="font-normal bg-[#ECF0F4] 3xl:p-2 p-1 3xl:text-[16px] 2xl:text-[16px] xl:text-[15px] text-[15px]">
                            {dataLang?.detail_general_information || "detail_general_information"}
                        </h2>
                        <div className="grid grid-cols-12 min-h-[100px]">
                            <div className="col-span-4">
                                <div className="xl:my-4 my-3 font-medium grid grid-cols-6 ">
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2 whitespace-nowrap">
                                        {dataLang?.sales_product_date || "sales_product_date"}:
                                    </h3>
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] font-normal items-start col-span-4 ml-3">
                                        {data?.date != null ? moment(data?.date).format("DD/MM/YYYY, HH:mm:ss") : ""}
                                    </h3>
                                </div>
                                <div className="xl:my-4 my-3 font-medium grid grid-cols-6">
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                        {dataLang?.sales_product_code || "sales_product_code"}:
                                    </h3>
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px]  font-normal col-span-2 ml-3">
                                        {data?.code}
                                    </h3>
                                </div>
                            </div>

                            <div className="col-span-4 ">
                                <div className="xl:my-4 my-3 font-medium grid grid-cols-6">
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                        {dataLang?.price_quote_customer || "price_quote_customer"}:
                                    </h3>
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] font-normal col-span-4">
                                        {data?.client_name}
                                    </h3>
                                </div>
                                <div className="xl:my-4 my-3 font-medium grid grid-cols-6">
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                        {dataLang?.price_quote_order_status || "price_quote_order_status"}:
                                    </h3>
                                    <h3 className="3xl:text-[12px] 2xl:text-[11px] xl:text-[11px] text-[10px] font-normal col-span-4">
                                        {(data?.status == "un_approved" && (
                                            <span className="border flex justify-center items-center rounded-2xl 3xl:w-24 2xl:w-20 xl:w-[74px] lg:w-[68px] 3xl:h-6 2xl:h-6 xl:h-5 lg:h-5 px-1 bg-red-200 border-red-200 text-red-500">
                                                Chưa Duyệt
                                            </span>
                                        )) ||
                                            (data?.status == "approved" && (
                                                <span className="border flex justify-center items-center rounded-2xl 3xl:w-24 2xl:w-20 xl:w-[74px] lg:w-[68px] 3xl:h-6 2xl:h-6 xl:h-5 lg:h-5 px-1 bg-lime-200 border-lime-200 text-lime-500">
                                                    Đã Duyệt
                                                </span>
                                            ))}
                                    </h3>
                                </div>
                            </div>
                            <div className="col-span-4 ">
                                <div className="xl:my-4 my-3 font-medium grid grid-cols-6">
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                        {dataLang?.sales_product_staff_in_charge || "sales_product_staff_in_charge"}:
                                    </h3>
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px]  font-normal col-span-2">
                                        {data?.staff_name}
                                    </h3>
                                </div>

                                <div className="xl:my-4 my-3 font-medium grid grid-cols-6">
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[11px] col-span-2">
                                        {dataLang?.price_quote_branch || "price_quote_branch"}:
                                    </h3>
                                    <h3 className="3xl:text-[14px] 2xl:text-[13px] xl:text-[12px] text-[10px]  col-span-4 mr-2 px-2 max-w-[250px] w-fit max-h-[100px] text-center text-[#0F4F9E]  font-[400] py-0.5 border border-[#0F4F9E] rounded-[5.5px] ">
                                        {data?.branch_name}
                                    </h3>
                                </div>
                            </div>
                        </div>
                        <div className="w-[100%] lx:w-[110%] ">
                            <div className="grid grid-cols-8 items-center sticky rounded-t-xl top-0 bg-slate-100 p-2 z-10">
                                <h4 className="grid grid-cols-2 items-center justify-center 3xl:text-[12px] 2xl:text-[11px] xl:text-[12px] text-[10px] text-[#667085] uppercase col-span-1 font-[500] text-center whitespace-nowrap">
                                    <ArrowDown2 variant="Bold" size="18" color="green" />
                                    <h4>{"Ngày"}</h4>
                                </h4>
                                <h4 className="3xl:text-[12px] 2xl:text-[11px] xl:text-[12px] text-[10px] text-[#667085] uppercase col-span-2 font-[500] text-center whitespace-nowrap">
                                    {"Số phiếu chuyển"}
                                </h4>
                                <h4 className="3xl:text-[12px] 2xl:text-[11px] xl:text-[12px] text-[10px] text-[#667085] uppercase col-span-2 font-[500] text-center whitespace-nowrap">
                                    {"Người tạo"}
                                </h4>
                                <h4 className="3xl:text-[12px] 2xl:text-[11px] xl:text-[12px] text-[10px] text-[#667085] uppercase col-span-2 font-[500] text-center whitespace-nowrap">
                                    {"Trạng thái"}
                                </h4>
                                <h4 className="3xl:text-[12px] 2xl:text-[11px] xl:text-[12px] text-[10px] text-[#667085] uppercase col-span-1 font-[500] text-center ">
                                    {"Tác vụ"}
                                </h4>
                            </div>
                        </div>
                        <div className="text-right mt-2  grid grid-cols-12 flex-col justify-between border-t">
                            <div className="col-span-7 font-medium grid grid-cols-7 text-left">
                                <h3 className="3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px] ">
                                    {dataLang?.price_quote_note || "price_quote_note"}
                                </h3>
                                <h3 className="3xl:text-[15px] 2xl:text-[14px] xl:text-[12px] text-[11px] col-span-5 font-normal rounded-lg">
                                    {data?.note}
                                </h3>
                            </div>
                            <div className="col-span-3 space-y-2"></div>
                            <div className="col-span-2 space-y-2">
                                <div className="text-right mt-5 mr-2 space-x-2">
                                    <button
                                        type="button"
                                        onClick={_ToggleModal.bind(this, false)}
                                        className="button text-[#344054] font-normal text-base py-2 px-4 rounded-[5.5px] border border-solid border-[#D0D5DD] hover:scale-105 transition-all ease-linear"
                                    >
                                        {dataLang?.branch_popup_exit || "branch_popup_exit"}
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        type="submit"
                                        className="button text-[#FFFFFF]  font-normal text-base py-2 px-4 rounded-[5.5px] bg-[#0F4F9E] hover:scale-105 transition-all ease-linear"
                                    >
                                        {dataLang?.branch_popup_save || "branch_popup_save"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </PopupEdit>
        </>
    );
};
export default Popup_DetailKeepStock;
