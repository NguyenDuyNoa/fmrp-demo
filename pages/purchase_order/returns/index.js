import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useRef, useEffect, useState } from "react";

import "react-datepicker/dist/react-datepicker.css";

import {
    Grid6 as IconExcel,
    Filter as IconFilter,
    Calendar as IconCalendar,
    SearchNormal1 as IconSearch,
    ArrowDown2 as IconDown,
    ArrowCircleDown,
    Refresh2,
} from "iconsax-react";

import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import Datepicker from "react-tailwindcss-datepicker";

import moment from "moment/moment";

import { _ServerInstance as Axios } from "/services/axios";

import Swal from "sweetalert2";

import ReactExport from "react-data-export";

import Popup_chitiet from "./(popup)/pupup";

import Loading from "@/components/UI/loading";
import BtnAction from "@/components/UI/BtnAction";
import Pagination from "@/components/UI/pagination";
import PopupConfim from "@/components/UI/popupConfim/popupConfim";
import ButtonWarehouse from "@/components/UI/btnWarehouse/btnWarehouse";

import { routerReturns } from "@/routers/buyImportGoods";

import useToast from "@/hooks/useToast";
import { useToggle } from "@/hooks/useToggle";
import useStatusExprired from "@/hooks/useStatusExprired";

import { CONFIRMATION_OF_CHANGES, TITLE_STATUS } from "@/constants/changeStatus/changeStatus";
import { debounce } from "lodash";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const Index = (props) => {
    const dataLang = props.dataLang;

    const router = useRouter();

    const isShow = useToast();

    const [data, sData] = useState([]);

    const { isOpen, isKeyState, handleQueryId } = useToggle();

    const [dataExcel, sDataExcel] = useState([]);

    const [onFetching, sOnFetching] = useState(false);

    const [onFetching_filter, sOnFetching_filter] = useState(false);

    const [onSending, sOnSending] = useState(false);

    const [totalItems, sTotalItems] = useState([]);

    const [keySearch, sKeySearch] = useState("");

    const [limit, sLimit] = useState(15);

    const [total, sTotal] = useState({});

    const [listBr, sListBr] = useState([]);

    const [lisCode, sListCode] = useState([]);

    const [listSupplier, sListSupplier] = useState([]);

    const [listDs, sListDs] = useState();

    const [idCode, sIdCode] = useState(null);

    const [idSupplier, sIdSupplier] = useState(null);

    const [idBranch, sIdBranch] = useState(null);

    const [valueDate, sValueDate] = useState({
        startDate: null,
        endDate: null,
    });

    const [checkedWare, sCheckedWare] = useState({});

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
        const tabPage = router.query?.tab;
        Axios(
            "GET",
            `/api_web/Api_return_supplier/returnSupplier/?csrf_protection=true`,
            {
                params: {
                    search: keySearch,
                    limit: limit,
                    page: router.query?.page || 1,
                    "filter[status_bar]": tabPage ?? null,
                    "filter[id]": idCode != null ? idCode?.value : null,
                    "filter[branch_id]": idBranch != null ? idBranch.value : null,
                    "filter[supplier_id]": idSupplier ? idSupplier.value : null,
                    "filter[start_date]": valueDate?.startDate != null ? valueDate?.startDate : null,
                    "filter[end_date]": valueDate?.endDate != null ? valueDate?.endDate : null,
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

    const _ServerFetching_group = () => {
        Axios(
            "GET",
            `/api_web/Api_return_supplier/filterBar/?csrf_protection=true`,
            {
                params: {
                    limit: 0,
                    search: keySearch,
                    "filter[id]": idCode != null ? idCode?.value : null,
                    "filter[branch_id]": idBranch != null ? idBranch.value : null,
                    "filter[supplier_id]": idSupplier ? idSupplier.value : null,
                    "filter[start_date]": valueDate?.startDate != null ? valueDate?.startDate : null,
                    "filter[end_date]": valueDate?.endDate != null ? valueDate?.endDate : null,
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

    const _ServerFetching_filter = () => {
        Axios("GET", `/api_web/Api_Branch/branchCombobox/?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                var { isSuccess, result } = response.data;
                sListBr(result);
            }
        });
        Axios("GET", "/api_web/api_supplier/supplier/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                var db = response.data.rResult;
                sListSupplier(db?.map((e) => ({ label: e.name, value: e.id })));
            }
        });
        Axios(
            "GET",
            "/api_web/Api_return_supplier/returnsupplierCombobox/?csrf_protection=true",
            {},
            (err, response) => {
                if (!err) {
                    var { isSuccess, result } = response?.data;
                    sListCode(result);
                }
            }
        );
        sOnFetching_filter(false);
    };

    const _HandleSeachApi = debounce((inputValue) => {
        Axios(
            "POST",
            `/api_web/Api_import/importCombobox/?csrf_protection=true`,
            {
                data: {
                    term: inputValue,
                },
            },
            (err, response) => {
                if (!err) {
                    var { isSuccess, result } = response?.data;
                    sListCode(result);
                }
            }
        );
    }, 500)

    useEffect(() => {
        onFetching_filter && _ServerFetching_filter();
    }, [onFetching_filter]);

    useEffect(() => {
        (onFetching && _ServerFetching()) || (onFetching && _ServerFetching_group());
    }, [onFetching]);

    useEffect(() => {
        (router.query.tab && sOnFetching(true)) ||
            (keySearch && sOnFetching(true)) ||
            (router.query?.tab && sOnFetching_filter(true)) ||
            (idBranch != null && sOnFetching(true)) ||
            (valueDate.startDate != null && valueDate.endDate != null && sOnFetching(true)) ||
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

    const _HandleOnChangeKeySearch = debounce(({ target: { value } }) => {
        sKeySearch(value);
        router.replace({
            pathname: router.route,
            query: {
                tab: router.query?.tab,
            },
        });
        // setTimeout(() => {
        //     if (!value) {
        //         sOnFetching(true);
        //     }
        //     sOnFetching(true);
        // }, 500);
        sOnFetching(true);
    }, 500)
    const paginate = (pageNumber) => {
        router.push({
            pathname: router.route,
            query: {
                tab: router.query?.tab,
                page: pageNumber,
            },
        });
    };

    const listBr_filter = listBr ? listBr?.map((e) => ({ label: e.name, value: e.id })) : [];

    const listCode_filter = lisCode ? lisCode?.map((e) => ({ label: `${e.code}`, value: e.id })) : [];

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
                    title: `${dataLang?.import_day_vouchers || "import_day_vouchers"}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.import_code_vouchers || "import_code_vouchers"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.import_supplier || "import_supplier"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.import_total_amount || "import_total_amount"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.import_tax_money || "import_tax_money"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.import_into_money || "import_into_money"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${"Hình thức"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.import_brow_storekeepers || "import_brow_storekeepers"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.import_branch || "import_branch"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.import_from_note || "import_from_note"}`,
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
                    value: `${e?.total_price ? formatNumber(e?.total_price) : ""}`,
                },
                {
                    value: `${e?.total_tax_price ? formatNumber(e?.total_tax_price) : ""}`,
                },
                {
                    value: `${e?.total_amount ? formatNumber(e?.total_amount) : ""}`,
                },
                {
                    value: `${e?.treatment_methods === "2" ? "Giảm trừ công nợ" : "Trả tiền mặt"}`,
                },
                {
                    value: `${e?.warehouseman_id === "0" ? "Chưa duyệt kho" : "Đã duyệt kho"}`,
                },
                { value: `${e?.branch_name ? e?.branch_name : ""}` },
                { value: `${e?.note ? e?.note : ""}` },
            ]),
        },
    ];

    const handleSaveStatus = () => {
        if (isKeyState?.type === "browser") {
            const checked = isKeyState.value.target.checked;
            const warehousemanId = isKeyState.value.target.value;
            const dataChecked = {
                checked: checked,
                warehousemanId: warehousemanId,
                id: isKeyState?.id,
                checkedpost: isKeyState?.checkedUn,
            };
            sCheckedWare(dataChecked);
            sData([...data]);
        }

        handleQueryId({ status: false });
    };

    const _HandleChangeInput = (id, checkedUn, type, value) => {
        handleQueryId({
            status: true,
            initialKey: { id, checkedUn, type, value },
        });
    };
    const _ServerSending = () => {
        var data = new FormData();
        data.append("warehouseman_id", checkedWare?.checkedpost != "0" ? checkedWare?.checkedpost : "");
        data.append("id", checkedWare?.id);
        Axios(
            "POST",
            `/api_web/Api_return_supplier/ConfirmWarehous?csrf_protection=true`,
            {
                data: data,
                headers: { "Content-Type": "multipart/form-data" },
            },
            (err, response) => {
                if (!err) {
                    let { isSuccess, message } = response.data;
                    if (isSuccess) {
                        isShow("success", `${dataLang[message]}`);
                        setTimeout(() => {
                            sOnFetching(true);
                        }, 300);
                    } else {
                        isShow("error", `${dataLang[message]}`);
                    }
                }
                sOnSending(false);
            }
        );
    };

    useEffect(() => {
        onSending && _ServerSending();
    }, [onSending]);

    useEffect(() => {
        checkedWare.id != null && sOnSending(true);
    }, [checkedWare]);

    useEffect(() => {
        checkedWare.id != null && sOnSending(true);
    }, [checkedWare.id != null]);

    const trangthaiExprired = useStatusExprired();
    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.returns_title || "returns_title"} </title>
            </Head>
            <div className="3xl:pt-[88px] 2xl:pt-[74px] xl:pt-[60px] lg:pt-[60px] 3xl:px-10 3xl:pb-10 2xl:px-10 2xl:pb-8 xl:px-10 xl:pb-10 lg:px-5 lg:pb-10 space-y-1 overflow-hidden h-screen">
                {/* {data_export.length > 0 && <Popup_status className="hidden" data_export={data_export} dataLang={dataLang}/>} */}
                {trangthaiExprired ? (
                    <div className="p-4"></div>
                ) : (
                    <div
                        className={`
                    flex space-x-3  xl:text-[14.5px] text-[12px]`}
                    >
                        <h6 className="text-[#141522]/40">{dataLang?.returns_title || "returns_title"}</h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.returns_list || "returns_list"}</h6>
                    </div>
                )}

                <div className="grid grid-cols gap-1 h-[100%] overflow-hidden ">
                    <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden">
                        <div className="space-y-0.5 h-[96%] overflow-hidden">
                            <div className="flex justify-between">
                                <h2 className="text-2xl text-[#52575E] capitalize">
                                    {dataLang?.returns_list || "returns_list"}
                                </h2>
                                <div className="flex justify-end items-center">
                                    <Link
                                        href={routerReturns.form}
                                        className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105"
                                    >
                                        {dataLang?.purchase_order_new || "purchase_order_new"}
                                    </Link>
                                </div>
                            </div>

                            <div className="flex space-x-3 m-0 items-center  h-[8vh] justify-start overflow-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                {listDs &&
                                    listDs.map((e) => {
                                        return (
                                            <div>
                                                <TabStatus
                                                    style={{
                                                        backgroundColor: "#e2f0fe",
                                                    }}
                                                    dataLang={dataLang}
                                                    key={e.id}
                                                    onClick={_HandleSelectTab.bind(this, `${e.id}`)}
                                                    total={e.count}
                                                    active={e.id}
                                                    className={
                                                        "text-[#0F4F9E] transition duration-300 ease-out font-medium hover:font-semibold"
                                                    }
                                                >
                                                    {dataLang[e?.name] || e?.name}
                                                </TabStatus>
                                            </div>
                                        );
                                    })}
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
                                                            onChange={_HandleOnChangeKeySearch.bind(this)}
                                                            placeholder={dataLang?.branch_search}
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
                                                        onChange={onchang_filter.bind(this, "branch")}
                                                        value={idBranch}
                                                        placeholder={
                                                            dataLang?.purchase_order_table_branch ||
                                                            "purchase_order_table_branch"
                                                        }
                                                        hideSelectedOptions={false}
                                                        isClearable={true}
                                                        className="rounded-md bg-white  2xl:text-base xl:text-xs text-[10px]  z-20"
                                                        isSearchable={true}
                                                        noOptionsMessage={() =>
                                                            dataLang?.returns_nodata || "returns_nodata"
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
                                                            control: (base, state) => ({
                                                                ...base,
                                                                border: "none",
                                                                outline: "none",
                                                                boxShadow: "none",
                                                                ...(state.isFocused && {
                                                                    boxShadow: "0 0 0 1.5px #0F4F9E",
                                                                }),
                                                            }),
                                                        }}
                                                    />
                                                </div>
                                                <div className="ml-1 col-span-1">
                                                    <Select
                                                        onInputChange={_HandleSeachApi.bind(this)}
                                                        options={[
                                                            {
                                                                value: "",
                                                                label:
                                                                    dataLang?.purchase_order_vouchercode ||
                                                                    "purchase_order_vouchercode",
                                                                isDisabled: true,
                                                            },
                                                            ...listCode_filter,
                                                        ]}
                                                        onChange={onchang_filter.bind(this, "code")}
                                                        value={idCode}
                                                        placeholder={
                                                            dataLang?.purchase_order_table_code ||
                                                            "purchase_order_table_code"
                                                        }
                                                        hideSelectedOptions={false}
                                                        isClearable={true}
                                                        className="rounded-md bg-white  2xl:text-base xl:text-xs text-[10px]  z-20"
                                                        isSearchable={true}
                                                        noOptionsMessage={() =>
                                                            dataLang?.returns_nodata || "returns_nodata"
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
                                                            control: (base, state) => ({
                                                                ...base,
                                                                border: "none",
                                                                outline: "none",
                                                                boxShadow: "none",
                                                                ...(state.isFocused && {
                                                                    boxShadow: "0 0 0 1.5px #0F4F9E",
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
                                                        onChange={onchang_filter.bind(this, "supplier")}
                                                        value={idSupplier}
                                                        placeholder={
                                                            dataLang?.purchase_order_table_supplier ||
                                                            "purchase_order_table_supplier"
                                                        }
                                                        hideSelectedOptions={false}
                                                        isClearable={true}
                                                        className="rounded-md bg-white   2xl:text-base xl:text-xs text-[10px]  z-20"
                                                        isSearchable={true}
                                                        noOptionsMessage={() =>
                                                            dataLang?.returns_nodata || "returns_nodata"
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
                                                            control: (base, state) => ({
                                                                ...base,
                                                                border: "none",
                                                                outline: "none",
                                                                boxShadow: "none",
                                                                ...(state.isFocused && {
                                                                    boxShadow: "0 0 0 1.5px #0F4F9E",
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
                                                        onChange={onchang_filter.bind(this, "date")}
                                                        showShortcuts={true}
                                                        displayFormat={"DD/MM/YYYY"}
                                                        configs={{
                                                            shortcuts: {
                                                                today: "Hôm nay",
                                                                yesterday: "Hôm qua",
                                                                past: (period) => `${period}  ngày qua`,
                                                                currentMonth: "Tháng này",
                                                                pastMonth: "Tháng trước",
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
                                                    onClick={_HandleFresh.bind(this)}
                                                    type="button"
                                                    className="bg-green-50 hover:bg-green-200 hover:scale-105 group p-2 rounded-md transition-all ease-in-out animate-pulse hover:animate-none"
                                                >
                                                    <Refresh2
                                                        className="group-hover:-rotate-45 transition-all ease-in-out"
                                                        size="22"
                                                        color="green"
                                                    />
                                                </button>
                                                <div>
                                                    {dataExcel?.length > 0 && (
                                                        <ExcelFile
                                                            filename={dataLang?.returns_list || "returns_list"}
                                                            title="DSTH"
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
                                <div className="min:h-[200px] 3xl:h-[82%] 2xl:h-[82%] xl:h-[72%] lg:h-[82%] max:h-[400px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                    <div className="pr-2 w-[100%]">
                                        <div className="grid grid-cols-10 items-center sticky top-0 p-2 z-10 rounded-xl shadow-sm bg-white divide-x">
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center ">
                                                {dataLang?.import_day_vouchers || "import_day_vouchers"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center ">
                                                {dataLang?.import_code_vouchers || "import_code_vouchers"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center ">
                                                {dataLang?.import_supplier || "import_supplier"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center ">
                                                {dataLang?.import_total_amount || "import_total_amount"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center ">
                                                {dataLang?.import_tax_money || "import_tax_money"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center ">
                                                {dataLang?.import_into_money || "import_into_money"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center ">
                                                {dataLang?.returns_form || "returns_form"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center ">
                                                {dataLang?.import_brow_storekeepers || "import_brow_storekeepers"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center ">
                                                {dataLang?.import_branch || "import_branch"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center ">
                                                {dataLang?.import_action || "import_action"}
                                            </h4>
                                        </div>
                                        {onFetching ? (
                                            <Loading className="h-80" color="#0f4f9e" />
                                        ) : data?.length > 0 ? (
                                            <>
                                                <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px]">
                                                    {data?.map((e) => (
                                                        <div
                                                            className="relative  grid grid-cols-10 items-center py-1.5  hover:bg-slate-100/40 group"
                                                            key={e.id.toString()}
                                                        >
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-1 text-center">
                                                                {e?.date != null
                                                                    ? moment(e?.date).format("DD/MM/YYYY")
                                                                    : ""}
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] px-2 col-span-1 text-center text-[#0F4F9E] hover:text-[#5599EC] transition-all ease-linear cursor-pointer ">
                                                                <Popup_chitiet
                                                                    dataLang={dataLang}
                                                                    className="text-left"
                                                                    name={e?.code}
                                                                    id={e?.id}
                                                                />
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-1 text-left capitalize">
                                                                {e.supplier_name}
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-1 text-right">
                                                                {formatNumber(e.total_price)}
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-1 text-right">
                                                                {formatNumber(e.total_tax_price)}
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-1 text-right">
                                                                {formatNumber(e.total_amount)}
                                                            </h6>
                                                            <h6 className="col-span-1 mx-auto">
                                                                {(e?.treatment_methods === "1" && (
                                                                    <div className="cursor-default max-w-[120px] 3xl:w-[120px] 2xl:w-[108px] xl:w-[95px] w-full min-w-auto text-center 3xl:text-[11px] 2xl:text-[10px] xl:text-[8px] text-[7px] font-medium text-lime-500 bg-lime-200  border-lime-200  px-2 py-0.5 border  rounded-2xl ml-2">
                                                                        {dataLang?.pay_down || "pay_down"}
                                                                    </div>
                                                                )) ||
                                                                    (e?.treatment_methods === "2" && (
                                                                        <div className="cursor-default max-w-[120px] 3xl:w-[120px] 2xl:w-[108px] xl:w-[95px] w-full text-center 3xl:text-[11px] 2xl:text-[10px] xl:text-[8px] text-[7px] font-medium text-orange-500 bg-orange-200  border-orange-200 px-2 py-0.5 border   rounded-2xl ml-2">
                                                                            {dataLang?.debt_reduction ||
                                                                                "debt_reduction"}
                                                                        </div>
                                                                    ))}
                                                            </h6>
                                                            <h6 className=" 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-1">
                                                                <ButtonWarehouse
                                                                    warehouseman_id={e?.warehouseman_id}
                                                                    _HandleChangeInput={_HandleChangeInput}
                                                                    id={e?.id}
                                                                />
                                                            </h6>
                                                            <h6 className="col-span-1 w-fit mx-auto">
                                                                <div className="cursor-default 3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[8px] text-[#0F4F9E] font-[300] px-1.5 py-0.5 border border-[#0F4F9E] bg-white rounded-[5.5px] uppercase">
                                                                    {e?.branch_name}
                                                                </div>
                                                            </h6>
                                                            <div className="col-span-1 flex justify-center">
                                                                <BtnAction
                                                                    onRefresh={_ServerFetching.bind(this)}
                                                                    onRefreshGroup={_ServerFetching_group.bind(this)}
                                                                    dataLang={dataLang}
                                                                    warehouseman_id={e?.warehouseman_id}
                                                                    status_pay={e?.status_pay}
                                                                    id={e?.id}
                                                                    type="returns"
                                                                    className="bg-slate-100 xl:px-4 px-2 xl:py-1.5 py-1 rounded 2xl:text-base xl:text-xs text-[9px]"
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
                        <div className="grid grid-cols-10 bg-gray-100 items-center rounded-md">
                            <div className="col-span-3 p-2 text-center">
                                <h3 className="uppercase text-gray-600 font-medium 3xl:text-[14px] 2xl:text-[12px] xl:text-[11.5px] text-[9px]">
                                    {dataLang?.import_total || "import_total"}
                                </h3>
                            </div>
                            <div className="col-span-1 text-right">
                                <h3 className="2xl:text-base xl:text-xs text-zinc-600 font-medium text-[8px] px-4 col-span-1 text-right">
                                    {formatNumber(total?.total_price)}
                                </h3>
                            </div>
                            <div className="col-span-1 text-right ">
                                <h3 className="2xl:text-base xl:text-xs text-zinc-600 font-medium text-[8px] px-4 col-span-1 text-right">
                                    {formatNumber(total?.total_tax_price)}
                                </h3>
                            </div>
                            <div className="col-span-1 text-right">
                                <h3 className="2xl:text-base xl:text-xs text-zinc-600 font-medium text-[8px] px-4 col-span-1 text-right">
                                    {formatNumber(total?.total_amount)}
                                </h3>
                            </div>
                        </div>
                        {data?.length != 0 && (
                            <div className="flex space-x-5 items-center">
                                <h6 className="">
                                    {dataLang?.display} {totalItems?.iTotalDisplayRecords} {dataLang?.among}{" "}
                                    {totalItems?.iTotalRecords} {dataLang?.ingredient}
                                </h6>
                                <Pagination
                                    postsPerPage={limit}
                                    totalPosts={Number(totalItems?.iTotalDisplayRecords)}
                                    paginate={paginate}
                                    currentPage={router.query?.page || 1}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <PopupConfim
                dataLang={dataLang}
                type="warning"
                nameModel={"returnSales"}
                title={TITLE_STATUS}
                subtitle={CONFIRMATION_OF_CHANGES}
                isOpen={isOpen}
                save={handleSaveStatus}
                cancel={() => handleQueryId({ status: false })}
            />
        </React.Fragment>
    );
};

const TabStatus = React.memo((props) => {
    const router = useRouter();
    return (
        <button
            style={props.style}
            onClick={props.onClick}
            className={`${props.className} justify-center min-w-[180px] flex gap-2 2xl:text-sm xl:text-sm text-xs items-center rounded-[5.5px] px-2 py-2 outline-none relative `}
        >
            {router.query?.tab === `${props.active}` && <ArrowCircleDown size="20" color="#0F4F9E" />}
            {props.children}
            <span
                className={`${props?.total > 0 &&
                    "absolute min-w-[29px] top-0 right-0 bg-[#ff6f00] text-xs translate-x-2.5 -translate-y-2 text-white rounded-[100%] px-2 text-center items-center flex justify-center py-1.5"
                    } `}
            >
                {props?.total > 0 && props?.total}
            </span>
        </button>
    );
});

export default Index;
