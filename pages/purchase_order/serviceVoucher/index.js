import React, { useRef, useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Link from "next/link";
import ModalImage from "react-modal-image";
import "react-datepicker/dist/react-datepicker.css";
import { NumericFormat } from "react-number-format";
import {
    Grid6 as IconExcel,
    Filter as IconFilter,
    Calendar as IconCalendar,
    SearchNormal1 as IconSearch,
    ArrowDown2 as IconDown,
    ArrowCircleDown,
    Minus,
    Edit as IconEdit,
    Add,
    Trash as IconDelete,
    TickCircle,
    Refresh2,
} from "iconsax-react";
import Select from "react-select";

import "react-datepicker/dist/react-datepicker.css";
import Datepicker from "react-tailwindcss-datepicker";

import DatePicker, { registerLocale } from "react-datepicker";
import { MdClear } from "react-icons/md";
import { BsCalendarEvent } from "react-icons/bs";

import Popup from "reactjs-popup";
import moment from "moment/moment";
import vi from "date-fns/locale/vi";
registerLocale("vi", vi);

const ScrollArea = dynamic(() => import("react-scrollbar"), {
    ssr: false,
});

import PopupEdit from "/components/UI/popup";
import Loading from "components/UI/loading";
import { _ServerInstance as Axios } from "/services/axios";
import Pagination from "/components/UI/pagination";

import { BiEdit } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";

import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";
import ReactExport from "react-data-export";
import { useEffect } from "react";
import FilePDF from "../FilePDF";
import ExpandableContent from "components/UI/more";
import Popup_chitiet from "./(popup)/detail";
import Popup_servie from "./(popup)/popup";
import { useSelector } from "react-redux";
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

    const [data, sData] = useState([]);
    const [dataExcel, sDataExcel] = useState([]);

    const [onFetching, sOnFetching] = useState(false);
    const [onFetching_filter, sOnFetching_filter] = useState(false);

    const [onSending, sOnSending] = useState(false);

    const [totalItems, sTotalItems] = useState([]);
    const [keySearch, sKeySearch] = useState("");
    const [limit, sLimit] = useState(15);

    const [listBr, sListBr] = useState([]);

    const [listDs, sListDs] = useState();
    const [dataCode, sDataCode] = useState([]);

    const [idCode, sIdCode] = useState(null);
    const [idBranch, sIdBranch] = useState(null);
    const [valueDate, sValueDate] = useState({
        startDate: null,
        endDate: null,
    });

    const _HandleSelectTab = (e) => {
        router.push({
            pathname: router.route,
            query: { tab: e },
        });
    };
    useEffect(() => {
        router.push({
            pathname: router.route,
            query: { tab: router.query?.tab ? router.query?.tab : "all" },
        });
    }, []);

    const _ServerFetching = async () => {
        const tabPage = router.query?.tab;
        await Axios(
            "GET",
            `/api_web/Api_service/service/?csrf_protection=true`,
            {
                params: {
                    search: keySearch,
                    limit: limit,
                    page: router.query?.page || 1,
                    "filter[status_bar]": tabPage ? tabPage : null,
                    "filter[id]": idCode != null ? idCode?.value : null,
                    "filter[branch_id]":
                        idBranch != null ? idBranch.value : null,
                    "filter[start_date]":
                        valueDate?.startDate != null
                            ? valueDate?.startDate
                            : null,
                    "filter[end_date]":
                        valueDate?.endDate != null ? valueDate?.endDate : null,
                },
            },
            (err, response) => {
                if (!err) {
                    var { rResult, output, rTotal } = response.data;
                    sData(rResult);
                    sTotalItems(output);
                    sDataExcel(rResult);
                }
                sOnFetching(false);
            }
        );
    };

    const onchang_filter = (type, value) => {
        if (type == "branch") {
            sIdBranch(value);
        } else if (type == "code") {
            sIdCode(value);
        } else if (type == "date") {
            sValueDate(value);
        }
    };

    const _ServerFetching_filter = async () => {
        await Axios(
            "GET",
            `/api_web/Api_Branch/branchCombobox/?csrf_protection=true`,
            {},
            (err, response) => {
                if (!err) {
                    var { isSuccess, result } = response.data;
                    sListBr(
                        result?.map((e) => ({ label: e.name, value: e.id }))
                    );
                }
            }
        );
        await Axios(
            "GET",
            `/api_web/Api_service/serviceCombobox/?csrf_protection=true`,
            {},
            (err, response) => {
                if (!err) {
                    var { isSuccess, result } = response.data;
                    sDataCode(
                        result?.map((e) => ({ label: e?.code, value: e?.id }))
                    );
                }
            }
        );
        await Axios(
            "GET",
            `/api_web/Api_staff/staffOption?csrf_protection=true`,
            {},
            (err, response) => {
                if (!err) {
                    var { rResult } = response.data;
                    sListUser(rResult);
                }
            }
        );
        sOnFetching_filter(false);
    };

    useEffect(() => {
        onFetching_filter && _ServerFetching_filter();
    }, [onFetching_filter]);

    const _HandleSeachApi = async (inputValue) => {
        await Axios(
            "POST",
            `/api_web/Api_service/serviceCombobox/?csrf_protection=true`,
            {
                data: {
                    term: inputValue,
                },
            },
            (err, response) => {
                if (!err) {
                    var { isSuccess, result } = response?.data;
                    sDataCode(
                        result?.map((e) => ({ label: e?.code, value: e?.id }))
                    );
                }
            }
        );
    };

    const _ServerFetching_group = async () => {
        await Axios(
            "GET",
            `/api_web/Api_service/filterBar/?csrf_protection=true`,
            {
                params: {
                    limit: 0,
                    search: keySearch,
                    "filter[id]": idCode != null ? idCode?.value : null,
                    "filter[branch_id]":
                        idBranch != null ? idBranch.value : null,
                    "filter[start_date]":
                        valueDate?.startDate != null
                            ? valueDate?.startDate
                            : null,
                    "filter[end_date]":
                        valueDate?.endDate != null ? valueDate?.endDate : null,
                },
            },
            (err, response) => {
                if (!err) {
                    var data = response.data;
                    sListDs(data);
                }
                sOnFetching(false);
            }
        );
    };

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
        router.push({
            pathname: router.route,
            query: {
                tab: router.query?.tab,
                page: pageNumber,
            },
        });
    };

    useEffect(() => {
        (onFetching && _ServerFetching()) ||
            (onFetching && _ServerFetching_group());
    }, [onFetching]);

    useEffect(() => {
        (router.query.tab && sOnFetching(true)) ||
            (keySearch && sOnFetching(true)) ||
            sOnFetching_filter(true) ||
            (idBranch != null && sOnFetching(true)) ||
            (idCode != null && sOnFetching(true)) ||
            (router.query?.tab && sOnFetching_filter(true)) ||
            (valueDate.startDate != null &&
                valueDate.endDate != null &&
                sOnFetching(true));
    }, [
        limit,
        router.query?.page,
        router.query?.tab,
        idBranch,
        idCode,
        valueDate.endDate,
        valueDate.startDate,
    ]);

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
                    title: `${
                        dataLang?.serviceVoucher_day_vouchers ||
                        "serviceVoucher_day_vouchers"
                    }`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${
                        dataLang?.serviceVoucher_voucher_code ||
                        "serviceVoucher_voucher_code"
                    }`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${
                        dataLang?.serviceVoucher_supplier ||
                        "serviceVoucher_supplier"
                    }`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${
                        dataLang?.serviceVoucher_total_amount ||
                        "serviceVoucher_total_amount"
                    }`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${
                        dataLang?.serviceVoucher_tax_money ||
                        "serviceVoucher_tax_money"
                    }`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${
                        dataLang?.serviceVoucher_into_money ||
                        "serviceVoucher_into_money"
                    }`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${
                        dataLang?.serviceVoucher_status_of_spending ||
                        "serviceVoucher_status_of_spending"
                    }`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${
                        dataLang?.serviceVoucher_note || "serviceVoucher_note"
                    }`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${
                        dataLang?.serviceVoucher_branch ||
                        "serviceVoucher_branch"
                    }`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
            ],
            data: dataExcel?.map((e) => [
                { value: `${e?.id ? e.id : ""}`, style: { numFmt: "0" } },
                { value: `${e?.date ? e?.date : ""}` },
                { value: `${e?.code ? e?.code : ""}` },
                { value: `${e?.supplier_name ? e?.supplier_name : ""}` },
                {
                    value: `${
                        e?.total_price ? formatNumber(e?.total_price) : ""
                    }`,
                },
                {
                    value: `${
                        e?.total_tax_price
                            ? formatNumber(e?.total_tax_price)
                            : ""
                    }`,
                },
                {
                    value: `${
                        e?.total_amount ? formatNumber(e?.total_amount) : ""
                    }`,
                },
                // {value: `${e?.status_pay ? e?.status_pay === "0" && "Chưa nhập" || e?.status_pay === "1" && "Nhập 1 phần" ||  e?.status_pay === "2"  && "Đã nhập đủ đủ" : ""}`},
                { value: `${"Chưa chi"}` },
                { value: `${e?.note ? e?.note : ""}` },
                { value: `${e?.branch_name ? e?.branch_name : ""}` },
            ]),
        },
    ];
    const _HandleFresh = () => sOnFetching(true);
    const trangthaiExprired = useSelector((state) => state?.trangthaiExprired);

    return (
        <React.Fragment>
            <Head>
                <title>
                    {dataLang?.serviceVoucher_title || "serviceVoucher_title"}{" "}
                </title>
            </Head>
            <div className="px-10 xl:pt-24 pt-[88px] pb-10 space-y-4 overflow-hidden h-screen">
                {trangthaiExprired ? (
                    <div className="p-2"></div>
                ) : (
                    <div className="flex space-x-3 xl:text-[14.5px] text-[12px]">
                        <h6 className="text-[#141522]/40">
                            {dataLang?.serviceVoucher_title ||
                                "serviceVoucher_title"}
                        </h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>
                            {dataLang?.serviceVoucher_title_lits ||
                                "serviceVoucher_title_lits"}
                        </h6>
                    </div>
                )}

                <div className="grid grid-cols gap-5 h-[99%] overflow-hidden">
                    <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden">
                        <div className="space-y-3 h-[96%] overflow-hidden">
                            <div className="flex justify-between">
                                <h2 className="text-2xl text-[#52575E] capitalize">
                                    {dataLang?.serviceVoucher_title_lits ||
                                        "serviceVoucher_title_lits"}
                                </h2>
                                <div className="flex justify-end items-center">
                                    <Popup_servie
                                        onRefreshGr={_ServerFetching_group.bind(
                                            this
                                        )}
                                        onRefresh={_ServerFetching.bind(this)}
                                        dataLang={dataLang}
                                        className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105"
                                    >
                                        {dataLang?.serviceVoucher_create_new ||
                                            "serviceVoucher_create_new"}
                                    </Popup_servie>
                                </div>
                            </div>

                            <div className="flex space-x-3 items-center  h-[8vh] justify-start overflow-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                {listDs &&
                                    listDs.map((e) => {
                                        return (
                                            <div>
                                                <TabStatus
                                                    style={{
                                                        backgroundColor:
                                                            "#e2f0fe",
                                                    }}
                                                    dataLang={dataLang}
                                                    key={e.id}
                                                    onClick={_HandleSelectTab.bind(
                                                        this,
                                                        `${e.id}`
                                                    )}
                                                    total={e.count}
                                                    active={e.id}
                                                    className={
                                                        "text-[#0F4F9E] "
                                                    }
                                                >
                                                    {dataLang[e?.name] ||
                                                        e?.name}
                                                </TabStatus>
                                            </div>
                                        );
                                    })}
                            </div>
                            <div className="space-y-2 2xl:h-[91%] h-[92%] overflow-hidden">
                                <div className="xl:space-y-3 space-y-2">
                                    <div className="bg-slate-100 w-full rounded grid grid-cols-6 justify-between xl:p-3 p-2">
                                        <div className="col-span-5">
                                            <div className="grid grid-cols-5">
                                                <div className="col-span-1">
                                                    <form className="flex items-center relative">
                                                        <IconSearch
                                                            size={20}
                                                            className="absolute 2xl:left-3 z-10  text-[#cccccc] xl:left-[4%] left-[1%]"
                                                        />
                                                        <input
                                                            className=" relative bg-white  outline-[#D0D5DD] focus:outline-[#0F4F9E]  2xl:text-left 2xl:pl-10 xl:pl-0 p-0 2xl:py-1.5  py-2.5 rounded 2xl:text-base text-xs xl:text-center text-center 2xl:w-full xl:w-full w-[100%]"
                                                            type="text"
                                                            onChange={_HandleOnChangeKeySearch.bind(
                                                                this
                                                            )}
                                                            placeholder={
                                                                dataLang?.branch_search
                                                            }
                                                        />
                                                    </form>
                                                </div>
                                                <div className="ml-1 col-span-1">
                                                    <Select
                                                        options={[
                                                            {
                                                                value: "",
                                                                label:
                                                                    dataLang?.serviceVoucher_branch ||
                                                                    "serviceVoucher_branch",
                                                                isDisabled: true,
                                                            },
                                                            ...listBr,
                                                        ]}
                                                        onChange={onchang_filter.bind(
                                                            this,
                                                            "branch"
                                                        )}
                                                        value={idBranch}
                                                        placeholder={
                                                            dataLang?.serviceVoucher_branch ||
                                                            "serviceVoucher_branch"
                                                        }
                                                        hideSelectedOptions={
                                                            false
                                                        }
                                                        isClearable={true}
                                                        className="rounded-md bg-white  2xl:text-base xl:text-xs text-[10px]  z-20"
                                                        isSearchable={true}
                                                        noOptionsMessage={() =>
                                                            "Không có dữ liệu"
                                                        }
                                                        closeMenuOnSelect={true}
                                                        style={{
                                                            border: "none",
                                                            boxShadow: "none",
                                                            outline: "none",
                                                        }}
                                                        theme={(theme) => ({
                                                            ...theme,
                                                            colors: {
                                                                ...theme.colors,
                                                                primary25:
                                                                    "#EBF5FF",
                                                                primary50:
                                                                    "#92BFF7",
                                                                primary:
                                                                    "#0F4F9E",
                                                            },
                                                        })}
                                                        styles={{
                                                            placeholder: (
                                                                base
                                                            ) => ({
                                                                ...base,
                                                                color: "#cbd5e1",
                                                            }),
                                                            control: (
                                                                base,
                                                                state
                                                            ) => ({
                                                                ...base,
                                                                border: "none",
                                                                outline: "none",
                                                                boxShadow:
                                                                    "none",
                                                                ...(state.isFocused && {
                                                                    boxShadow:
                                                                        "0 0 0 1.5px #0F4F9E",
                                                                }),
                                                            }),
                                                        }}
                                                    />
                                                </div>
                                                <div className="ml-1 col-span-1">
                                                    <Select
                                                        onInputChange={_HandleSeachApi.bind(
                                                            this
                                                        )}
                                                        options={[
                                                            {
                                                                value: "",
                                                                label:
                                                                    dataLang?.serviceVoucher_voucher_code ||
                                                                    "serviceVoucher_voucher_code",
                                                                isDisabled: true,
                                                            },
                                                            ...dataCode,
                                                        ]}
                                                        onChange={onchang_filter.bind(
                                                            this,
                                                            "code"
                                                        )}
                                                        value={idCode}
                                                        placeholder={
                                                            dataLang?.serviceVoucher_voucher_code ||
                                                            "serviceVoucher_voucher_code"
                                                        }
                                                        hideSelectedOptions={
                                                            false
                                                        }
                                                        isClearable={true}
                                                        className="rounded-md bg-white  2xl:text-base xl:text-xs text-[10px]  z-20"
                                                        isSearchable={true}
                                                        noOptionsMessage={() =>
                                                            "Không có dữ liệu"
                                                        }
                                                        style={{
                                                            border: "none",
                                                            boxShadow: "none",
                                                            outline: "none",
                                                        }}
                                                        theme={(theme) => ({
                                                            ...theme,
                                                            colors: {
                                                                ...theme.colors,
                                                                primary25:
                                                                    "#EBF5FF",
                                                                primary50:
                                                                    "#92BFF7",
                                                                primary:
                                                                    "#0F4F9E",
                                                            },
                                                        })}
                                                        styles={{
                                                            placeholder: (
                                                                base
                                                            ) => ({
                                                                ...base,
                                                                color: "#cbd5e1",
                                                            }),
                                                            control: (
                                                                base,
                                                                state
                                                            ) => ({
                                                                ...base,
                                                                border: "none",
                                                                outline: "none",
                                                                boxShadow:
                                                                    "none",
                                                                ...(state.isFocused && {
                                                                    boxShadow:
                                                                        "0 0 0 1.5px #0F4F9E",
                                                                }),
                                                            }),
                                                        }}
                                                    />
                                                </div>
                                                <div className="z-20 ml-1 col-span-1">
                                                    <Datepicker
                                                        value={valueDate}
                                                        i18n={"vi"}
                                                        primaryColor={"blue"}
                                                        onChange={onchang_filter.bind(
                                                            this,
                                                            "date"
                                                        )}
                                                        showShortcuts={true}
                                                        displayFormat={
                                                            "DD/MM/YYYY"
                                                        }
                                                        configs={{
                                                            shortcuts: {
                                                                today: "Hôm nay",
                                                                yesterday:
                                                                    "Hôm qua",
                                                                past: (
                                                                    period
                                                                ) =>
                                                                    `${period}  ngày qua`,
                                                                currentMonth:
                                                                    "Tháng này",
                                                                pastMonth:
                                                                    "Tháng trước",
                                                            },
                                                            footer: {
                                                                cancel: "Từ bỏ",
                                                                apply: "Áp dụng",
                                                            },
                                                        }}
                                                        className="react-datepicker__input-container 2xl:placeholder:text-xs xl:placeholder:text-xs placeholder:text-[8px]"
                                                        inputClassName="rounded-md w-full 2xl:p-2 xl:p-[11px] p-3 bg-white focus:outline-[#0F4F9E]  2xl:placeholder:text-xs xl:placeholder:text-xs placeholder:text-[8px] border-none  2xl:text-base xl:text-xs text-[10px]  focus:outline-none focus:ring-0 focus:border-transparent"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-1">
                                            <div className="flex justify-end items-center gap-2">
                                                <button
                                                    onClick={_HandleFresh.bind(
                                                        this
                                                    )}
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
                                                    {dataExcel?.length > 0 && (
                                                        <ExcelFile
                                                            filename="Danh sách phiếu dịch vụ"
                                                            title="DSPDV"
                                                            element={
                                                                <button className="xl:px-4 px-3 xl:py-2.5 py-1.5 2xl:text-xs xl:text-xs text-[7px] flex items-center space-x-2 bg-[#C7DFFB] rounded hover:scale-105 transition">
                                                                    <IconExcel
                                                                        className="2xl:scale-100 xl:scale-100 scale-75"
                                                                        size={
                                                                            18
                                                                        }
                                                                    />
                                                                    <span>
                                                                        {
                                                                            dataLang?.client_list_exportexcel
                                                                        }
                                                                    </span>
                                                                </button>
                                                            }
                                                        >
                                                            <ExcelSheet
                                                                dataSet={
                                                                    multiDataSet
                                                                }
                                                                data={
                                                                    multiDataSet
                                                                }
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
                                                        onChange={(e) =>
                                                            sLimit(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={limit}
                                                    >
                                                        <option
                                                            className="text-[10px] xl:text-xs 2xl:text-sm hidden"
                                                            disabled
                                                        >
                                                            {limit == -1
                                                                ? "Tất cả"
                                                                : limit}
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
                                <div className="min:h-[200px] h-[82%] max:h-[500px]  overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                    <div className="pr-2 w-[100%] lx:w-[120%] ">
                                        <div className="grid grid-cols-12 items-center sticky top-0 p-2 z-10 rounded-xl shadow-sm bg-white divide-x">
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1  text-center">
                                                {dataLang?.serviceVoucher_day_vouchers ||
                                                    "serviceVoucher_day_vouchers"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1  text-center">
                                                {dataLang?.serviceVoucher_voucher_code ||
                                                    "serviceVoucher_voucher_code"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-2  text-center">
                                                {dataLang?.serviceVoucher_supplier ||
                                                    "serviceVoucher_supplier"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1  text-center">
                                                {dataLang?.serviceVoucher_total_amount ||
                                                    "serviceVoucher_total_amount"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1  text-center">
                                                {dataLang?.serviceVoucher_tax_money ||
                                                    "serviceVoucher_tax_money"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1  text-center">
                                                {dataLang?.serviceVoucher_into_money ||
                                                    "serviceVoucher_into_money"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-2  text-center">
                                                {dataLang?.serviceVoucher_status_of_spending ||
                                                    "serviceVoucher_status_of_spending"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1  text-center">
                                                {dataLang?.serviceVoucher_note ||
                                                    "serviceVoucher_note"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1  text-center">
                                                {dataLang?.serviceVoucher_branch ||
                                                    "serviceVoucher_branch"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1  text-center">
                                                {dataLang?.serviceVoucher_operation ||
                                                    "serviceVoucher_operation"}
                                            </h4>
                                        </div>
                                        {onFetching ? (
                                            <Loading
                                                className="h-80"
                                                color="#0f4f9e"
                                            />
                                        ) : data?.length > 0 ? (
                                            <>
                                                <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px]">
                                                    {data?.map((e) => (
                                                        <div
                                                            className="grid grid-cols-12 items-center py-1.5 px-2 hover:bg-slate-100/40 "
                                                            key={e.id.toString()}
                                                        >
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-1 text-center">
                                                                {e?.date != null
                                                                    ? moment(
                                                                          e?.date
                                                                      ).format(
                                                                          "DD/MM/YYYY"
                                                                      )
                                                                    : ""}
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] hover:text-blue-600 transition-all ease-in-out px-2 col-span-1 text-center text-[#0F4F9E]  cursor-pointer">
                                                                <Popup_chitiet
                                                                    dataLang={
                                                                        dataLang
                                                                    }
                                                                    className="text-left"
                                                                    name={
                                                                        e?.code
                                                                    }
                                                                    id={e?.id}
                                                                />
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-2 text-left">
                                                                {
                                                                    e.supplier_name
                                                                }
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-1 text-right">
                                                                {formatNumber(
                                                                    e.total_price
                                                                )}
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-1 text-right">
                                                                {formatNumber(
                                                                    e.total_tax_price
                                                                )}
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-1 text-right">
                                                                {formatNumber(
                                                                    e.total_amount
                                                                )}
                                                            </h6>
                                                            <h6 className="3xl:items-center 3xl-text-[18px] 2xl:text-[16px] xl:text-xs text-[8px]  col-span-2 flex items-center w-fit mx-auto">
                                                                <div className="mx-auto">
                                                                    {(e?.status_pay ===
                                                                        "not_spent" && (
                                                                        <span className=" font-normal text-sky-500  rounded-xl py-1 px-2 min-w-[135px]  bg-sky-200 text-center text-[13px]">
                                                                            {
                                                                                "Chưa chi"
                                                                            }
                                                                        </span>
                                                                    )) ||
                                                                        (e?.status_pay ===
                                                                            "spent_part" && (
                                                                            <span className=" font-normal text-orange-500 rounded-xl py-1 px-2 min-w-[135px]  bg-orange-200 text-center text-[13px]">
                                                                                {
                                                                                    "Chi 1 phần"
                                                                                }{" "}
                                                                                {`(${formatNumber(
                                                                                    e?.amount_paid
                                                                                )})`}
                                                                            </span>
                                                                        )) ||
                                                                        (e?.status_pay ===
                                                                            "spent" && (
                                                                            <span className="flex items-center justify-center gap-1 font-normal text-lime-500  rounded-xl py-1 px-2 min-w-[135px]  bg-lime-200 text-center text-[13px]">
                                                                                <TickCircle
                                                                                    className="bg-lime-500 rounded-full"
                                                                                    color="white"
                                                                                    size={
                                                                                        15
                                                                                    }
                                                                                />
                                                                                {
                                                                                    "Đã chi đủ"
                                                                                }
                                                                            </span>
                                                                        ))}
                                                                    {/* <span className=' font-normal text-sky-500  rounded-xl py-1 px-2 min-w-[100px]  bg-sky-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]'>{"Chưa chi"}</span> */}
                                                                </div>
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-1 text-left truncate ">
                                                                {e.note}
                                                            </h6>
                                                            <h6 className="col-span-1 w-fit ">
                                                                <div className="cursor-default 3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[8px] text-[#0F4F9E] font-[300] px-1.5 py-0.5 border border-[#0F4F9E] bg-white rounded-[5.5px] uppercase">
                                                                    {
                                                                        e?.branch_name
                                                                    }
                                                                </div>
                                                            </h6>
                                                            <div className="col-span-1 flex justify-center">
                                                                <BtnTacVu
                                                                    type="serviceVoucher"
                                                                    onRefresh={_ServerFetching.bind(
                                                                        this
                                                                    )}
                                                                    onRefreshGr={_ServerFetching_group.bind(
                                                                        this
                                                                    )}
                                                                    dataLang={
                                                                        dataLang
                                                                    }
                                                                    status_pay={
                                                                        e?.status_pay
                                                                    }
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
                                                        {dataLang?.purchase_order_table_item_not_found ||
                                                            "purchase_order_table_item_not_found"}
                                                    </h1>
                                                    <div className="flex items-center justify-around mt-6 "></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {data?.length != 0 && (
                            <div className="flex space-x-5 items-center">
                                <h6>
                                    {dataLang?.display}{" "}
                                    {totalItems?.iTotalDisplayRecords}{" "}
                                    {dataLang?.among}{" "}
                                    {totalItems?.iTotalRecords}{" "}
                                    {dataLang?.ingredient}
                                </h6>
                                <Pagination
                                    postsPerPage={limit}
                                    totalPosts={Number(
                                        totalItems?.iTotalDisplayRecords
                                    )}
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

const TabStatus = React.memo((props) => {
    const router = useRouter();
    return (
        <button
            type="button"
            style={props.style}
            onClick={props.onClick}
            className={`${props.className} justify-center min-w-[180px] flex gap-2 2xl:text-sm xl:text-sm text-xs items-center rounded-[5.5px] px-2 py-2 outline-none relative `}
        >
            {router.query?.tab === `${props.active}` && (
                <ArrowCircleDown size="20" color="#0F4F9E" />
            )}
            {props.children}
            <span
                className={`${
                    props?.total > 0 &&
                    "absolute min-w-[29px] top-0 right-0 bg-[#ff6f00] text-xs translate-x-2.5 -translate-y-2 text-white rounded-[100%] px-2 text-center items-center flex justify-center py-1.5"
                } `}
            >
                {props?.total > 0 && props?.total}
            </span>
        </button>
    );
});

const BtnTacVu = React.memo((props) => {
    // const [open, sOpen] = useState(false);
    const [openTacvu, sOpenTacvu] = useState(false);
    const _ToggleModal = (e) => sOpenTacvu(e);

    const [dataPDF, setData] = useState();
    const [dataCompany, setDataCompany] = useState();

    const fetchDataSettingsCompany = async () => {
        if (props?.id) {
            await Axios(
                "GET",
                `/api_web/Api_setting/CompanyInfo?csrf_protection=true`,
                {},
                (err, response) => {
                    if (!err) {
                        var { data } = response.data;
                        setDataCompany(data);
                    }
                }
            );
        }
        if (props?.id) {
            await Axios(
                "GET",
                `/api_web/Api_service/service/${props?.id}?csrf_protection=true`,
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
                    `/api_web/Api_service/service/${id}?csrf_protection=true`,
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
                                props.onRefreshGr && props.onRefreshGr();
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

    const handleClick = () => {
        if (props?.status_pay != "not_spent") {
            Toast.fire({
                icon: "error",
                title: `${"Phiếu dịch vụ đã chi. Không thể sửa"}`,
            });
        } else {
            // router.push(`/purchase_order/order/form?id=${props.id}`);
        }
    };
    return (
        <div>
            <Popup
                trigger={
                    <button
                        type="button"
                        className={
                            `flex space-x-1 items-center ` + props.className
                        }
                    >
                        <span>
                            {props.dataLang?.purchase_action ||
                                "purchase_action"}
                        </span>
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
                        <div className="group transition-all ease-in-out flex items-center  gap-2  2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5 rounded  w-full">
                            <BiEdit
                                size={20}
                                className="group-hover:text-sky-500 group-hover:scale-110 group-hover:shadow-md "
                            />
                            <Popup_servie
                                status_pay={props?.status_pay}
                                onRefreshGr={props.onRefreshGr}
                                onClick={handleClick}
                                onRefresh={props.onRefresh}
                                dataLang={props.dataLang}
                                id={props?.id}
                                className="2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer  rounded py-2.5"
                            >
                                {props.dataLang?.purchase_order_table_edit ||
                                    "purchase_order_table_edit"}
                            </Popup_servie>
                        </div>
                        <FilePDF
                            props={props}
                            openAction={openTacvu}
                            setOpenAction={sOpenTacvu}
                            dataCompany={dataCompany}
                            data={dataPDF}
                        />
                        <button
                            onClick={_HandleDelete.bind(this, props.id)}
                            className="group transition-all ease-in-out flex items-center justify-center gap-2  2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 w-full"
                        >
                            <RiDeleteBin6Line
                                size={20}
                                className="group-hover:text-[#f87171] group-hover:scale-110 group-hover:shadow-md "
                            />
                            <p className="group-hover:text-[#f87171]">
                                {props.dataLang?.purchase_order_table_delete ||
                                    "purchase_order_table_delete"}
                            </p>
                        </button>
                    </div>
                </div>
            </Popup>
        </div>
    );
});

export default Index;
