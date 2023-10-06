import React, { useState, useRef, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { _ServerInstance as Axios } from "/services/axios";
const ScrollArea = dynamic(() => import("react-scrollbar"), {
    ssr: false,
});
import ReactExport from "react-data-export";

import Swal from "sweetalert2";
import { NumericFormat } from "react-number-format";
import { v4 as uuidv4 } from "uuid";

import { MdClear } from "react-icons/md";
import { BsCalendarEvent } from "react-icons/bs";
import "react-datepicker/dist/react-datepicker.css";
import Datepicker from "react-tailwindcss-datepicker";
import DatePicker, { registerLocale } from "react-datepicker";
import ModalImage from "react-modal-image";

import {
    Edit as IconEdit,
    Grid6 as IconExcel,
    ArrowDown2 as IconDown,
    Trash as IconDelete,
    SearchNormal1 as IconSearch,
    Add as IconAdd,
} from "iconsax-react";

import { BiEdit } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { VscFilePdf } from "react-icons/vsc";

import PopupEdit from "/components/UI/popup";
import Loading from "components/UI/loading";
import Pagination from "/components/UI/pagination";
import dynamic from "next/dynamic";
import moment from "moment/moment";
import Select, { components } from "react-select";
import Popup from "reactjs-popup";
import { data } from "autoprefixer";
import { useDispatch } from "react-redux";
import CreatableSelect from "react-select/creatable";

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
});

