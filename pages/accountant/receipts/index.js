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
import "react-datepicker/dist/react-datepicker.css";
import Datepicker from "react-tailwindcss-datepicker";
import ModalImage from "react-modal-image";
import {
    Edit as IconEdit,
    Grid6 as IconExcel,
    ArrowDown2 as IconDown,
    Trash as IconDelete,
    SearchNormal1 as IconSearch,
    Add as IconAdd,
    Refresh2,
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
import { useSelector } from "react-redux";
import Popup_chitietThere from "../detailThere";
import FilePDF from "../FilePDF";
import Popup_chitiet from "./(popup)/detail";
import Popup_dspt from "./(popup)/popup";
import styleDatePicker from "components/UI/configs/configDatePicker";
import configSelectFillter from "components/UI/configs/configSelectFillter";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
});

const Index = (props) => {
    const dataLang = props.dataLang;
    const router = useRouter();
    const trangthaiExprired = useSelector((state) => state?.trangthaiExprired);
    const [fetching, sFetching] = useState({
        onFetching: false,
        onFetching_filter: false,
    });
    const updateFetch = (e) => sFetching((i) => ({ ...i, ...e }));
    const [keySearch, sKeySearch] = useState("");
    const [limit, sLimit] = useState(15);
    const [total, sTotal] = useState({});
    const [data, sData] = useState({});
    const [data_ex, sData_ex] = useState([]);
    const [listBr, sListBr] = useState([]);
    const [totalItem, sTotalItems] = useState([]);
    const [dataMethod, sDataMethod] = useState([]);
    const [dataObject, sDataObject] = useState([]);
    const [value, sValue] = useState({
        idBranch: null,
        idObject: null,
        idMethod: null,
        valueDate: {
            startDate: null,
            endDate: null,
        },
    });
    const _HandleFresh = () => {
        sFetching((e) => ({ ...e, onFetching: true, onFetching_filter: true }));
    };
    useEffect(() => {
        router.push({
            pathname: router.route,
            query: { tab: router.query?.tab ? router.query?.tab : 0 },
        });
    }, []);

    const _ServerFetching = () => {
        Axios(
            "GET",
            `/api_web/Api_expense_voucher/expenseVoucher/?csrf_protection=true`,
            {
                params: {
                    limit: limit,
                    page: router.query?.page || 1,
                    "filter[branch_id]": value.idBranch != null ? value.idBranch.value : null,
                    "filter[start_date]": value.valueDate?.startDate != null ? value.valueDate?.startDate : null,
                    "filter[end_date]": value.valueDate?.endDate != null ? value.valueDate?.endDate : null,
                    "filter[payment_mode]": value.idMethod != null ? value.idMethod.value : null,
                    "filter[objects]": value.idObject != null ? value.idObject.value : null,
                    "filter[search]": keySearch,
                },
            },
            (err, response) => {
                if (!err) {
                    var { rResult, output, rTotal } = response.data;
                    sData(rResult);
                    sTotalItems(output);
                    sData_ex(rResult);
                    sTotal(rTotal);
                }
                updateFetch({ onFetching: false });
            }
        );
    };

    const _ServerFetching_filter = () => {
        Axios("GET", `/api_web/Api_Branch/branchCombobox/?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                var { isSuccess, result } = response.data;
                sListBr(result?.map((e) => ({ label: e.name, value: e.id })));
            }
        });
        Axios("GET", "/api_web/Api_payment_method/payment_method/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                var { rResult } = response.data;
                sDataMethod(rResult?.map((e) => ({ label: e?.name, value: e?.id })));
            }
        });
        Axios("GET", "/api_web/Api_expense_voucher/object/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                var data = response.data;
                sDataObject(
                    data?.map((e) => ({
                        label: dataLang[e?.name],
                        value: e?.id,
                    }))
                );
            }
        });
        updateFetch({ onFetching_filter: false });
    };

    useEffect(() => {
        fetching.onFetching_filter && _ServerFetching_filter();
    }, [fetching.onFetching_filter]);

    const _HandleOnChangeKeySearch = ({ target: { value } }) => {
        sKeySearch(value);
        router.replace({
            pathname: router.route,
            query: {
                tab: router.query?.tab,
            },
        });
        setTimeout(() => {
            if (!value) {
                sOnFetching(true);
            }
            sOnFetching(true);
        }, 500);
    };

    const paginate = (pageNumber) => {
        const queryParams = { ...router.query, page: pageNumber };
        router.push({
            pathname: router.route,
            query: queryParams,
        });
    };

    useEffect(() => {
        fetching.onFetching && _ServerFetching();
    }, [fetching.onFetching]);

    useEffect(() => {
        (router.query.tab && updateFetch({ onFetching: true })) ||
            (keySearch && updateFetch({ onFetching: true })) ||
            (router.query?.tab && updateFetch({ onFetching_filter: true }));
    }, [limit, router.query?.page, router.query?.tab]);

    useEffect(() => {
        if (
            value.idBranch != null ||
            (value.valueDate.startDate != null && value.valueDate.endDate != null) ||
            value.idMethod != null ||
            value.idObject != null
        ) {
            router.push({
                pathname: router.route,
                query: {
                    tab: router.query?.tab,
                },
            });
            setTimeout(() => {
                (value.idBranch != null && updateFetch({ onFetching: true })) ||
                    (value.valueDate.startDate != null &&
                        value.valueDate.endDate != null &&
                        updateFetch({ onFetching: true })) ||
                    (value.idMethod != null && updateFetch({ onFetching: true })) ||
                    (value.idObject != null && updateFetch({ onFetching: true }));
            }, 300);
        } else {
            updateFetch({ onFetching: true });
        }
    }, [value.idBranch, value.valueDate.endDate, value.valueDate.startDate, value.idMethod, value.idObject]);

    const formatNumber = (number) => {
        if (!number && number !== 0) return 0;
        const integerPart = Math.floor(number);
        const decimalPart = number - integerPart;
        const roundedDecimalPart = decimalPart >= 0.05 ? 1 : 0;
        const roundedNumber = integerPart + roundedDecimalPart;
        return roundedNumber.toLocaleString("en");
    };

    const multiDataSet = [
        {
            columns: [
                {
                    title: "ID",
                    width: { wch: 4 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.payment_date || "payment_date"}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.payment_code || "payment_code"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.payment_obType || "payment_obType"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.payment_ob || "payment_ob"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.payment_typeOfDocument || "payment_typeOfDocument"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.payment_voucherCode || "payment_voucherCode"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.payment_TT_method || "payment_TT_method"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.payment_costs || "payment_costs"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.payment_amountOfMoney || "payment_amountOfMoney"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.payment_creator || "payment_creator"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.payment_branch || "payment_branch"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.payment_note || "payment_note"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
            ],

            data: data_ex?.map((e) => [
                { value: `${e?.id ? e.id : ""}`, style: { numFmt: "0" } },
                { value: `${e?.date ? e?.date : ""}` },
                { value: `${e?.code ? e?.code : ""}` },
                {
                    value: `${e?.objects ? (dataLang[e.objects] !== undefined ? dataLang[e.objects] : "") : ""}`,
                },
                { value: `${e?.object_text ? e?.object_text : ""}` },
                {
                    value: `${
                        e?.type_vouchers
                            ? dataLang[e?.type_vouchers] != undefined
                                ? dataLang[e?.type_vouchers]
                                : ""
                            : ""
                    }`,
                },
                {
                    value: `${e?.voucher_code ? e?.voucher_code.join(", ") : ""}`,
                },
                {
                    value: `${e?.payment_mode_name ? e?.payment_mode_name : ""}`,
                },
                { value: `${e?.cost_name ? e?.cost_name?.join(", ") : ""}` },
                { value: `${e?.total ? formatNumber(e?.total) : ""}` },
                { value: `${e?.staff_name ? e?.staff_name : ""}` },
                { value: `${e?.branch_name ? e?.branch_name : ""}` },
                { value: `${e?.note ? e?.note : ""}` },
            ]),
        },
    ];

    return (
        <React.Fragment>
            <Head>
                <title>{"Phiếu thu"}</title>
            </Head>
            <div className="px-10 xl:pt-24 pt-[88px] pb-10 space-y-4 overflow-hidden h-screen">
                {trangthaiExprired ? (
                    <div className="p-2"></div>
                ) : (
                    <div className="flex space-x-3 xl:text-[14.5px] text-[12px]">
                        <h6 className="text-[#141522]/40">{"Phiếu thu"}</h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{"Phiếu thu"}</h6>
                    </div>
                )}

                <div className="grid grid-cols gap-5 h-[99%] overflow-hidden">
                    <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden">
                        <div className="space-y-3 h-[96%] overflow-hidden">
                            <div className="flex justify-between">
                                <h2 className="text-2xl text-[#52575E] capitalize">{"Phiếu thu"}</h2>
                                <div className="flex justify-end items-center">
                                    <Popup_dspt
                                        onRefresh={_ServerFetching.bind(this)}
                                        dataLang={dataLang}
                                        className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 2xl:h-[95%] h-[92%] overflow-hidden">
                                <div className="xl:space-y-3 space-y-2">
                                    <div className="bg-slate-100 w-full rounded grid grid-cols-8 justify-between xl:p-3 p-2">
                                        <div className="col-span-7">
                                            <div className="grid grid-cols-10 items-center space-x-1">
                                                <div className="col-span-2">
                                                    <form className="flex items-center relative ">
                                                        <IconSearch className="absolute 3xl:h-[20px] 2xl:h-[20px] xl:h-[19px] lg:h-[18px] 3xl:w-[20px] 2xl:w-[18px] xl:w-[19px] lg:w-[18px] z-10 3xl:left-[4%] 2xl:left-[4%] xl:left-[8%] lg:left-[10%] text-[#cccccc]" />
                                                        <input
                                                            className="3xl:text-[16px] 2xl:text-[16px] xl:text-[13px] lg:text-[12px] 3xl:h-[40px] 2xl:h-[40px] xl:h-[38px] lg:h-[39px]  2xl:text-left 2xl:pl-10 xl:pl-0 p-0 2xl:py-1.5  xl:py-2.5 lg:py-[11px] rounded 2xl:text-base text-xs xl:text-center text-center 2xl:w-full xl:w-[199px] lg:w-[160px]  relative bg-white  outline-[#D0D5DD] focus:outline-[#0F4F9E] "
                                                            type="text"
                                                            onChange={_HandleOnChangeKeySearch.bind(this)}
                                                            placeholder={dataLang?.branch_search}
                                                        />
                                                    </form>
                                                </div>
                                                <div className="col-span-2">
                                                    <Select
                                                        options={[
                                                            {
                                                                value: "",
                                                                label:
                                                                    dataLang?.payment_select_branch ||
                                                                    "payment_select_branch",
                                                                isDisabled: true,
                                                            },
                                                            ...listBr,
                                                        ]}
                                                        value={value.idBranch}
                                                        onChange={(e) => sValue((i) => ({ ...i, idBranch: e }))}
                                                        placeholder={dataLang?.client_list_filterbrand}
                                                        {...configSelectFillter}
                                                    />
                                                </div>
                                                <div className=" col-span-2">
                                                    <Select
                                                        options={[
                                                            {
                                                                value: "",
                                                                label:
                                                                    dataLang?.payment_TT_method || "payment_TT_method",
                                                                isDisabled: true,
                                                            },
                                                            ...dataMethod,
                                                        ]}
                                                        onChange={(e) => sValue((i) => ({ ...i, idMethod: e }))}
                                                        value={value.idMethod}
                                                        placeholder={dataLang?.payment_TT_method || "payment_TT_method"}
                                                        {...configSelectFillter}
                                                    />
                                                </div>
                                                <div className=" col-span-2">
                                                    <Select
                                                        options={[
                                                            {
                                                                value: "",
                                                                label:
                                                                    dataLang?.payment_select_ob || "payment_select_ob",
                                                                isDisabled: true,
                                                            },
                                                            ...dataObject,
                                                        ]}
                                                        onChange={(e) => sValue((i) => ({ ...i, idObject: e }))}
                                                        value={value.idObject}
                                                        placeholder={dataLang?.payment_ob || "payment_ob"}
                                                        {...configSelectFillter}
                                                    />
                                                </div>
                                                <div className="z-20 col-span-2">
                                                    <Datepicker
                                                        {...styleDatePicker}
                                                        value={value.valueDate}
                                                        onChange={(e) => sValue((i) => ({ ...i, valueDate: e }))}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-1">
                                            <div className="flex justify-end items-center gap-2">
                                                <button
                                                    onClick={_HandleFresh.bind(this)}
                                                    type="button"
                                                    className="bg-green-50 hover:bg-green-200 hover:scale-105 group p-2 rounded-md transition-all ease-in-out animate-pulse hover:animate-none"
                                                >
                                                    <Refresh2
                                                        className="group-hover:-rotate-45 transition-all ease-in-out "
                                                        size="22"
                                                        color="green"
                                                    />
                                                </button>
                                                <div>
                                                    {data_ex?.length > 0 && (
                                                        <ExcelFile
                                                            filename="Danh phiếu thu"
                                                            title="DSPT"
                                                            element={
                                                                <button className="xl:px-4 px-3 xl:py-2.5 py-1.5 2xl:text-xs xl:text-xs text-[7px] flex items-center space-x-2 bg-[#C7DFFB] rounded hover:scale-105 transition">
                                                                    <IconExcel
                                                                        className="2xl:scale-100 xl:scale-100 scale-75"
                                                                        size={18}
                                                                    />
                                                                    <span>{dataLang?.client_list_exportexcel}</span>
                                                                </button>
                                                            }
                                                        >
                                                            <ExcelSheet
                                                                dataSet={multiDataSet}
                                                                data={multiDataSet}
                                                                name="Organization"
                                                            />
                                                        </ExcelFile>
                                                    )}
                                                </div>
                                                <div className="">
                                                    <div className="font-[300] text-slate-400 2xl:text-xs xl:text-sm text-[8px]">
                                                        {dataLang?.display}
                                                    </div>
                                                    <select
                                                        className="outline-none  text-[10px] xl:text-xs 2xl:text-sm"
                                                        onChange={(e) => sLimit(e.target.value)}
                                                        value={limit}
                                                    >
                                                        <option
                                                            className="text-[10px] xl:text-xs 2xl:text-sm hidden"
                                                            disabled
                                                        >
                                                            {limit == -1 ? "Tất cả" : limit}
                                                        </option>
                                                        <option
                                                            className="text-[10px] xl:text-xs 2xl:text-sm"
                                                            value={15}
                                                        >
                                                            15
                                                        </option>
                                                        <option
                                                            className="text-[10px] xl:text-xs 2xl:text-sm"
                                                            value={20}
                                                        >
                                                            20
                                                        </option>
                                                        <option
                                                            className="text-[10px] xl:text-xs 2xl:text-sm"
                                                            value={40}
                                                        >
                                                            40
                                                        </option>
                                                        <option
                                                            className="text-[10px] xl:text-xs 2xl:text-sm"
                                                            value={60}
                                                        >
                                                            60
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="min:h-[200px] h-[88%] max:h-[500px]  overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                    <div className="pr-2 w-[100%] lx:w-[110%] ">
                                        <div className="grid grid-cols-13 items-center sticky top-0  p-2 z-10 rounded-xl shadow-sm bg-white divide-x">
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center whitespace-nowrap">
                                                {dataLang?.payment_date || "payment_date"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center whitespace-nowrap">
                                                {dataLang?.payment_code || "payment_code"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center whitespace-nowrap">
                                                {dataLang?.payment_obType || "payment_obType"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center whitespace-nowrap">
                                                {dataLang?.payment_ob || "payment_ob"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center whitespace-nowrap">
                                                {dataLang?.payment_typeOfDocument || "payment_typeOfDocument"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center whitespace-nowrap">
                                                {dataLang?.payment_voucherCode || "payment_voucherCode"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center whitespace-nowrap">
                                                {"PTTT"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center whitespace-nowrap">
                                                {dataLang?.payment_costs || "payment_costs"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center whitespace-nowrap">
                                                {dataLang?.payment_amountOfMoney || "payment_amountOfMoney"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center whitespace-nowrap">
                                                {dataLang?.payment_creator || "payment_creator"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center whitespace-nowrap">
                                                {dataLang?.payment_branch || "payment_branch"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center whitespace-nowrap">
                                                {dataLang?.payment_note || "payment_note"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center whitespace-nowrap">
                                                {dataLang?.payment_action || "payment_action"}
                                            </h4>
                                        </div>
                                        {fetching.onFetching ? (
                                            <Loading className="h-80" color="#0f4f9e" />
                                        ) : data?.length > 0 ? (
                                            <>
                                                <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px]">
                                                    {data?.map((e) => (
                                                        <div
                                                            className="grid grid-cols-13 items-center py-1.5 px-2 hover:bg-slate-100/40 "
                                                            key={e.id.toString()}
                                                        >
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600  rounded-md text-center">
                                                                {e?.date != null
                                                                    ? moment(e?.date).format("DD/MM/YYYY")
                                                                    : ""}
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] hover:text-blue-600 transition-all ease-in-out  rounded-md text-center text-[#0F4F9E]">
                                                                <Popup_chitiet
                                                                    dataLang={dataLang}
                                                                    className="text-center"
                                                                    name={e?.code}
                                                                    id={e?.id}
                                                                />
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600  col-span-1 flex items-center w-fit mx-auto">
                                                                <div className="mx-auto">
                                                                    {(e?.objects === "client" && (
                                                                        <span className="flex items-center justify-center font-normal text-sky-500  rounded-xl py-1 px-2 xl:min-w-[100px] min-w-[70px]  bg-sky-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]">
                                                                            {dataLang[e?.objects] || e?.objects}
                                                                        </span>
                                                                    )) ||
                                                                        (e?.objects === "supplier" && (
                                                                            <span className=" flex items-center justify-center font-normal text-orange-500 rounded-xl py-1 px-2 xl:min-w-[100px] min-w-[70px]  bg-orange-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]">
                                                                                {dataLang[e?.objects] || e?.objects}
                                                                            </span>
                                                                        )) ||
                                                                        (e?.objects === "other" && (
                                                                            <span className="flex items-center justify-center gap-1 font-normal text-lime-500  rounded-xl py-1 px-2 xl:min-w-[100px] min-w-[70px]  bg-lime-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]">
                                                                                {dataLang[e?.objects] || e?.objects}
                                                                            </span>
                                                                        ))}
                                                                </div>
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 py-1  rounded-md text-left">
                                                                {e?.object_text}
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600  col-span-1 flex items-center w-fit mx-auto">
                                                                <div className="mx-auto">
                                                                    {(e?.type_vouchers === "import" && (
                                                                        <span className="flex items-center justify-center font-normal text-purple-500  rounded-xl py-1 px-2 xl:min-w-[100px] min-w-[70px]  bg-purple-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]">
                                                                            {dataLang[e?.type_vouchers] ||
                                                                                e?.type_vouchers}
                                                                        </span>
                                                                    )) ||
                                                                        (e?.type_vouchers === "deposit" && (
                                                                            <span className=" flex items-center justify-center font-normal text-cyan-500 rounded-xl py-1 px-2 xl:min-w-[100px] min-w-[70px]  bg-cyan-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]">
                                                                                {dataLang[e?.type_vouchers] ||
                                                                                    e?.type_vouchers}
                                                                            </span>
                                                                        )) ||
                                                                        (e?.type_vouchers === "service" && (
                                                                            <span className="flex items-center justify-center gap-1 font-normal text-red-500  rounded-xl py-1 px-2 xl:min-w-[100px] min-w-[70px]  bg-rose-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]">
                                                                                {dataLang[e?.type_vouchers] ||
                                                                                    e?.type_vouchers}
                                                                            </span>
                                                                        ))}
                                                                </div>
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] hover:text-blue-600 transition-all ease-in-out px-2 py-1  rounded-md text-center text-[#0F4F9E]">
                                                                {e?.voucher?.map((code, index) => (
                                                                    <React.Fragment key={code.id}>
                                                                        <Popup_chitietThere
                                                                            key={code?.id}
                                                                            dataLang={dataLang}
                                                                            className="text-left"
                                                                            type={code.voucher_type}
                                                                            id={code.id}
                                                                            name={code?.code}
                                                                        >
                                                                            {code?.code}
                                                                        </Popup_chitietThere>
                                                                    </React.Fragment>
                                                                ))}
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 py-1  rounded-md text-center">
                                                                {e?.payment_mode_name}
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 py-1  rounded-md text-left">
                                                                {e?.cost_name?.map((code, index) => (
                                                                    <React.Fragment key={code}>
                                                                        {code}
                                                                        {index !== e.cost_name.length - 1 && ", "}
                                                                    </React.Fragment>
                                                                ))}
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 py-1  rounded-md text-right">
                                                                {formatNumber(e?.total)}
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 py-1  rounded-md text-left flex items-center space-x-1">
                                                                <div className="relative">
                                                                    <ModalImage
                                                                        small={
                                                                            e?.profile_image
                                                                                ? e?.profile_image
                                                                                : "/user-placeholder.jpg"
                                                                        }
                                                                        large={
                                                                            e?.profile_image
                                                                                ? e?.profile_image
                                                                                : "/user-placeholder.jpg"
                                                                        }
                                                                        className="h-6 w-6 rounded-full object-cover "
                                                                    />
                                                                    <span className="h-2 w-2 absolute 3xl:bottom-full 3xl:translate-y-[150%] 3xl:left-1/2  3xl:translate-x-[100%] 2xl:bottom-[80%] 2xl:translate-y-full 2xl:left-1/2 bottom-[50%] left-1/2 translate-x-full translate-y-full">
                                                                        <span className="inline-flex relative rounded-full h-2 w-2 bg-lime-500">
                                                                            <span className="animate-ping  inline-flex h-full w-full rounded-full bg-lime-400 opacity-75 absolute"></span>
                                                                        </span>
                                                                    </span>
                                                                </div>
                                                                <h6 className="capitalize">{e?.staff_name}</h6>
                                                            </h6>
                                                            <h6 className="col-span-1 w-fit ">
                                                                <div className="cursor-default 3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[8px] text-[#0F4F9E] font-[300] px-1.5 py-0.5 border border-[#0F4F9E] bg-white rounded-[5.5px] uppercase">
                                                                    {e?.branch_name}
                                                                </div>
                                                            </h6>
                                                            <h6 className="2xl:text-base xl:text-xs text-[8px]  px-2 py-0.5 col-span-1  rounded-md text-left truncate">
                                                                {e?.note}
                                                            </h6>
                                                            <div className="col-span-1 flex justify-center">
                                                                <BtnTacVu
                                                                    type="payment"
                                                                    onRefresh={_ServerFetching.bind(this)}
                                                                    dataLang={dataLang}
                                                                    id={e?.id}
                                                                    className="bg-slate-100 xl:px-4 px-3 xl:py-1.5 py-1 rounded 2xl:text-base xl:text-xs text-[8px]"
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            <div className=" max-w-[352px] mt-24 mx-auto">
                                                <div className="text-center">
                                                    <div className="bg-[#EBF4FF] rounded-[100%] inline-block ">
                                                        <IconSearch />
                                                    </div>
                                                    <h1 className="textx-[#141522] text-base opacity-90 font-medium">
                                                        Không tìm thấy các mục
                                                    </h1>
                                                    <div className="flex items-center justify-around mt-6 "></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-13 bg-gray-100 items-center">
                            <div className="col-span-8 p-2 text-center">
                                <h3 className="uppercase font-normal 2xl:text-base xl:text-xs text-[8px]">
                                    {dataLang?.purchase_order_table_total_outside ||
                                        "purchase_order_table_total_outside"}
                                </h3>
                            </div>
                            <div className="col-span-1 text-right justify-end p-2 flex gap-2 flex-wrap">
                                <h3 className="font-normal 2xl:text-base xl:text-xs text-[8px]">
                                    {formatNumber(total?.sum_total)}
                                </h3>
                            </div>
                        </div>
                        {data?.length != 0 && (
                            <div className="flex space-x-5 items-center">
                                <h6>
                                    {dataLang?.display} {totalItem?.iTotalDisplayRecords} {dataLang?.among}{" "}
                                    {totalItem?.iTotalRecords} {dataLang?.ingredient}
                                </h6>
                                <Pagination
                                    postsPerPage={limit}
                                    totalPosts={Number(totalItem?.iTotalDisplayRecords)}
                                    paginate={paginate}
                                    currentPage={router.query?.page || 1}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

const BtnTacVu = React.memo((props) => {
    const [openTacvu, sOpenTacvu] = useState(false);
    const _ToggleModal = (e) => sOpenTacvu(e);

    const [dataCompany, setDataCompany] = useState();
    const [data, setData] = useState();

    const fetchDataSettingsCompany = () => {
        if (props?.id) {
            Axios("GET", `/api_web/Api_setting/CompanyInfo?csrf_protection=true`, {}, (err, response) => {
                if (!err) {
                    var { data } = response.data;
                    setDataCompany(data);
                }
            });
        }
        if (props?.id) {
            Axios(
                "GET",
                `/api_web/Api_expense_voucher/expenseVoucher/${props?.id}?csrf_protection=true`,
                {},
                (err, response) => {
                    if (!err) {
                        var db = response.data;
                        setData(db);
                    }
                }
            );
        }
    };
    useEffect(() => {
        openTacvu && fetchDataSettingsCompany();
    }, [openTacvu]);

    const _HandleDelete = (id) => {
        Swal.fire({
            title: `${props.dataLang?.aler_ask}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#296dc1",
            cancelButtonColor: "#d33",
            confirmButtonText: `${props.dataLang?.aler_yes}`,
            cancelButtonText: `${props.dataLang?.aler_cancel}`,
        }).then((result) => {
            if (result.isConfirmed) {
                Axios(
                    "DELETE",
                    `/api_web/Api_expense_voucher/expenseVoucher/${id}?csrf_protection=true`,
                    {},
                    (err, response) => {
                        if (!err) {
                            var { isSuccess, message } = response.data;
                            if (isSuccess) {
                                Toast.fire({
                                    icon: "success",
                                    title: props.dataLang[message],
                                });
                                props.onRefresh && props.onRefresh();
                            } else {
                                Toast.fire({
                                    icon: "error",
                                    title: props.dataLang[message],
                                });
                            }
                        }
                    }
                );
            }
        });
    };

    return (
        <div>
            <Popup
                trigger={
                    <button type="button" className={`flex space-x-1 items-center ` + props.className}>
                        <span>{props.dataLang?.purchase_action || "purchase_action"}</span>
                        <IconDown size={12} />
                    </button>
                }
                arrow={false}
                position="bottom right"
                className={`dropdown-edit `}
                keepTooltipInside={props.keepTooltipInside}
                closeOnDocumentClick
                nested
                onOpen={_ToggleModal.bind(this, true)}
                onClose={_ToggleModal.bind(this, false)}
                open={openTacvu}
            >
                <div className="w-auto rounded">
                    <div className="bg-white rounded-t flex flex-col overflow-hidden">
                        <div className="group transition-all ease-in-out flex items-center  gap-2  2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 ">
                            <BiEdit
                                size={20}
                                className="group-hover:text-sky-500 group-hover:scale-110 group-hover:shadow-md "
                            />
                            <Popup_dspt
                                onRefresh={props.onRefresh}
                                dataLang={props.dataLang}
                                id={props?.id}
                                className=" 2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer  rounded "
                            >
                                {props.dataLang?.purchase_order_table_edit || "purchase_order_table_edit"}
                            </Popup_dspt>
                        </div>
                        <div className=" transition-all ease-in-out flex items-center gap-2 group  2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5  rounded py-2.5 w-full">
                            <VscFilePdf
                                size={20}
                                className="group-hover:text-[#65a30d] group-hover:scale-110 group-hover:shadow-md "
                            />
                            <Popup_Pdf
                                type={props.type}
                                props={props}
                                id={props.id}
                                dataLang={props.dataLang}
                                className="group-hover:text-[#65a30d] "
                            />
                        </div>
                        <button
                            onClick={_HandleDelete.bind(this, props.id)}
                            className="group transition-all ease-in-out flex items-center gap-2  2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 w-full"
                        >
                            <RiDeleteBin6Line
                                size={20}
                                className="group-hover:text-[#f87171] group-hover:scale-110 group-hover:shadow-md "
                            />
                            <p className="group-hover:text-[#f87171]">
                                {props.dataLang?.purchase_deleteVoites || "purchase_deleteVoites"}
                            </p>
                        </button>
                    </div>
                </div>
            </Popup>
        </div>
    );
});

