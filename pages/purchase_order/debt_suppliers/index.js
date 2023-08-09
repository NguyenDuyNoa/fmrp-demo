import React, { useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Link from "next/link";
import "react-datepicker/dist/react-datepicker.css";

import {
    Grid6 as IconExcel,
    SearchNormal1 as IconSearch,
    Refresh2,
} from "iconsax-react";

import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import Datepicker from "react-tailwindcss-datepicker";
import DatePicker, { registerLocale } from "react-datepicker";
import vi from "date-fns/locale/vi";
registerLocale("vi", vi);

import Loading from "components/UI/loading";
import { _ServerInstance as Axios } from "/services/axios";
import Pagination from "/components/UI/pagination";

import Swal from "sweetalert2";

import ReactExport from "react-data-export";
import { useEffect } from "react";
import Popup_chitietPhatsinh from "./(popup)/details_arises";
import Popup_chitietDauki from "./(popup)/details_first";
import moment from "moment";
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

    const [totalItems, sTotalItems] = useState([]);
    const [keySearch, sKeySearch] = useState("");
    const [limit, sLimit] = useState(15);
    const [total, sTotal] = useState({});

    const [listBr, sListBr] = useState([]);
    const [lisCode, sListCode] = useState([]);
    const [listSupplier, sListSupplier] = useState([]);

    const [idCode, sIdCode] = useState(null);
    const [idSupplier, sIdSupplier] = useState(null);
    const [idBranch, sIdBranch] = useState(null);
    const [valueDate, sValueDate] = useState({
        startDate: null,
        endDate: null,
    });
    const trangthaiExprired = useSelector((state) => state?.trangthaiExprired);

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

    const _ServerFetching = () => {
        Axios(
            "GET",
            `/api_web/Api_debt_supplier/GetDebtSuppliers?csrf_protection=true&cong=true`,
            {
                params: {
                    search: keySearch,
                    limit: limit,
                    page: router.query?.page || 1,
                    "filter[branch_id]":
                        idBranch != null ? idBranch.value : null,
                    "filter[supplier_id]": idSupplier ? idSupplier.value : null,
                    "filter[start_date]":
                        valueDate?.startDate != null
                            ? moment(valueDate?.startDate).format("YYYY-MM-DD")
                            : null,
                    "filter[end_date]":
                        valueDate?.endDate != null
                            ? moment(valueDate?.endDate).format("YYYY-MM-DD")
                            : null,
                },
            },
            (err, response) => {
                if (!err) {
                    var { rResult, output, rTotal } = response.data;
                    sData(rResult);
                    sTotalItems(output);
                    sDataExcel(rResult);
                    sTotal(rTotal);
                }
                sOnFetching(false);
            }
        );
    };

    const _ServerFetching_filter = () => {
        Axios(
            "GET",
            `/api_web/Api_Branch/branchCombobox/?csrf_protection=true`,
            {},
            (err, response) => {
                if (!err) {
                    var { isSuccess, result } = response.data;
                    sListBr(result);
                }
            }
        );
        Axios(
            "GET",
            "/api_web/api_supplier/supplier/?csrf_protection=true",
            {},
            (err, response) => {
                if (!err) {
                    var db = response.data.rResult;
                    sListSupplier(
                        db?.map((e) => ({ label: e.name, value: e.id }))
                    );
                }
            }
        );

        sOnFetching_filter(false);
    };

    useEffect(() => {
        onFetching_filter && _ServerFetching_filter();
    }, [onFetching_filter]);

    useEffect(() => {
        onFetching && _ServerFetching();
    }, [onFetching]);

    useEffect(() => {
        (router.query.tab && sOnFetching(true)) ||
            (keySearch && sOnFetching(true)) ||
            (router.query?.tab && sOnFetching_filter(true)) ||
            (idBranch != null && sOnFetching(true)) ||
            (valueDate.startDate != null &&
                valueDate.endDate != null &&
                sOnFetching(true)) ||
            (idSupplier != null && sOnFetching(true)) ||
            (idCode != null && sOnFetching(true));
    }, [
        limit,
        router.query?.page,
        router.query?.tab,
        idBranch,
        valueDate.endDate,
        valueDate.startDate,
        idSupplier,
        idCode,
    ]);

    const formatNumber = (number) => {
        if (!number && number !== 0) return 0;
        const integerPart = Math.floor(number);
        const decimalPart = number - integerPart;
        const roundedDecimalPart = decimalPart >= 0.05 ? 1 : 0;
        const roundedNumber = integerPart + roundedDecimalPart;
        return roundedNumber.toLocaleString("en");
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

    const listBr_filter = listBr
        ? listBr?.map((e) => ({ label: e.name, value: e.id }))
        : [];

    const onchang_filter = (type, value) => {
        if (type == "branch") {
            sIdBranch(value);
        } else if (type == "date") {
            sValueDate(value);
        } else if (type == "supplier") {
            sIdSupplier(value);
        } else if (type == "code") {
            sIdCode(value);
        }
    };

    const _HandleFresh = () => {
        sOnFetching(true);
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
                        dataLang?.debt_suppliers_code || "debt_suppliers_code"
                    }`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${
                        dataLang?.debt_suppliers_name || "debt_suppliers_name"
                    }`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${
                        dataLang?.debt_suppliers_detail_opening ||
                        "debt_suppliers_detail_opening"
                    }`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${
                        dataLang?.debt_suppliers_detail_period ||
                        "debt_suppliers_detail_period"
                    }`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${
                        dataLang?.debt_suppliers_detail_incurred ||
                        "debt_suppliers_detail_incurred"
                    }`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${
                        dataLang?.debt_suppliers_detail_expenses ||
                        "debt_suppliers_detail_expenses"
                    }`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${
                        dataLang?.debt_suppliers_detail_debt_period ||
                        "debt_suppliers_detail_debt_period"
                    }`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${
                        dataLang?.debt_suppliers_detail_Ending ||
                        "debt_suppliers_detail_Ending"
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
                { value: `${e?.code ? e?.code : ""}` },
                { value: `${e?.name ? e?.name : ""}` },
                { value: `${e?.no_start ? formatNumber(e?.no_start) : ""}` },
                { value: `${e?.chi_start ? formatNumber(e?.chi_start) : ""}` },
                { value: `${e?.no_debt ? formatNumber(e?.no_debt) : ""}` },
                { value: `${e?.chi_debt ? formatNumber(e?.chi_debt) : ""}` },
                { value: `${e?.no_end ? formatNumber(e?.no_end) : ""}` },
                { value: `${e?.chi_end ? formatNumber(e?.chi_end) : ""}` },
            ]),
        },
    ];
    // useEffect(() => {
    //   // Set the default value to the current month
    //   const today = new Date();
    //   const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    //   const lastDayOfMonth = new Date(
    //     today.getFullYear(),
    //     today.getMonth() + 1,
    //     0
    //   );

    //   sValueDate({
    //     startDate: firstDayOfMonth,
    //     endDate: lastDayOfMonth,
    //   });
    // }, []);

    useEffect(() => {
        // Calculate the past period (e.g., 30 days ago)
        const pastDays = 30;
        const today = new Date();
        const pastDate = new Date(today);
        pastDate.setDate(today.getDate() - pastDays);

        sValueDate({
            startDate: pastDate,
            endDate: today,
        });
    }, []);
    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.debt_suppliers || "debt_suppliers"} </title>
            </Head>
            <div className="3xl:pt-[88px] 2xl:pt-[74px] xl:pt-[60px] lg:pt-[60px] 3xl:px-10 3xl:pb-10 2xl:px-10 2xl:pb-8 xl:px-10 xl:pb-10 lg:px-5 lg:pb-10 space-y-1 overflow-hidden h-screen">
                {/* trangthaiExprired */}
                {trangthaiExprired ? (
                    <div className="p-3"></div>
                ) : (
                    <div
                        className={` flex space-x-3 xl:text-[14.5px] text-[12px]`}
                    >
                        <h6 className="text-[#141522]/40">
                            {dataLang?.debt_suppliers || "debt_suppliers"}
                        </h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.debt_suppliers || "debt_suppliers"}</h6>
                    </div>
                )}

                <div className="grid grid-cols gap-1 h-[100%] overflow-hidden ">
                    <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden">
                        <div className="space-y-0.5 h-[96%] overflow-hidden">
                            <div className="flex justify-between">
                                <h2 className="text-2xl text-[#52575E] capitalize">
                                    {dataLang?.debt_suppliers ||
                                        "debt_suppliers"}
                                </h2>
                            </div>
                            <div className="space-y-2 3xl:h-[92%] 2xl:h-[88%] xl:h-[95%] lg:h-[90%] overflow-hidden">
                                <div className="xl:space-y-3 space-y-2">
                                    <div className="bg-slate-100 w-full rounded-lg grid grid-cols-6 justify-between xl:p-3 p-2">
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
                                                                    dataLang?.purchase_order_branch ||
                                                                    "purchase_order_branch",
                                                                isDisabled: true,
                                                            },
                                                            ...listBr_filter,
                                                        ]}
                                                        onChange={onchang_filter.bind(
                                                            this,
                                                            "branch"
                                                        )}
                                                        value={idBranch}
                                                        placeholder={
                                                            dataLang?.purchase_order_table_branch ||
                                                            "purchase_order_table_branch"
                                                        }
                                                        hideSelectedOptions={
                                                            false
                                                        }
                                                        isClearable={true}
                                                        className="rounded-md bg-white  2xl:text-base xl:text-xs text-[10px]  z-20"
                                                        isSearchable={true}
                                                        noOptionsMessage={() =>
                                                            dataLang?.returns_nodata ||
                                                            "returns_nodata"
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
                                                        options={[
                                                            {
                                                                value: "",
                                                                label:
                                                                    dataLang?.purchase_order_supplier ||
                                                                    "purchase_order_supplier",
                                                                isDisabled: true,
                                                            },
                                                            ...listSupplier,
                                                        ]}
                                                        onChange={onchang_filter.bind(
                                                            this,
                                                            "supplier"
                                                        )}
                                                        value={idSupplier}
                                                        placeholder={
                                                            dataLang?.purchase_order_table_supplier ||
                                                            "purchase_order_table_supplier"
                                                        }
                                                        hideSelectedOptions={
                                                            false
                                                        }
                                                        isClearable={true}
                                                        className="rounded-md bg-white   2xl:text-base xl:text-xs text-[10px]  z-20"
                                                        isSearchable={true}
                                                        noOptionsMessage={() =>
                                                            dataLang?.returns_nodata ||
                                                            "returns_nodata"
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
                                                            filename={
                                                                "Danh sách công nợ nhà cung cấp"
                                                            }
                                                            title="DSCNNCC"
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
                                <div className="min:h-[200px] 3xl:h-[92%] 2xl:h-[92%] xl:h-[82%] lg:h-[82%] max:h-[400px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                    <div className="pr-2 w-[100%]">
                                        <div className="grid grid-cols-12  sticky top-0 z-10 rounded-xl shadow-md bg-gray-50 divide-x">
                                            <div className="col-span-1 grid items-center">
                                                <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 py-0.5  text-gray-600 uppercase  font-[600]   text-center ">
                                                    {dataLang?.debt_suppliers_code ||
                                                        "debt_suppliers_code"}
                                                </h4>
                                            </div>
                                            <div className="col-span-2 grid items-center">
                                                <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 py-0.5  text-gray-600 uppercase  font-[600]   text-center ">
                                                    {dataLang?.debt_suppliers_name ||
                                                        "debt_suppliers_name"}
                                                </h4>
                                            </div>
                                            <div className="col-span-3 grid grid-cols-4  items-center justify-center">
                                                <h4 className="2xl:text-[14px] xl:text-[10px] border-b text-[8px] px-2 py-0.5  text-gray-600 uppercase  font-[600]  col-span-4 text-center ">
                                                    {dataLang?.debt_suppliers_balance ||
                                                        "debt_suppliers_balance"}
                                                </h4>
                                                <h4 className="2xl:text-[14px] pt-1 xl:text-[10px] border-r border-gray-200  text-[8px] px-2 py-0.5  text-gray-600 uppercase  font-[600]  col-span-2 text-center ">
                                                    {dataLang?.debt_suppliers_inDebt ||
                                                        "debt_suppliers_inDebt"}
                                                </h4>
                                                <h4 className="2xl:text-[14px] pt-1 xl:text-[10px]  text-[8px] px-2 py-0.5  text-gray-600 uppercase  font-[600]  col-span-2 text-center ">
                                                    {dataLang?.debt_suppliers_Spend ||
                                                        "debt_suppliers_Spend"}
                                                </h4>
                                            </div>
                                            <div className="col-span-3 grid grid-cols-4   items-center justify-center">
                                                <h4 className="2xl:text-[14px] xl:text-[10px] border-b text-[8px] px-2 py-0.5  text-gray-600 uppercase  font-[600]  col-span-4 text-center ">
                                                    {dataLang?.debt_suppliers_Arise ||
                                                        "debt_suppliers_Arise"}
                                                </h4>
                                                <h4 className="2xl:text-[14px] pt-1 xl:text-[10px] border-r border-gray-200  text-[8px] px-2 py-0.5  text-gray-600 uppercase  font-[600]  col-span-2 text-center ">
                                                    {dataLang?.debt_suppliers_inDebt ||
                                                        "debt_suppliers_inDebt"}
                                                </h4>
                                                <h4 className="2xl:text-[14px] pt-1 xl:text-[10px]  text-[8px] px-2 py-0.5  text-gray-600 uppercase  font-[600]  col-span-2 text-center ">
                                                    {dataLang?.debt_suppliers_Spend ||
                                                        "debt_suppliers_Spend"}
                                                </h4>
                                            </div>
                                            <div className="col-span-3 grid grid-cols-4  items-center justify-center">
                                                <h4 className="2xl:text-[14px] xl:text-[10px] border-b text-[8px] px-2 py-0.5  text-gray-600 uppercase  font-[600]  col-span-4 text-center ">
                                                    {dataLang?.debt_suppliers_Ending ||
                                                        "debt_suppliers_Ending"}
                                                </h4>
                                                <h4 className="2xl:text-[14px] pt-1 xl:text-[10px] border-r border-gray-200  text-[8px] px-2 py-0.5  text-gray-600 uppercase  font-[600]  col-span-2 text-center ">
                                                    {dataLang?.debt_suppliers_inDebt ||
                                                        "debt_suppliers_inDebt"}
                                                </h4>
                                                <h4 className="2xl:text-[14px] pt-1 xl:text-[10px]  text-[8px] px-2 py-0.5  text-gray-600 uppercase  font-[600]  col-span-2 text-center ">
                                                    {dataLang?.debt_suppliers_Spend ||
                                                        "debt_suppliers_Spend"}
                                                </h4>
                                            </div>
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
                                                            className="relative  grid grid-cols-12 items-center py-1.5  hover:bg-slate-100/40 group"
                                                            key={e.id.toString()}
                                                        >
                                                            <h6 className="text-center 3xl:text-base 2xl:text-[12.5px] py-2 xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-1 capitalize">
                                                                {e.code}
                                                            </h6>
                                                            <h6 className="text-left 3xl:text-base 2xl:text-[12.5px] py-2 xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-2 capitalize">
                                                                {e.name}
                                                            </h6>
                                                            <div className="col-span-3 grid grid-cols-4  items-center justify-center">
                                                                <h4 className="text-right 3xl:text-base 2xl:text-[12.5px] py-2 xl:text-[11px] font-medium text-[9px] text-[#0F4F9E] hover:text-blue-600 transition-all duration-300 ease-in-out px-2 col-span-2 capitalize">
                                                                    {e.no_start ==
                                                                    "0" ? (
                                                                        "-"
                                                                    ) : (
                                                                        <Popup_chitietDauki
                                                                            dataLang={
                                                                                dataLang
                                                                            }
                                                                            className="text-left"
                                                                            name={
                                                                                e.no_start ==
                                                                                "0"
                                                                                    ? "-"
                                                                                    : formatNumber(
                                                                                          e.no_start
                                                                                      )
                                                                            }
                                                                            id={
                                                                                e?.id
                                                                            }
                                                                            type={
                                                                                "no_start"
                                                                            }
                                                                            date={
                                                                                valueDate
                                                                            }
                                                                            supplier_name={
                                                                                e.name
                                                                            }
                                                                            idBranch={
                                                                                idBranch
                                                                            }
                                                                            idSupplier={
                                                                                idSupplier
                                                                            }
                                                                        />
                                                                    )}
                                                                </h4>
                                                                <h4 className="text-right 3xl:text-base 2xl:text-[12.5px] py-2 xl:text-[11px] font-medium text-[9px] text-[#0F4F9E] hover:text-blue-600 transition-all duration-300 ease-in-out px-2 col-span-2 capitalize">
                                                                    {e.chi_start ==
                                                                    "0" ? (
                                                                        "-"
                                                                    ) : (
                                                                        <Popup_chitietDauki
                                                                            dataLang={
                                                                                dataLang
                                                                            }
                                                                            className="text-left"
                                                                            name={
                                                                                e.chi_start ==
                                                                                "0"
                                                                                    ? "-"
                                                                                    : formatNumber(
                                                                                          e.chi_start
                                                                                      )
                                                                            }
                                                                            date={
                                                                                valueDate
                                                                            }
                                                                            supplier_name={
                                                                                e.name
                                                                            }
                                                                            id={
                                                                                e?.id
                                                                            }
                                                                            type={
                                                                                "chi_start"
                                                                            }
                                                                            idBranch={
                                                                                idBranch
                                                                            }
                                                                            idSupplier={
                                                                                idSupplier
                                                                            }
                                                                        />
                                                                    )}
                                                                </h4>
                                                            </div>
                                                            <div className="col-span-3 grid grid-cols-4  items-center justify-center">
                                                                <h4 className="text-right 3xl:text-base 2xl:text-[12.5px] py-2 xl:text-[11px] font-medium text-[9px] text-[#0F4F9E] hover:text-blue-600 transition-all duration-300 ease-in-out px-2 col-span-2 capitalize">
                                                                    {e.no_debt ==
                                                                    "0" ? (
                                                                        "-"
                                                                    ) : (
                                                                        <Popup_chitietPhatsinh
                                                                            dataLang={
                                                                                dataLang
                                                                            }
                                                                            className="text-left uppercase"
                                                                            supplier_name={
                                                                                e.name
                                                                            }
                                                                            name={
                                                                                e.no_debt ==
                                                                                "0"
                                                                                    ? "-"
                                                                                    : formatNumber(
                                                                                          e.no_debt
                                                                                      )
                                                                            }
                                                                            id={
                                                                                e?.id
                                                                            }
                                                                            date={
                                                                                valueDate
                                                                            }
                                                                            type={
                                                                                "no_debt"
                                                                            }
                                                                            idBranch={
                                                                                idBranch
                                                                            }
                                                                            idSupplier={
                                                                                idSupplier
                                                                            }
                                                                        />
                                                                    )}
                                                                </h4>

                                                                <h4 className="text-right 3xl:text-base 2xl:text-[12.5px] py-2 xl:text-[11px] font-medium text-[9px] text-[#0F4F9E] hover:text-blue-600 transition-all duration-300 ease-in-out px-2 col-span-2 capitalize">
                                                                    {e.chi_debt ==
                                                                    "0" ? (
                                                                        "-"
                                                                    ) : (
                                                                        <Popup_chitietPhatsinh
                                                                            dataLang={
                                                                                dataLang
                                                                            }
                                                                            className="text-left uppercase"
                                                                            supplier_name={
                                                                                e.name
                                                                            }
                                                                            name={
                                                                                e.chi_debt ==
                                                                                "0"
                                                                                    ? "-"
                                                                                    : formatNumber(
                                                                                          e.chi_debt
                                                                                      )
                                                                            }
                                                                            id={
                                                                                e?.id
                                                                            }
                                                                            date={
                                                                                valueDate
                                                                            }
                                                                            type={
                                                                                "chi_debt"
                                                                            }
                                                                            idBranch={
                                                                                idBranch
                                                                            }
                                                                            idSupplier={
                                                                                idSupplier
                                                                            }
                                                                        />
                                                                    )}
                                                                </h4>
                                                            </div>

                                                            <div className="col-span-3 grid grid-cols-4  items-center justify-center">
                                                                <h4 className="text-right 3xl:text-base 2xl:text-[12.5px] py-2 xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-2 capitalize">
                                                                    {e.no_end ==
                                                                    "0"
                                                                        ? "-"
                                                                        : formatNumber(
                                                                              e.no_end
                                                                          )}
                                                                </h4>
                                                                <h4 className="text-right 3xl:text-base 2xl:text-[12.5px] py-2 xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-2 capitalize">
                                                                    {e.chi_end ==
                                                                    "0"
                                                                        ? "-"
                                                                        : formatNumber(
                                                                              e.chi_end
                                                                          )}
                                                                </h4>
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
                        <div className="grid grid-cols-12 bg-slate-100 shadow items-center rounded-md">
                            <div className="col-span-3 p-2 text-center">
                                <h3 className="uppercase text-gray-600 font-medium 3xl:text-[14px] 2xl:text-[12px] xl:text-[11.5px] text-[9px]">
                                    {dataLang?.import_total || "import_total"}
                                </h3>
                            </div>

                            <div className="col-span-3 grid grid-cols-4  items-center justify-center">
                                <h3 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[11.5px] text-zinc-600 font-medium text-[8px] px-4 col-span-2 text-right border-r">
                                    {formatNumber(total?.no_start)}
                                </h3>
                                <h3 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[11.5px] text-zinc-600 font-medium text-[8px] px-4 col-span-2 text-right border-r">
                                    {formatNumber(total?.chi_start)}
                                </h3>
                            </div>
                            <div className="col-span-3 grid grid-cols-4  items-center justify-center">
                                <h3 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[11.5px] text-zinc-600 font-medium text-[8px] px-4 col-span-2 text-right border-r">
                                    {formatNumber(total?.no_debt)}
                                </h3>
                                <h3 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[11.5px] text-zinc-600 font-medium text-[8px] px-4 col-span-2 text-right border-r">
                                    {formatNumber(total?.chi_debt)}
                                </h3>
                            </div>
                            <div className="col-span-3 grid grid-cols-4  items-center justify-center">
                                <h3 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[11.5px] text-zinc-600 font-medium text-[8px] px-4 col-span-2 text-right border-r">
                                    {formatNumber(total?.no_end)}
                                </h3>
                                <h3 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[11.5px] text-zinc-600 font-medium text-[8px] px-4 col-span-2 text-right ">
                                    {formatNumber(total?.chi_end)}
                                </h3>
                            </div>
                        </div>
                        {data?.length != 0 && (
                            <div className="flex space-x-5 items-center">
                                <h6 className="">
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

// const Popup_chitietPhatsinh = (props) => {
//   const scrollAreaRef = useRef(null);
//   const [open, sOpen] = useState(false);
//   const _ToggleModal = (e) => sOpen(e);
//   const [data, sData] = useState();
//   const [onFetching, sOnFetching] = useState(false);

//   useEffect(() => {
//     props?.id && sOnFetching(true);
//   }, [open]);

//   const formatNumber = (number) => {
//     if (!number && number !== 0) return 0;
//     const integerPart = Math.floor(number);
//     const decimalPart = number - integerPart;
//     const roundedDecimalPart = decimalPart >= 0.05 ? 1 : 0;
//     const roundedNumber = integerPart + roundedDecimalPart;
//     return roundedNumber.toLocaleString("en");
//   };

//   const _ServerFetching_detailOrder = () => {
//     Axios(
//       "GET",
//       `/api_web/Api_return_supplier/returnSupplier/${props?.id}?csrf_protection=true`,
//       {},
//       (err, response) => {
//         if (!err) {
//           var db = response.data;

//           sData(db);
//         }
//         sOnFetching(false);
//       }
//     );
//   };

//   useEffect(() => {
//     onFetching && _ServerFetching_detailOrder();
//   }, [open]);

//   return (
//     <>
//       <PopupEdit
//         title={
//           (props?.type == "no_debt" && "Chi tiết phát sinh nợ") ||
//           (props?.type == "chi_debt" && "Chi tiết phát sinh chi")
//         }
//         button={props?.name}
//         onClickOpen={_ToggleModal.bind(this, true)}
//         open={open}
//         onClose={_ToggleModal.bind(this, false)}
//         classNameBtn={props?.className}
//       >
//         <div className="flex items-center space-x-4 my-2 border-[#E7EAEE] border-opacity-70 border-b-[1px]"></div>
//         <div className=" space-x-5 3xl:w-[1200px] 2xl:w-[1150px] w-[1100px] 3xl:h-auto  2xl:h-auto xl:h-[540px] h-[500px] ">
//           <div>
//             <div className="3xl:w-[1200px] 2xl:w-[1150px] w-[1100px]">
//               <div className="min:h-[170px] h-[72%] max:h-[100px]  customsroll overflow-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
//                 <div className=" w-[100%]">
//                   <div
//                     className={`grid-cols-12  grid sticky top-0 rounded-xl shadow-md bg-white   z-10  divide-x`}
//                   >
//                     <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-2 text-center whitespace-nowrap">
//                       Ngày chứng từ
//                     </h4>
//                     <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-2 text-center whitespace-nowrap">
//                       Mã chứng từ
//                     </h4>
//                     <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-2 text-center whitespace-nowrap">
//                       Loại chứng từ
//                     </h4>
//                     <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-2 text-center whitespace-nowrap">
//                       Thành tiền
//                     </h4>
//                     <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-2 text-center whitespace-nowrap">
//                       Ghi chú
//                     </h4>
//                     <h4 className="text-[13px] px-2 py-2 text-gray-600 uppercase  font-[600] col-span-2 text-center whitespace-nowrap">
//                       Chi nhánh
//                     </h4>
//                   </div>
//                   {onFetching ? (
//                     <Loading className="max-h-28" color="#0f4f9e" />
//                   ) : data?.items?.length > 0 ? (
//                     <>
//                       <ScrollArea
//                         className="min-h-[90px] max-h-[170px] 2xl:max-h-[250px] overflow-hidden"
//                         speed={1}
//                         smoothScrolling={true}
//                       >
//                         <div className="divide-y divide-slate-100 min:h-[170px]  max:h-[170px]">
//                           {data?.items?.map((e) => (
//                             <div
//                               className="grid grid-cols-12 hover:bg-slate-50 items-center border-b"
//                               key={e.id?.toString()}
//                             >
//                               <h6 className="text-[13px]   py-2 px-2 col-span-2 font-medium text-center ">
//                                 {formatNumber(e?.amount)}
//                               </h6>
//                               <h6 className="text-[13px]   py-2 px-2 col-span-2 font-medium text-center ">
//                                 {formatNumber(e?.amount)}
//                               </h6>
//                               <h6 className="text-[13px] flex items-center w-fit mx-auto  py-2 px-2 col-span-2 font-medium ">
//                                 <div className="mx-auto">
//                                   <span className="flex items-center justify-center font-normal text-purple-500  rounded-xl py-1 px-3 xl:min-w-[100px] min-w-[70px]  bg-purple-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]">
//                                     Phiếu nhập hàng
//                                   </span>
//                                   {/* {(e?.type_vouchers === "import" && (
//                                     <span className="flex items-center justify-center font-normal text-purple-500  rounded-xl py-1 px-2 xl:min-w-[100px] min-w-[70px]  bg-purple-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]">
//                                       {dataLang[e?.type_vouchers] ||
//                                         e?.type_vouchers}
//                                     </span>
//                                   )) ||
//                                     (e?.type_vouchers === "deposit" && (
//                                       <span className=" flex items-center justify-center font-normal text-cyan-500 rounded-xl py-1 px-2 xl:min-w-[100px] min-w-[70px]  bg-cyan-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]">
//                                         {dataLang[e?.type_vouchers] ||
//                                           e?.type_vouchers}
//                                       </span>
//                                     )) ||
//                                     (e?.type_vouchers === "service" && (
//                                       <span className="flex items-center justify-center gap-1 font-normal text-red-500  rounded-xl py-1 px-2 xl:min-w-[100px] min-w-[70px]  bg-rose-200 text-center 3xl:items-center 3xl-text-[18px] 2xl:text-[13px] xl:text-xs text-[8px]">
//                                         {dataLang[e?.type_vouchers] ||
//                                           e?.type_vouchers}
//                                       </span>
//                                     ))} */}
//                                 </div>
//                               </h6>
//                               <h6 className="text-[13px]   py-2 px-2 col-span-2 font-medium text-right ">
//                                 {formatNumber(e?.amount)}
//                               </h6>
//                               <h6 className="text-[13px]   py-2 px-2 col-span-2 font-medium text-left">
//                                 test ghi chú
//                               </h6>
//                               <h6 className="col-span-2 w-fit mx-auto">
//                                 <div className="cursor-default 3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[8px] text-[#0F4F9E] font-[300] px-1.5 py-0.5 border border-[#0F4F9E] bg-white rounded-[5.5px] uppercase">
//                                   Hồ chí minh
//                                 </div>
//                               </h6>
//                             </div>
//                           ))}
//                         </div>
//                       </ScrollArea>
//                     </>
//                   ) : (
//                     <div className=" max-w-[352px] mt-24 mx-auto">
//                       <div className="text-center">
//                         <div className="bg-[#EBF4FF] rounded-[100%] inline-block ">
//                           <IconSearch />
//                         </div>
//                         <h1 className="textx-[#141522] text-base opacity-90 font-medium">
//                           {props.dataLang
//                             ?.purchase_order_table_item_not_found ||
//                             "purchase_order_table_item_not_found"}
//                         </h1>
//                         <div className="flex items-center justify-around mt-6 ">
//                           {/* <Popup_dskh onRefresh={_ServerFetching.bind(this)} dataLang={dataLang} className="xl:text-xs text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105" />     */}
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//                 <div className="grid-cols-12 grid items-center border-b-gray-200 border-b divide-x  border-t z-10 border-t-gray-200 ">
//                   <h2 className="font-semibold p-2 text-[13px] col-span-6 text-center">
//                     Tổng tiền
//                   </h2>
//                   <h2 className="font-medium p-2 text-[13px]   col-span-2 text-right">
//                     10.0000
//                   </h2>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </PopupEdit>
//     </>
//   );
// };

export default Index;