const Popup_chitiet = (props) => {
    const scrollAreaRef = useRef(null);
    const [open, sOpen] = useState(false);
    const _ToggleModal = (e) => sOpen(e);
    const [data, sData] = useState();
    const [onFetching, sOnFetching] = useState(false);

    useEffect(() => {
        props?.id && sOnFetching(true);
    }, [open]);

    const formatNumber = (number) => {
        if (!number && number !== 0) return 0;
        const integerPart = Math.floor(number);
        const decimalPart = number - integerPart;
        const roundedDecimalPart = decimalPart >= 0.05 ? 1 : 0;
        const roundedNumber = integerPart + roundedDecimalPart;
        return roundedNumber.toLocaleString("en");
    };

    const _ServerFetching_detailThere = () => {
        Axios(
            "GET",
            `/api_web/Api_expense_voucher/expenseVoucher/${props?.id}?csrf_protection=true`,
            {},
            (err, response) => {
                if (!err) {
                    var db = response.data;
                    sData(db);
                }
                sOnFetching(false);
            }
        );
    };

    useEffect(() => {
        onFetching && _ServerFetching_detailThere();
    }, [open]);

    return (
        <>
            <PopupEdit
                title={props.dataLang?.payment_detail || "payment_detail"}
                button={props?.name}
                onClickOpen={_ToggleModal.bind(this, true)}
                open={open}
                onClose={_ToggleModal.bind(this, false)}
                classNameBtn={props?.className}
            >
                <div className="flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]"></div>
                {/* <div className=" space-x-5 w-[530px] 3xl:h-auto  2xl:h-auto xl:h-[540px] h-[500px] ">         */}
                <div className=" space-x-5 w-[530px] h-auto">
                    <div>
                        <div className="w-[530px]">
                            {/* <div className="min:h-[170px] h-[72%] max:h-[100px]  customsroll overflow-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100"> */}
                            <div className="min:h-[170px] h-[72%] max:h-[100px]  customsroll overflow-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                <h2 className="font-semibold bg-[#ECF0F4] p-2 text-[13px]">
                                    {props.dataLang?.import_detail_info || "import_detail_info"}
                                </h2>
                                <div className="min-h-[130px] px-2 bg-gray-50 ">
                                    <div className="grid grid-cols-2 space-x-4 3xl:max-h-[400px] xxl:max-h-[300px] 2xl:max-h-[350px] xl:max-h-[300px] lg:max-h-[280px] max-h-[300px] scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                        <div className="col-span-1">
                                            <div className="my-4 font-semibold grid grid-cols-2">
                                                <h3 className=" text-[13px] ">
                                                    {props.dataLang?.import_day_vouchers || "import_day_vouchers"}
                                                </h3>
                                                <h3 className=" text-[13px]  font-medium">
                                                    {data?.date != null ? moment(data?.date).format("DD/MM/YYYY") : ""}
                                                </h3>
                                            </div>
                                            <div className="my-4 font-semibold grid grid-cols-2">
                                                <h3 className="text-[13px]">
                                                    {props.dataLang?.payment_creator || "payment_creator"}
                                                </h3>
                                                <div className="flex flex-wrap  gap-2 items-center justify-start relative">
                                                    <div className="relative">
                                                        <ModalImage
                                                            small={
                                                                data?.profile_image
                                                                    ? data?.profile_image
                                                                    : "/user-placeholder.jpg"
                                                            }
                                                            large={
                                                                data?.profile_image
                                                                    ? data?.profile_image
                                                                    : "/user-placeholder.jpg"
                                                            }
                                                            className="h-6 w-6 rounded-full object-cover"
                                                        />
                                                        {/* <img className='h-6 w-6 rounded-full object-cover' src={data?.profile_image ? data?.profile_image : '/user-placeholder.jpg'} alt=''></img> */}
                                                        <span className="h-1.5 w-1.5 absolute bottom-1/2 left-1/2 translate-x-[100%]">
                                                            <span className="inline-flex relative rounded-full h-1.5 w-1.5 bg-lime-500">
                                                                <span className="animate-ping  inline-flex h-full w-full rounded-full bg-lime-400 opacity-75 absolute"></span>
                                                            </span>
                                                        </span>
                                                    </div>
                                                    <h6 className="capitalize font-medium">{data?.staff_name}</h6>
                                                </div>
                                            </div>
                                            <div className=" font-semibold grid grid-cols-2">
                                                <h3 className=" text-[13px] ">
                                                    {props.dataLang?.payment_obType || "payment_obType"}
                                                </h3>
                                                {(data?.objects === "client" && (
                                                    <span className="flex items-center justify-center font-normal text-sky-500  rounded-xl py-1 px-1 bg-sky-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]">
                                                        {props.dataLang[data?.objects] || data?.objects}
                                                    </span>
                                                )) ||
                                                    (data?.objects === "supplier" && (
                                                        <span className=" flex items-center justify-center font-normal text-orange-500 rounded-xl py-1 px-1 bg-orange-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]  ">
                                                            {props.dataLang[data?.objects] || data?.objects}
                                                        </span>
                                                    )) ||
                                                    (data?.objects === "other" && (
                                                        <span className="flex items-center justify-center gap-1 font-normal text-lime-500  rounded-xl py-1 px-1 bg-lime-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]">
                                                            {props.dataLang[data?.objects] || data?.objects}
                                                        </span>
                                                    ))}
                                            </div>
                                            <div className="my-4 font-semibold grid grid-cols-2">
                                                <h3 className="text-[13px]">
                                                    {props.dataLang?.payment_typeOfDocument || "payment_typeOfDocument"}
                                                </h3>
                                                {(data?.type_vouchers === "import" && (
                                                    <span className="flex items-center justify-center font-normal text-purple-500  rounded-xl py-1 px-2 xl:min-w-[100px] min-w-[70px]  bg-purple-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]">
                                                        {props.dataLang[data?.type_vouchers] || data?.type_vouchers}
                                                    </span>
                                                )) ||
                                                    (data?.type_vouchers === "deposit" && (
                                                        <span className=" flex items-center justify-center font-normal text-cyan-500 rounded-xl py-1 px-2 xl:min-w-[100px] min-w-[70px]  bg-cyan-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]">
                                                            {props.dataLang[data?.type_vouchers] || data?.type_vouchers}
                                                        </span>
                                                    )) ||
                                                    (data?.type_vouchers === "service" && (
                                                        <span className="flex items-center justify-center gap-1 font-normal text-red-500  rounded-xl py-1 px-2 xl:min-w-[100px] min-w-[70px]  bg-rose-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]">
                                                            {props.dataLang[data?.type_vouchers] || data?.type_vouchers}
                                                        </span>
                                                    ))}
                                            </div>
                                        </div>
                                        <div className="col-span-1 ">
                                            <div className="my-4 font-semibold grid grid-cols-2">
                                                <h3 className=" text-[13px] ">
                                                    {props.dataLang?.payment_code || "payment_code"}
                                                </h3>
                                                <h3 className=" text-[13px]  font-medium text-blue-600">
                                                    {data?.code}
                                                </h3>
                                            </div>
                                            <div className="my-4 font-semibold grid grid-cols-2">
                                                <h3 className=" text-[13px] ">
                                                    {props.dataLang?.payment_TT_method || "payment_TT_method"}
                                                </h3>
                                                <h3 className=" text-[13px]  font-medium">{data?.payment_mode_name}</h3>
                                            </div>
                                            <div className="my-4 font-semibold grid grid-cols-2">
                                                <h3 className="text-[13px]">
                                                    {props.dataLang?.payment_ob || "payment_ob"}
                                                </h3>
                                                <div className="flex flex-wrap  gap-2 items-center justify-start">
                                                    <h3 className=" text-[13px]  font-medium">{data?.object_text}</h3>
                                                </div>
                                            </div>
                                            <div className=" font-semibold grid grid-cols-2">
                                                <h3 className=" text-[13px] ">{"Chi nhánh"}</h3>
                                                <h3 className="3xl:items-center 3xl-text-[16px] 2xl:text-[13px] xl:text-xs text-[8px] text-[#0F4F9E] font-[300] px-2 py-0.5 border border-[#0F4F9E] bg-white rounded-[5.5px] uppercase w-fit">
                                                    {data?.branch_name}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-4 font-semibold col-span-2 grid grid-cols-4 ">
                                        <h3 className=" text-[13px] col-span-1 ">
                                            {props.dataLang?.payment_voucherCode || "payment_voucherCode"}
                                        </h3>
                                        <div className="flex flex-wrap col-span-3 gap-2 items-center justify-start font-medium">
                                            {data?.voucher?.map((code, index) => (
                                                <React.Fragment key={code?.id}>
                                                    {code.code}
                                                    {index !== data?.voucher.length - 1 && ", "}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {data?.type_vouchers == "import" && data.tbDeductDeposit?.length > 0 && (
                                    <div className="col-span-12 border border-b-0 rounded m-1 transition-all duration-200 ease-linear">
                                        <div className="col-span-12 grid grid-cols-4 items-center divide-x border border-l-0 border-t-0 border-r-0">
                                            <h1 className="text-center text-xs p-1.5 text-zinc-800 font-semibold">
                                                {props.dataLang?.payment_numberEnterd || "payment_numberEnterd"}
                                            </h1>
                                            <h1 className="text-center text-xs p-1.5 text-zinc-800 font-semibold">
                                                {props.dataLang?.payment_numberSlips || "payment_numberSlips"}
                                            </h1>
                                            <h1 className="text-center text-xs p-1.5 text-zinc-800 font-semibold">
                                                {props.dataLang?.payment_deductionMoney || "payment_deductionMoney"}
                                            </h1>
                                            <h1 className="text-center text-xs p-1.5 text-zinc-800 font-semibold">
                                                {props.dataLang?.payment_cashInReturn || "payment_cashInReturn"}
                                            </h1>
                                        </div>
                                        <div
                                            className={`${
                                                data.tbDeductDeposit.length > 3 ? " h-[100px] overflow-auto" : ""
                                            } scrollbar-thin cursor-pointer scrollbar-thumb-slate-300 scrollbar-track-slate-100`}
                                        >
                                            {data.tbDeductDeposit.map((e) => {
                                                return (
                                                    <div className="col-span-12 grid grid-cols-4 items-center divide-x border-b">
                                                        <h1 className="text-center text-xs p-2 ">
                                                            <span className="py-1 px-2 bg-purple-200 text-purple-500 rounded-xl">
                                                                {e.import_code}
                                                            </span>
                                                        </h1>
                                                        <h1 className="text-center text-xs p-2">
                                                            <span className="py-1 px-2 bg-orange-200 text-orange-500 rounded-xl">
                                                                {e.payslip_code}
                                                            </span>
                                                        </h1>
                                                        <h1 className="text-center text-xs p-2">
                                                            {formatNumber(e.deposit_amount)}
                                                        </h1>
                                                        <h1 className="text-center text-xs p-2">
                                                            {formatNumber(e.amount_left)}
                                                        </h1>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                                <h2 className="font-semibold bg-[#ECF0F4]  p-1 2xl:text-[12px] xl:text-[13px] text-[12px]  w-full col-span-12 mt-0.5">
                                    {props.dataLang?.payment_costInfo || "payment_costInfo"}
                                </h2>
                                <div className=" w-[100%] lx:w-[110%] ">
                                    <div className={`grid-cols-5 grid sticky top-0  bg-white shadow-lg  z-10 rounded`}>
                                        <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-1  text-center">
                                            #
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-2  text-center">
                                            {props.dataLang?.payment_costs || "payment_costs"}
                                        </h4>
                                        <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-2 text-center">
                                            {props.dataLang?.payment_amountOfMoney || "payment_amountOfMoney"}
                                        </h4>
                                    </div>
                                    {onFetching ? (
                                        <Loading className="max-h-28" color="#0f4f9e" />
                                    ) : data?.detail?.length > 0 ? (
                                        <>
                                            <ScrollArea
                                                className="min-h-[90px] max-h-[170px] 2xl:max-h-[250px] overflow-hidden"
                                                speed={1}
                                                smoothScrolling={true}
                                            >
                                                <div className="divide-y divide-slate-200 min:h-[170px]  max:h-[170px]">
                                                    {data?.detail?.map((e, index) => (
                                                        <div
                                                            className="grid grid-cols-5 hover:bg-slate-50 items-center border-b"
                                                            key={e.id?.toString()}
                                                        >
                                                            <h6 className="text-[13px] col-span-1 font-medium  py-2  text-center break-words">
                                                                {index + 1}
                                                            </h6>
                                                            <h6 className="text-[13px] col-span-2 font-medium pl-2 py-2  text-left break-words">
                                                                {e?.costs_name}
                                                            </h6>
                                                            <h6 className="text-[13px] col-span-2 font-medium pl-2 py-2  text-center">
                                                                {formatNumber(e?.total)}
                                                            </h6>
                                                        </div>
                                                    ))}
                                                </div>
                                            </ScrollArea>
                                        </>
                                    ) : (
                                        <div className=" max-w-[352px] mt-24 mx-auto">
                                            <div className="text-center">
                                                <div className="bg-[#EBF4FF] rounded-[100%] inline-block ">
                                                    <IconSearch />
                                                </div>
                                                <h1 className="textx-[#141522] text-base opacity-90 font-medium">
                                                    {props.dataLang?.purchase_order_table_item_not_found ||
                                                        "purchase_order_table_item_not_found"}
                                                </h1>
                                                <div className="flex items-center justify-around mt-6 "></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <h2 className="font-semibold p-2 text-[13px]  border-b border-b-[#a9b5c5]  border-t z-10 border-t-[#a9b5c5]">
                                    {props.dataLang?.purchase_total || "purchase_total"}
                                </h2>
                                <div className=" mt-2  grid grid-cols-12 flex-col justify-between sticky bottom-0  z-10 ">
                                    <div className="col-span-7">
                                        <h3 className="text-[13px] font-semibold">
                                            {props.dataLang?.import_from_note || "import_from_note"}
                                        </h3>
                                        <textarea
                                            className="text-[13px] resize-none scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 placeholder:text-slate-300 w-[90%] min-h-[70px]  max-h-[70px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-medium p-1 outline-none "
                                            disabled
                                            value={data?.note}
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-1 text-right">
                                        <div className="font-semibold text-left text-[13px]">
                                            <h3>
                                                {props.dataLang?.import_detail_total_amount ||
                                                    "import_detail_total_amount"}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="col-span-3 space-y-1 text-right">
                                        <div className="font-medium mr-2.5">
                                            <h3 className="text-right text-blue-600 text-[13px]">
                                                {formatNumber(data?.total)}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </PopupEdit>
        </>
    );
};

export default Popup_chitiet;