const Popup_Pdf = (props) => {
    const scrollAreaRef = useRef(null);
    const [open, sOpen] = useState(false);
    const _ToggleModal = (e) => sOpen(e);
    const [data, sData] = useState();
    const [onFetching, sOnFetching] = useState(false);

    useEffect(() => {
        props?.id && sOnFetching(true);
    }, [open]);

    const [dataPDF, setData] = useState();
    const [dataCompany, setDataCompany] = useState();

    const fetchDataSettingsCompany = () => {
        if (props?.id) {
            Axios("GET", `/api_web/Api_setting/CompanyInfo?csrf_protection=true`, {}, (err, response) => {
                if (!err) {
                    var { data } = response.data;
                    setDataCompany(data);
                }
            });
        }
        if (props?.id) {
            Axios(
                "GET",
                `/api_web/Api_expense_voucher/expenseVoucher/${props?.id}?csrf_protection=true`,
                {},
                (err, response) => {
                    if (!err) {
                        var db = response.data;
                        setData(db);
                    }
                }
            );
        }
    };
    useEffect(() => {
        open && fetchDataSettingsCompany();
    }, [open]);

    return (
        <>
            <PopupEdit
                title={props.dataLang?.option_prin || "option_prin"}
                button={props.dataLang?.btn_table_print || "btn_table_print"}
                onClickOpen={_ToggleModal.bind(this, true)}
                open={open}
                onClose={_ToggleModal.bind(this, false)}
                classNameBtn={props?.className}
            >
                <div className="flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]"></div>
                <div className="space-x-5 w-[400px] h-auto">
                    <div>
                        <div className="w-[400px]">
                            <FilePDF
                                props={props}
                                openAction={open}
                                setOpenAction={sOpen}
                                dataCompany={dataCompany}
                                data={dataPDF}
                            />
                        </div>
                    </div>
                </div>
            </PopupEdit>
        </>
    );
};

export default Index;
