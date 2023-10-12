import vi from "date-fns/locale/vi";
import React, { useState } from "react";
import Select from "react-select";
import PopupDetailQuote from "./(PopupDetail)/PopupDetailQuote";
import BtnAction from "../../../components/UI/BtnAction";
import TabFilter from "../../../components/UI/TabFilter";
import Pagination from "/components/UI/pagination";
import Loading from "components/UI/loading";
import Swal from "sweetalert2";
import ReactExport from "react-data-export";
import Head from "next/head";
import dynamic from "next/dynamic";
import Link from "next/link";
import moment from "moment/moment";
import Datepicker from "react-tailwindcss-datepicker";
import { useRouter } from "next/router";
import { registerLocale } from "react-datepicker";
import { _ServerInstance as Axios } from "/services/axios";
import { useEffect } from "react";
import { debounce } from "lodash";
import { Grid6 as IconExcel, SearchNormal1 as IconSearch, TickCircle } from "iconsax-react";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import OnResetData from "components/UI/btnResetData/btnReset";
registerLocale("vi", vi);

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
    const [listQuoteCode, sListQuoteCode] = useState([]);
    const [listCustomer, sListCustomer] = useState([]);
    const [idBranch, sIdBranch] = useState(null);
    const [idQuoteCode, sIdQuoteCode] = useState(null);
    const [idCustomer, sIdCustomer] = useState(null);
    const [listTabStatus, sListTabStatus] = useState();
    const [valueDate, sValueDate] = useState({
        startDate: null,
        endDate: null,
    });
    const trangthaiExprired = useSelector((state) => state?.trangthaiExprired);

    const [loading, setLoading] = useState(false);
    const [onSending, sOnSending] = useState(null);

    const [action, sAction] = useState("price_quote");

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
        setLoading(true);
        Axios(
            "GET",
            `/api_web/Api_quotation/quotation/?csrf_protection=true`,
            {
                params: {
                    search: keySearch,
                    limit: limit,
                    page: router.query?.page || 1,
                    "filter[branch_id]": idBranch != null ? idBranch.value : null,
                    "filter[id]": idQuoteCode != null ? idQuoteCode?.value : null,
                    "filter[status_bar]": tabPage ?? null,
                    "filter[client_id]": idCustomer ? idCustomer.value : null,
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
                    setLoading(false);
                }

                sOnFetching(false);
            }
        );
    };

    // fetch tab filter
    const _ServerFetching_group = () => {
        Axios(
            "GET",
            `/api_web/Api_quotation/filterBar?csrf_protection=true`,
            {
                params: {
                    limit: 0,
                    search: keySearch,
                    "filter[branch_id]": idBranch != null ? idBranch.value : null,
                },
            },
            (err, response) => {
                if (!err) {
                    var data = response.data;
                    sListTabStatus(data);
                }
                sOnFetching(false);
            }
        );
    };

    // filter
    const _ServerFetching_filter = () => {
        Axios("GET", `/api_web/Api_Branch/branch/?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                var { rResult } = response.data;
                sListBr(rResult);
            }
        });
        Axios("GET", `/api_web/Api_quotation/quotationCombobox/?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                var rResult = response.data.result;
                sListQuoteCode(rResult);
            }
        });
        Axios("GET", "/api_web/api_client/client_option/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                var db = response.data.rResult;
                sListCustomer(db?.map((e) => ({ label: e.name, value: e.id })));
            }
        });
        sOnFetching_filter(false);
    };

    useEffect(() => {
        (onFetching && _ServerFetching()) || (onFetching && _ServerFetching_group());
    }, [onFetching]);
    useEffect(() => {
        onFetching_filter && _ServerFetching_filter();
    }, [onFetching_filter]);

    useEffect(() => {
        (router.query.tab && sOnFetching(true)) || (router.query?.tab && sOnFetching_filter(true));
    }, [limit, router.query?.page, router.query?.tab]);

    useEffect(() => {
        if (
            idBranch != null ||
            (valueDate.startDate != null && valueDate.endDate != null) ||
            idCustomer != null ||
            idQuoteCode != null
        ) {
            router.push({
                pathname: router.route,
                query: {
                    tab: router.query?.tab,
                },
            });
            setTimeout(() => {
                (idBranch != null && sOnFetching(true) && _ServerFetching_group()) ||
                    (idQuoteCode != null && sOnFetching(true) && _ServerFetching_group()) ||
                    (idCustomer != null && sOnFetching(true) && _ServerFetching_group()) ||
                    (valueDate.startDate != null &&
                        valueDate.endDate != null &&
                        sOnFetching(true) &&
                        _ServerFetching_group()) ||
                    (keySearch && sOnFetching(true) && _ServerFetching_group());
            }, 300);
        } else {
            sOnFetching(true);
            _ServerFetching_group();
        }
    }, [limit, idBranch, idQuoteCode, idCustomer, valueDate.endDate, valueDate.startDate]);

    const listBr_filter = listBr ? listBr?.map((e) => ({ label: e.name, value: e.id })) : [];

    const listCode_filter = listQuoteCode ? listQuoteCode?.map((e) => ({ label: e.reference_no, value: e.id })) : [];

    const typeChange = {
        branch: sIdBranch,
        code: sIdQuoteCode,
        customer: sIdCustomer,
        date: sValueDate,
    };

    const onChangeFilter = (type, value) => {
        const updateFunction = typeChange[type];
        if (updateFunction) {
            updateFunction(value);
        }
        console.log(type, value);
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

    const _HandleOnChangeKeySearch = debounce(({ target: { value } }) => {
        sKeySearch(value);
        router.replace({
            pathname: router.route,
            query: {
                tab: router.query?.tab,
            },
        });
        if (!value) {
            sOnFetching(true);
        }
        sOnFetching(true);
    }, 500);

    const formatNumber = (number) => {
        if (!number && number !== 0) return 0;
        const integerPart = Math.floor(number);
        return integerPart.toLocaleString("en");
    };

    // excel
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
                    title: `${dataLang?.price_quote_date || "price_quote_date"}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.price_quote_code || "price_quote_code"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.price_quote_customer || "price_quote_customer"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.price_quote_total || "price_quote_total"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.price_quote_tax_money || "price_quote_tax_money"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.price_quote_into_money || "price_quote_into_money"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.price_quote_effective_date || "price_quote_effective_date"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.price_quote_order_status || "price_quote_order_status"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.price_quote_branch || "price_quote_branch"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.price_quote_note || "price_quote_note"}`,
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
                { value: `${e?.reference_no ? e?.reference_no : ""}` },
                { value: `${e?.client_name ? e?.client_name : ""}` },
                // tiền chưa!
                {
                    value: `${e?.total_price ? formatNumber(e?.total_price) : ""}`,
                },
                {
                    value: `${e?.total_tax_price ? formatNumber(e?.total_tax_price) : ""}`,
                },
                {
                    value: `${e?.total_amount ? formatNumber(e?.total_amount) : ""}`,
                },

                { value: `${e?.validity ? e?.validity : ""}` },
                // order status chưa
                // {value: `${e?.import_status ? e?.import_status === "0" && "Chưa chi" || e?.import_status === "1" && "Chi 1 phần" ||  e?.import_status === "2"  &&"Đã chi đủ" : ""}`},
                {
                    value: `${
                        e?.status
                            ? (e?.status === "not_confirmed" && "Chưa duyệt") ||
                              (e?.status === "confirmed" && "Đã duyệt") ||
                              (e?.status === "no_confirmed" && "Không duyệt") ||
                              (e?.status === "ordered" && "Đã tạo đơn đặt hàng")
                            : ""
                    }`,
                },

                { value: `${e?.branch_name ? e?.branch_name : ""}` },
                { value: `${e?.note ? e?.note : ""}` },
            ]),
        },
    ];

    // chuyen doi trang thai don bao gia
    const _ToggleStatus = (id) => {
        const index = data.findIndex((x) => x.id === id);

        Swal.fire({
            title: `${"Thay đổi trạng thái"}`,
            icon: "warning",
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonColor: "#0F4F9E",
            denyButtonColor: "#d33",
            cancelButtonColor: "gray",
            confirmButtonText: `${
                data[index].status === "confirmed" ? dataLang?.aler_not_yet_approved : dataLang?.aler_approved
            }`,
            denyButtonText: `${
                data[index].status === "no_confirmed" ? dataLang?.aler_not_yet_approved : dataLang?.aler_no_approved
            }`,
            cancelButtonText: `${dataLang?.aler_cancel}`,
            didOpen: () => {
                const confirmButton = document.querySelector(".swal2-confirm");
                confirmButton.classList.add("w-32");
            },
        }).then((result) => {
            if (result.isConfirmed) {
                let newStatus = "";

                if (data[index].status === "not_confirmed") {
                    newStatus = "confirmed";
                } else if (data[index].status === "confirmed") {
                    newStatus = "not_confirmed";
                } else if (data[index].status === "no_confirmed") {
                    newStatus = "confirmed";
                }

                _ServerPostStatus(id, newStatus);
            }
            if (result.isDenied) {
                const newStatus = data[index].status === "no_confirmed" ? "not_confirmed" : "no_confirmed";

                _ServerPostStatus(id, newStatus);
            }
        });
    };

    const handleToggleOrdered = (id) => {
        const index = data.findIndex((x) => x.id === id);

        if (data[index].status === "ordered") {
            Toast.fire({
                icon: "error",
                title: `${dataLang?.no_change_status_when_order || "no_change_status_when_order"}`,
            });
        }
    };

    const _ServerPostStatus = (id, newStatus) => {
        const formData = new FormData();

        formData.append("id", id);
        formData.append("status", newStatus);

        Axios(
            "POST",
            `/api_web/Api_quotation/changeStatus/${id}/${newStatus}?csrf_protection=true`,
            {
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            },
            (err, response) => {
                if (!err) {
                    var { isSuccess } = response.data;

                    if (isSuccess !== false) {
                        Toast.fire({
                            icon: "success",
                            title: `${dataLang?.change_status_when_order || "change_status_when_order"}`,
                        });
                    }
                    sOnSending(false);
                    _ServerFetching();
                    _ServerFetching_group();
                }
            }
        );
    };

    // search

    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.price_quote || "price_quote"} </title>
            </Head>
            <div className="3xl:pt-[88px] 2xl:pt-[74px] xl:pt-[60px] lg:pt-[60px] 3xl:px-10 3xl:pb-10 2xl:px-10 2xl:pb-8 xl:px-10 xl:pb-10 lg:px-5 lg:pb-10 space-y-1 overflow-hidden h-screen">
                {/* trangthaiExprired */}
                {trangthaiExprired ? (
                    <div className="p-4"></div>
                ) : (
                    <div className="flex space-x-1 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">{dataLang?.price_quote || "price_quote"}</h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.price_quote_list || "price_quote"}</h6>
                    </div>
                )}

                <div className="grid grid-cols gap-1 h-[100%] overflow-hidden">
                    <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden">
                        <div className="space-y-0.5 h-[96%] overflow-hidden">
                            <div className="flex justify-between">
                                <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                                    {dataLang?.price_quote || "price_quote"}
                                </h2>
                                <div className="flex justify-end items-center">
                                    <Link
                                        href="/sales_export_product/priceQuote/form"
                                        className="3xl:text-sm 2xl:text-xs xl:text-xs text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105"
                                    >
                                        {dataLang?.btn_new || "btn_new"}
                                    </Link>
                                </div>
                            </div>

                            <div className="flex 2xl:space-x-3 lg:space-x-3 items-center 3xl:h-[8vh] 2xl:h-[7vh] xl:h-[8vh] lg:h-[7vh] justify-start overflow-hidden scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                {listTabStatus &&
                                    listTabStatus.map((e) => {
                                        return (
                                            <div>
                                                <TabFilter
                                                    style={{
                                                        backgroundColor: "#e2f0fe",
                                                    }}
                                                    dataLang={dataLang}
                                                    key={e?.id}
                                                    onClick={_HandleSelectTab.bind(this, `${e?.id}`)}
                                                    total={e?.count}
                                                    active={e?.id}
                                                    className={"text-[#0F4F9E]"}
                                                >
                                                    {dataLang[e?.name]}
                                                </TabFilter>
                                            </div>
                                        );
                                    })}
                            </div>
                            <div className="space-y-2 3xl:h-[92%] 2xl:h-[88%] xl:h-[95%] lg:h-[90%] overflow-hidden">
                                <div className="xl:space-y-1 space-y-2">
                                    <div className="bg-slate-100 w-full rounded-t-lg grid grid-cols-7 2xl:xl:p-2 xl:p-1.5 p-1.5">
                                        <div className="col-span-6">
                                            <div className="grid grid-cols-5 gap-2">
                                                <div className="col-span-1">
                                                    <form className="flex items-center relative ">
                                                        <IconSearch className="absolute 3xl:h-[20px] 2xl:h-[20px] xl:h-[19px] lg:h-[18px] 3xl:w-[20px] 2xl:w-[18px] xl:w-[19px] lg:w-[18px] z-10 3xl:left-[4%] 2xl:left-[4%] xl:left-[8%] lg:left-[10%] text-[#cccccc]" />
                                                        <input
                                                            className="3xl:text-[16px] 2xl:text-[16px] xl:text-[13px] lg:text-[12px] 2xl:text-left 2xl:pl-10 xl:pl-0 p-0 2xl:py-1.5  xl:py-2.5 lg:py-[11px] rounded 2xl:text-base text-xs xl:text-center text-center w-full  relative bg-white  outline-[#D0D5DD] focus:outline-[#0F4F9E] "
                                                            type="text"
                                                            onChange={_HandleOnChangeKeySearch.bind(this)}
                                                            placeholder={dataLang?.branch_search}
                                                        />
                                                    </form>
                                                </div>
                                                <div className="col-span-1">
                                                    <Select
                                                        options={[
                                                            {
                                                                value: "",
                                                                label:
                                                                    dataLang?.price_quote_branch ||
                                                                    "price_quote_branch",
                                                                isDisabled: true,
                                                            },
                                                            ...listBr_filter,
                                                        ]}
                                                        onChange={onChangeFilter.bind(this, "branch")}
                                                        value={idBranch}
                                                        placeholder={
                                                            dataLang?.price_quote_select_branch ||
                                                            "price_quote_select_branch"
                                                        }
                                                        hideSelectedOptions={false}
                                                        isClearable={true}
                                                        className="3xl:text-[16px] 2xl:text-[16px] xl:text-[13px] lg:text-[12px] w-full rounded-xl bg-white z-20"
                                                        isSearchable={true}
                                                        noOptionsMessage={() => "Không có dữ liệu"}
                                                        // components={{ MultiValue }}
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
                                                <div className="col-span-1">
                                                    <Select
                                                        options={[
                                                            {
                                                                value: "",
                                                                label:
                                                                    dataLang?.price_quote_select_code ||
                                                                    "price_quote_select_code",
                                                                isDisabled: true,
                                                            },
                                                            ...listCode_filter,
                                                        ]}
                                                        onChange={onChangeFilter.bind(this, "code")}
                                                        value={idQuoteCode}
                                                        placeholder={dataLang?.price_quote_code || "price_quote_code"}
                                                        hideSelectedOptions={false}
                                                        isClearable={true}
                                                        className="3xl:text-[16px] 2xl:text-[16px] xl:text-[13px] lg:text-[12px] w-full rounded-md bg-white z-20"
                                                        isSearchable={true}
                                                        noOptionsMessage={() => "Không có dữ liệu"}
                                                        // components={{ MultiValue }}
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
                                                <div className="col-span-1">
                                                    <Select
                                                        //  options={listBr_filter}
                                                        options={[
                                                            {
                                                                value: "",
                                                                label:
                                                                    dataLang?.price_quote_select_customer ||
                                                                    "price_quote_select_customer",
                                                                isDisabled: true,
                                                            },
                                                            ...listCustomer,
                                                        ]}
                                                        onChange={onChangeFilter.bind(this, "customer")}
                                                        value={idCustomer}
                                                        placeholder={
                                                            dataLang?.price_quote_customer || "price_quote_customer"
                                                        }
                                                        hideSelectedOptions={false}
                                                        isClearable={true}
                                                        className="3xl:text-[16px] 2xl:text-[16px] xl:text-[13px] lg:text-[12px] w-full rounded-md bg-white z-20"
                                                        isSearchable={true}
                                                        noOptionsMessage={() => "Không có dữ liệu"}
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
                                                <div className="z-20 col-span-1">
                                                    <Datepicker
                                                        value={valueDate}
                                                        i18n={"vi"}
                                                        primaryColor={"blue"}
                                                        onChange={onChangeFilter.bind(this, "date")}
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
                                                        className="react-datepicker__input-container"
                                                        inputClassName="rounded-md w-full 2xl:p-2 xl:p-[9px] py-[11px] xl:px-0 px-2 bg-white focus:outline-[#0F4F9E] 3xl:text-[16px] 2xl:text-[16px] xl:text-[13px] lg:text-[10px] 3xl:placeholder:text-xs 2xl:placeholder:text-[13px] xl:placeholder:text-[10px] lg:placeholder:text-[8px] border-none focus:outline-none focus:ring-0 focus:border-transparent"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-1">
                                            <div className="flex justify-end items-center gap-2">
                                                <OnResetData sOnFetching={sOnFetching} />
                                                <div>
                                                    {dataExcel?.length > 0 && (
                                                        <ExcelFile
                                                            filename="Danh sách báo giá"
                                                            title="DSBG"
                                                            element={
                                                                <button className="3xl:px-4 2xl:px-3 xl:px-3 lg:px-2 3xl:py-2.5 2xl:py-2 xl:py-2 lg:py-2.5 3xl:text-[15px] 2xl:text-[13px] xl:text-[12px] lg:text-[8px] flex items-center space-x-2 bg-[#C7DFFB] rounded hover:scale-105 transition">
                                                                    <IconExcel
                                                                        className="3xl:scale-100 2xl:scale-100 xl:scale-100 lg:scale-75"
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
                                                <div>
                                                    <div className="font-[300] text-slate-400 3xl:text-xs 2xl:text-xs xl:text-[10px] lg:text-[6px]">
                                                        {dataLang?.display}
                                                    </div>
                                                    <select
                                                        className="outline-none text-[10px] xl:text-xs 2xl:text-sm"
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
                                    <div className="pr-2 w-[100%] lg:w-[100%] ">
                                        <div className="grid grid-cols-12 items-center sticky top-0 bg-white p-2 z-10 shadow divide-x">
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase col-span-1 font-[600] text-center whitespace-nowrap">
                                                {dataLang?.price_quote_date || "price_quote_table_date"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase col-span-1 font-[600] text-center">
                                                {dataLang?.price_quote_code || "price_quote_table_code"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase col-span-2 font-[600] text-left">
                                                {dataLang?.price_quote_customer || "price_quote_table_customer"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase col-span-1 font-[600] text-center">
                                                {dataLang?.price_quote_total || "price_quote_table_total"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase col-span-1 font-[600] text-center">
                                                {dataLang?.price_quote_tax_money || "price_quote_tax_money"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase col-span-1 font-[600] text-center">
                                                {dataLang?.price_quote_into_money || "price_quote_into_money"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase col-span-1 font-[600] text-center">
                                                {dataLang?.price_quote_effective_date ||
                                                    "price_quote_table_effective_date"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase col-span-1 font-[600] text-center">
                                                {dataLang?.price_quote_order_status || "price_quote_order_status"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase col-span-1 font-[600] text-left">
                                                {dataLang?.price_quote_note || "price_quote_note"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase col-span-1 font-[600] text-center">
                                                {dataLang?.price_quote_branch || "price_quote_branch"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase col-span-1 font-[600] text-center">
                                                {dataLang?.price_quote_operations || "price_quote_operations"}
                                            </h4>
                                        </div>
                                        {loading ? (
                                            <Loading className="h-80" color="#0f4f9e" />
                                        ) : data?.length > 0 ? (
                                            <>
                                                <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px] ">
                                                    {data?.map((e) => (
                                                        <div
                                                            className="relative grid grid-cols-12 items-center py-1.5 px-2 hover:bg-slate-100/40"
                                                            key={e.id.toString()}
                                                        >
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] text-[9px] px-2 col-span-1 text-center">
                                                                {e?.date != null
                                                                    ? moment(e?.date).format("DD/MM/YYYY")
                                                                    : ""}
                                                            </h6>

                                                            <h6 className="3xl:text-base font-medium 2xl:text-[12.5px] xl:text-[11px] text-[9px] px-2 col-span-1 text-center text-[#0F4F9E] hover:text-blue-500 transition-all duration-200 ease-in-out cursor-pointer">
                                                                <PopupDetailQuote
                                                                    dataLang={dataLang}
                                                                    className="text-left"
                                                                    name={e?.reference_no}
                                                                    id={e?.id}
                                                                />
                                                            </h6>

                                                            <h6 className="3xl:text-base 2xl:text-[14px] xl:text-xs text-[8px] px-2 col-span-2 text-left ">
                                                                {e.client_name}
                                                            </h6>

                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] text-[9px] px-2 col-span-1 text-right">
                                                                {formatNumber(e.total_price)}
                                                            </h6>

                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] text-[9px] px-2 col-span-1 text-right ">
                                                                {formatNumber(e.total_tax_price)}
                                                            </h6>

                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] text-[9px] px-2 col-span-1 text-right">
                                                                {formatNumber(e.total_amount)}
                                                            </h6>

                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] text-[9px] col-span-1 text-center ">
                                                                {e?.validity != null
                                                                    ? moment(e?.validity).format("DD/MM/YYYY")
                                                                    : ""}
                                                            </h6>

                                                            <h6 className="px-2 col-span-1 flex items-center justify-center text-center ">
                                                                <h6 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9px] text-[8px] col-span-1 flex items-center justify-center text-center cursor-pointer">
                                                                    {(e?.status === "confirmed" && (
                                                                        <div
                                                                            className="3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[7px] 3xl:w-[120px] 3xl:h-8 2xl:w-[90px] 2xl:h-7 xl:w-[82px] xl:h-6 lg:w-[68px] lg:h-5 border-green-500 text-green-500 hover:bg-green-500  transition-all duration-300 ease-in-out hover:text-white border 3xl:px-0.5 py-1 rounded-md  font-normal flex justify-center items-center gap-1"
                                                                            onClick={() => _ToggleStatus(e?.id)}
                                                                        >
                                                                            Đã Duyệt
                                                                            <TickCircle className="text-right 3xl:w-5 3xl:h-5 2xl:w-4 2xl:h-4  xl:w-3.5 xl:h-3.5 lg:w-3 lg:h-3 " />
                                                                        </div>
                                                                    )) ||
                                                                        (e?.status === "not_confirmed" && (
                                                                            <div
                                                                                className="3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[7px] 3xl:w-[120px] 3xl:h-8 2xl:w-[90px] 2xl:h-7 xl:w-[82px] xl:h-6 lg:w-[68px] lg:h-5 hover:bg-red-500 hover:text-white border  transition-all duration-300 ease-in-out border-red-500 px-0.5 py-1 rounded-md text-red-500 font-normal flex justify-center items-center gap-1"
                                                                                onClick={() => _ToggleStatus(e?.id)}
                                                                            >
                                                                                Chưa Duyệt{" "}
                                                                                <TickCircle className="text-right 3xl:w-5 3xl:h-5 2xl:w-4 2xl:h-4  xl:w-3.5 xl:h-3.5 lg:w-3 lg:h-3" />
                                                                            </div>
                                                                        )) ||
                                                                        (e?.status === "no_confirmed" && (
                                                                            <div
                                                                                className="3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[7px] 3xl:w-[120px] 3xl:h-8 2xl:w-[90px] 2xl:h-7 xl:w-[82px] xl:h-6 lg:w-[68px] lg:h-5 border-sky-500 text-sky-500 hover:bg-sky-500  transition-all duration-300 ease-in-out hover:text-white border px-0.5 py-1 rounded-md font-normal flex justify-center items-center gap-1 "
                                                                                onClick={() => _ToggleStatus(e?.id)}
                                                                            >
                                                                                Không Duyệt
                                                                                <TickCircle className="text-right 3xl:w-5 3xl:h-5 2xl:w-4 2xl:h-4  xl:w-3.5 xl:h-3.5 lg:w-3 lg:h-3" />
                                                                            </div>
                                                                        )) ||
                                                                        (e?.status === "ordered" && (
                                                                            <div
                                                                                className="3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[7px] 3xl:w-[120px] 3xl:h-8 2xl:w-[90px] 2xl:h-7 xl:w-[82px] xl:h-6 lg:w-[68px] lg:h-6 relative text-white border border-orange-400  transition-all duration-300 ease-in-out rounded-md bg-orange-500 hover:bg-orange-600 text-left 3xl:px-3 3xl:py-5 3xl:pr-5 2xl:px-1 2xl:py-4 2xl:pr-5 xl:px-1 xl:py-3.5 xl:pr-4 lg:px-1 lg:py-2 lg:pr-3 font-normal flex justify-center items-center"
                                                                                onClick={() =>
                                                                                    handleToggleOrdered(e?.id)
                                                                                }
                                                                            >
                                                                                Đã Tạo Đơn Đặt Hàng
                                                                                <TickCircle className=" absolute 3xl:top-[30%] 3lx:-right-[-5%] 2xl:top-[25%] 2lx:-right-[-5%] xl:top-[25%] xl:-right-[-5%] lg:top-[30%] lg:-right-[-5%] 3xl:w-5 3xl:h-5 2xl:w-4 2xl:h-4 xl:w-3.5 xl:h-3.5 lg:w-3 lg:h-3 text-white border-orange-400" />
                                                                            </div>
                                                                        ))}
                                                                </h6>
                                                            </h6>

                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] text-[9px] px-2 col-span-1 text-left h-60px truncate ">
                                                                {e?.note}
                                                            </h6>

                                                            <h6 className="col-span-1 w-fit ">
                                                                <div className="cursor-default 3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[8px] text-[#086FFC] font-[300] px-1.5 py-0.5 border border-[#086FFC] bg-white rounded-[5.5px] uppercase">
                                                                    {e?.branch_name}
                                                                </div>
                                                            </h6>

                                                            <div className="col-span-1 flex justify-center">
                                                                <BtnAction
                                                                    onRefresh={_ServerFetching.bind(this)}
                                                                    dataLang={dataLang}
                                                                    status={e?.status}
                                                                    id={e?.id}
                                                                    type="price_quote"
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
                                                        {dataLang?.price_quote_table_item_not_found ||
                                                            "price_quote_table_item_not_found"}
                                                    </h1>
                                                    <div className="flex items-center justify-around mt-6 "></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-12 bg-gray-100 items-center">
                            <div className="col-span-4 p-2 text-left">
                                <h3 className="uppercase font-normal 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] text-[9px]">
                                    {dataLang?.price_quote_total_outside || "price_quote_total_outside"}
                                </h3>
                            </div>
                            <div className="col-span-1 text-right justify-end p-2 flex gap-2 flex-wrap">
                                <h3 className="font-normal 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] text-[9px]">
                                    {formatNumber(total?.total_price)}
                                </h3>
                            </div>
                            <div className="col-span-1 text-right justify-end p-2 flex gap-2 flex-wrap ">
                                <h3 className="font-normal 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] text-[9px]">
                                    {formatNumber(total?.total_tax_price)}
                                </h3>
                            </div>
                            <div className="col-span-1 text-right justify-end p-2 flex gap-2 flex-wrap">
                                <h3 className="font-normal 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] text-[9px]">
                                    {formatNumber(total?.total_amount)}
                                </h3>
                            </div>
                        </div>
                        {data?.length != 0 && (
                            <div className="flex space-x-5 items-center 3xl:mt-4 2xl:mt-4 xl:mt-4 lg:mt-2 3xl:text-[18px] 2xl:text-[16px] xl:text-[14px] lg:text-[14px]">
                                {/* <h6>{dataLang?.display}  {totalItems?.iTotalDisplayRecords}</h6> */}
                                <h6>
                                    {dataLang?.price_quote_total_outside} {totalItems?.iTotalDisplayRecords} phiếu báo
                                    giá
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
        </React.Fragment>
    );
};

export default Index;
