import Select from "react-select";
import vi from "date-fns/locale/vi";
import React, { useState, useEffect } from "react";

import Head from "next/head";
import Link from "next/link";
import { debounce } from "lodash";
import moment from "moment/moment";
import { useRouter } from "next/router";
import ReactExport from "react-data-export";
import { registerLocale } from "react-datepicker";
import Datepicker from "react-tailwindcss-datepicker";
import { _ServerInstance as Axios } from "/services/axios";
import { Grid6 as IconExcel, SearchNormal1 as IconSearch, TickCircle } from "iconsax-react";
import "react-datepicker/dist/react-datepicker.css";
registerLocale("vi", vi);

import PopupDetailProduct from "./(PopupDetail)/PopupDetailProduct";
import PopupDetailQuote from "../priceQuote/(PopupDetail)/PopupDetailQuote";

import Loading from "@/components/UI/loading";
import BtnAction from "@/components/UI/BtnAction";
import TabFilter from "@/components/UI/TabFilter";
import Pagination from "@/components/UI/pagination";
import Zoom from "@/components/UI/zoomElement/zoomElement";
import OnResetData from "@/components/UI/btnResetData/btnReset";
import DropdowLimit from "@/components/UI/dropdowLimit/dropdowLimit";

import useToast from "@/hooks/useToast";
import { useToggle } from "@/hooks/useToggle";
import useStatusExprired from "@/hooks/useStatusExprired";
import PopupConfim from "@/components/UI/popupConfim/popupConfim";
import { CONFIRMATION_OF_CHANGES, TITLE_STATUS } from "@/constants/changeStatus/changeStatus";
import { routerSalesOrder } from "@/routers/sellingGoods";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const Index = (props) => {
    const dataLang = props.dataLang;

    const router = useRouter();

    const initialValue = {
        idBranch: null,
        idQuoteCode: null,
        idCustomer: null,
        valueDate: {
            startDate: null,
            endDate: null,
        },
    };
    const initialData = {
        data: [],
        dataExcel: [],
        listBr: [],
        listQuoteCode: [],
        listCustomer: [],
        listTabStatus: [],
    };

    const isShow = useToast();

    const trangthaiExprired = useStatusExprired();

    const { isOpen, isId, isIdChild: status, handleQueryId } = useToggle();

    const [initData, sInitData] = useState(initialData);

    const [valueChange, sValueChange] = useState(initialValue);

    const [onFetching, sOnFetching] = useState(false);

    const [onFetching_filter, sOnFetching_filter] = useState(false);

    const [totalItems, sTotalItems] = useState([]);

    const [keySearch, sKeySearch] = useState("");

    const [limit, sLimit] = useState(15);

    const [total, setTotal] = useState({});

    const [isExpanded, setIsExpanded] = useState(false);

    const toggleShowAll = () => setIsExpanded(!isExpanded);

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
            `/api_web/Api_sale_order/saleOrder/?csrf_protection=true`,
            {
                params: {
                    search: keySearch,
                    limit: limit,
                    page: router.query?.page || 1,
                    "filter[branch_id]": valueChange.idBranch != null ? valueChange.idBranch.value : null,
                    "filter[id]": valueChange.idQuoteCode != null ? valueChange.idQuoteCode?.value : null,
                    "filter[status_bar]": tabPage ?? null,
                    "filter[client_id]": valueChange.idCustomer != null ? valueChange.idCustomer.value : null,
                    "filter[start_date]":
                        valueChange.valueDate?.startDate != null ? valueChange.valueDate?.startDate : null,
                    "filter[end_date]": valueChange.valueDate?.endDate != null ? valueChange.valueDate?.endDate : null,
                },
            },
            (err, response) => {
                if (!err && response && response.data) {
                    let { rResult, output, rTotal } = response.data;
                    sInitData((e) => ({ ...e, data: rResult.map((e) => ({ ...e, show: false })), dataExcel: rResult }));
                    sTotalItems(output);
                    setTotal(rTotal);
                    sOnFetching(false);
                }
            }
        );
    };
    // fetch tab filter
    const _ServerFetching_group = async () => {
        await Axios(
            "GET",
            `/api_web/Api_sale_order/filterBar?csrf_protection=true`,
            {
                params: {
                    limit: 0,
                    search: keySearch,
                    "filter[branch_id]": valueChange.idBranch != null ? valueChange.idBranch.value : null,
                },
            },
            (err, response) => {
                if (!err) {
                    let data = response.data;
                    sInitData((e) => ({ ...e, listTabStatus: data }));
                }
                sOnFetching(false);
            }
        );
    };

    // filter
    const _ServerFetching_filter = async () => {
        await Axios("GET", `/api_web/Api_Branch/branch/?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                let { rResult } = response.data;
                sInitData((e) => ({ ...e, listBr: rResult?.map(({ name, id }) => ({ label: name, value: id })) }));
            }
        });
        await Axios("GET", `/api_web/Api_sale_order/saleOrderCombobox?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                let { result } = response.data;
                sInitData((e) => ({
                    ...e,
                    listQuoteCode: result?.map(({ code, id }) => ({ label: code, value: id })),
                }));
            }
        });
        await Axios("GET", "/api_web/api_client/client_option/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                let { rResult } = response.data;
                sInitData((e) => ({
                    ...e,
                    listCustomer: rResult?.map(({ name, id }) => ({ label: name, value: id })),
                }));
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
            valueChange.idBranch != null ||
            (valueChange.valueDate.startDate != null && valueChange.valueDate.endDate != null) ||
            valueChange.idCustomer != null ||
            valueChange.idQuoteCode != null
        ) {
            router.push({
                pathname: router.route,
                query: {
                    tab: router.query?.tab,
                },
            });
            setTimeout(() => {
                (valueChange.idBranch != null && sOnFetching(true)) ||
                    (valueChange.valueDate.startDate != null &&
                        valueChange.valueDate.endDate != null &&
                        sOnFetching(true)) ||
                    (valueChange.idCustomer != null && sOnFetching(true)) ||
                    (valueChange.idQuoteCode != null && sOnFetching(true)) ||
                    (keySearch && sOnFetching(true));
            }, 300);
        } else {
            sOnFetching(true);
        }
    }, [
        limit,
        valueChange.idBranch,
        valueChange.idQuoteCode,
        valueChange.idCustomer,
        valueChange.valueDate.endDate,
        valueChange.valueDate.startDate,
    ]);

    const onChangeFilter = (type) => (event) => sValueChange((e) => ({ ...e, [type]: event }));

    const paginate = (pageNumber) => {
        router.push({
            pathname: router.route,
            query: {
                tab: router.query?.tab,
                page: pageNumber,
            },
        });
    };

    const handleOnChangeKeySearch = debounce(({ target: { value } }) => {
        sKeySearch(value);
        router.replace({
            pathname: router.route,
            query: {
                tab: router.query?.tab,
            },
        });
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
                    title: `${dataLang?.sales_product_date || "sales_product_date"}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.sales_product_code || "sales_product_code"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.customer || "customer"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.sales_product_type_order || "sales_product_type_order"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.sales_product_quote || "sales_product_quote"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.sales_product_total || "sales_product_total"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.sales_product_staff_in_charge || "sales_product_staff_in_charge"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.status_table || "status_table"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.sales_product_order_process || "sales_product_order_process"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.note || "note"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.branch || "branch"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
            ],
            data: initData.dataExcel?.map((e) => [
                { value: `${e?.id ? e.id : ""}`, style: { numFmt: "0" } },
                { value: `${e?.date ? e?.date : ""}` },
                { value: `${e?.code ? e?.code : ""}` },
                { value: `${e?.client_name ? e?.client_name : ""}` },
                {
                    value: `${e?.quote_code !== null && e?.quote_id !== "0" ? "Phiếu báo giá" : "Tạo mới"}`,
                },
                { value: `${e?.quote_code ? e?.quote_code : ""}` },

                {
                    value: `${e?.total_amount ? formatNumber(e?.total_amount) : 0}`,
                },
                { value: `${e?.staff_name ? e?.staff_name : ""}` },
                {
                    value: `${
                        e?.status
                            ? (e?.status === "un_approved" && "Chưa duyệt") || (e?.status === "approved" && "Đã duyệt")
                            : ""
                    }`,
                },
                { value: `${e?.process ? e?.process : ""}` },
                { value: `${e?.note ? e?.note : ""}` },

                { value: `${e?.branch_name ? e?.branch_name : ""}` },
            ]),
        },
    ];

    const toggleStatus = () => {
        const index = initData.data.findIndex((x) => x.id === isId);

        let newStatus = "";

        if (initData.data[index].status === "approved") {
            newStatus = "un_approved";
        } else if (initData.data[index].status === "un_approved") {
            newStatus = "approved";
        }

        handlePostStatus(isId, newStatus);

        handleQueryId({ status: false });
    };

    const handlePostStatus = (id, newStatus) => {
        const formData = new FormData();
        formData.append("id", id);
        formData.append("status", newStatus);

        Axios(
            "POST",
            `/api_web/Api_sale_order/confirm/${id}/${newStatus}?csrf_protection=true`,
            {
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            },
            (err, response) => {
                if (!err) {
                    let { isSuccess, message } = response.data;

                    if (isSuccess !== false) {
                        isShow("success", `${dataLang?.change_status_when_order || "change_status_when_order"}`);
                    } else {
                        isShow("error", `${dataLang[message] || message}`);
                    }
                    _ServerFetching();
                    _ServerFetching_group();
                }
            }
        );
    };

    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.sales_product_list || "sales_product_list"} </title>
            </Head>
            <div className="3xl:pt-[88px] 2xl:pt-[74px] xl:pt-[60px] lg:pt-[60px] 3xl:px-6 3xl:pb-10 2xl:px-4 2xl:pb-8 xl:px-4 xl:pb-10 px-4 lg:pb-10 space-y-1 overflow-hidden h-screen">
                {trangthaiExprired ? (
                    <div className="p-4"></div>
                ) : (
                    <div className="flex space-x-1 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">{dataLang?.sales_product_list || "sales_product_list"}</h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.sales_product_list || "sales_product_list"}</h6>
                    </div>
                )}

                <div className="grid grid-cols gap-1 h-[100%] overflow-hidden">
                    <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden">
                        <div className="space-y-0.5 h-[96%] overflow-hidden">
                            <div className="flex justify-between">
                                <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                                    {dataLang?.sales_product_list || "sales_product_list"}
                                </h2>
                                <div className="flex justify-end items-center">
                                    <Link
                                        href={routerSalesOrder.form}
                                        className="3xl:text-sm 2xl:text-xs xl:text-xs text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105"
                                    >
                                        {dataLang?.btn_new || "btn_new"}
                                    </Link>
                                </div>
                            </div>

                            <div className="flex 2xl:space-x-3 lg:space-x-3 items-center 3xl:h-[8vh] 2xl:h-[7vh] xl:h-[8vh] lg:h-[7vh] justify-start overflow-hidden scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                {initData.listTabStatus &&
                                    initData.listTabStatus.map((e) => {
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
                            {/* table */}
                            <div className="space-y-2 3xl:h-[92%] 2xl:h-[88%] xl:h-[95%] lg:h-[90%] overflow-hidden">
                                {/* combobox search, excel */}
                                <div className="xl:space-y-1 space-y-2">
                                    <div className="bg-slate-100 w-full rounded-t-lg grid grid-cols-7 2xl:xl:p-2 xl:p-1.5 p-1.5 ">
                                        <div className="col-span-6">
                                            <div className="grid grid-cols-5 gap-2">
                                                <div className="col-span-1">
                                                    <form className="flex items-center relative ">
                                                        <IconSearch className="absolute 3xl:h-[20px] 2xl:h-[20px] xl:h-[19px] lg:h-[18px] 3xl:w-[20px] 2xl:w-[18px] xl:w-[19px] lg:w-[18px] z-10 3xl:left-[4%] 2xl:left-[4%] xl:left-[8%] lg:left-[10%] text-[#cccccc]" />
                                                        <input
                                                            className="3xl:text-[16px] 2xl:text-[16px] xl:text-[13px] lg:text-[12px] 2xl:text-left 2xl:pl-10 xl:pl-0 p-0 2xl:py-1.5  xl:py-2.5 lg:py-[11px] rounded 2xl:text-base text-xs xl:text-center text-center w-full  relative bg-white  outline-[#D0D5DD] focus:outline-[#0F4F9E] "
                                                            type="text"
                                                            onChange={(value) => handleOnChangeKeySearch(value)}
                                                            placeholder={dataLang?.branch_search}
                                                        />
                                                    </form>
                                                </div>
                                                <div className="col-span-1">
                                                    <Select
                                                        options={[
                                                            {
                                                                value: "",
                                                                label: dataLang?.select_branch || "select_branch",
                                                                isDisabled: true,
                                                            },
                                                            ...initData.listBr,
                                                        ]}
                                                        onChange={onChangeFilter("idBranch")}
                                                        value={valueChange.idBranch}
                                                        placeholder={dataLang?.branch || "branch"}
                                                        hideSelectedOptions={false}
                                                        isClearable={true}
                                                        className="3xl:text-[16px] 2xl:text-[16px] xl:text-[13px] lg:text-[12px] w-full rounded-xl bg-white z-20 "
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
                                                        isLoading={initData.listQuoteCode == [] ? true : false}
                                                        options={[
                                                            {
                                                                value: "",
                                                                label:
                                                                    dataLang?.sales_product_select_order ||
                                                                    "sales_product_select_order",
                                                                isDisabled: true,
                                                            },
                                                            ...initData.listQuoteCode,
                                                        ]}
                                                        onChange={onChangeFilter("idQuoteCode")}
                                                        value={valueChange.idQuoteCode}
                                                        placeholder={
                                                            dataLang?.sales_product_code || "sales_product_code"
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
                                                <div className="col-span-1">
                                                    <Select
                                                        options={[
                                                            {
                                                                value: "",
                                                                label: dataLang?.select_customer || "select_customer",
                                                                isDisabled: true,
                                                            },
                                                            ...initData.listCustomer,
                                                        ]}
                                                        onChange={onChangeFilter("idCustomer")}
                                                        value={valueChange.idCustomer}
                                                        placeholder={dataLang?.customer || "customer"}
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
                                                        value={valueChange.valueDate}
                                                        i18n={"vi"}
                                                        primaryColor={"blue"}
                                                        onChange={onChangeFilter("valueDate")}
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
                                                    {initData.dataExcel?.length > 0 && (
                                                        <ExcelFile
                                                            filename="Danh sách đơn hàng bán"
                                                            title="DSĐHB"
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
                                                    <DropdowLimit sLimit={sLimit} limit={limit} dataLang={dataLang} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* table */}
                                <div className="min:h-[200px] 3xl:h-[82%] 2xl:h-[82%] xl:h-[72%] lg:h-[82%] max:h-[400px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                    <div className="pr-2 w-[100%] lg:w-[100%] ">
                                        <div className="grid grid-cols-13 items-center sticky top-0 bg-white p-2 z-10 shadow divide-x">
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase col-span-1 font-[600] text-center whitespace-nowrap">
                                                {dataLang?.sales_product_date || "sales_product_date"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase col-span-1 font-[600] text-center">
                                                {dataLang?.sales_product_code || "sales_product_code"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase col-span-1 font-[600] text-left">
                                                {dataLang?.customer || "customer"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase col-span-1 font-[600] text-center">
                                                {dataLang?.sales_product_type_order || "sales_product_type_order"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase col-span-1 font-[600] text-center">
                                                {dataLang?.sales_product_total_into_money ||
                                                    "sales_product_total_into_money"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase col-span-1 font-[600] text-center">
                                                {dataLang?.sales_product_status || "sales_product_status"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase col-span-1 font-[600] text-center">
                                                {dataLang?.sales_product_statusTT || "sales_product_statusTT"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase col-span-1 font-[600] text-center">
                                                {dataLang?.branch || "branch"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase col-span-4 font-[600] text-center">
                                                {dataLang?.sales_product_order_process || "sales_product_order_process"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase col-span-1 font-[600] text-center">
                                                {dataLang?.sales_product_action || "sales_product_action"}
                                            </h4>
                                        </div>
                                        {/* {loading ? */}
                                        {onFetching ? (
                                            <Loading className="h-80" color="#0f4f9e" />
                                        ) : initData.data?.length > 0 ? (
                                            <>
                                                <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px] ">
                                                    {initData.data?.map((e) => (
                                                        <>
                                                            <div
                                                                className="relative grid grid-cols-13 items-center py-1.5 px-2 hover:bg-slate-100/40"
                                                                key={e.id.toString()}
                                                            >
                                                                <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px]  text-zinc-600 px-2 col-span-1 text-center ">
                                                                    {e?.date != null
                                                                        ? moment(e?.date).format("DD/MM/YYYY")
                                                                        : ""}
                                                                </h6>
                                                                <h6 className="3xl:text-base font-medium 2xl:text-[12.5px] xl:text-[11px] text-[9px] px-2 col-span-1 text-center text-[#0F4F9E] hover:text-blue-500 transition-all duration-200 ease-in-out cursor-pointer">
                                                                    <PopupDetailProduct
                                                                        dataLang={dataLang}
                                                                        className="text-left"
                                                                        name={e?.code ? e?.code : ""}
                                                                        id={e?.id}
                                                                    />
                                                                </h6>

                                                                <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px]  text-zinc-600 px-2 col-span-1 text-left ">
                                                                    {e?.client_name}
                                                                </h6>

                                                                {/* fix */}
                                                                <div className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9px] text-[8px] col-span-1 text-center">
                                                                    {e?.quote_code !== null && e?.quote_id !== "0" ? (
                                                                        // <div className="border  rounded-xl mx-auto w-2/3 group bg-lime-200 border-lime-200 text-lime-500">
                                                                        <Zoom
                                                                            whileHover={{ scale: 1.1 }}
                                                                            whileTap={{ scale: 0.9 }}
                                                                        >
                                                                            <div className="border font-medium flex justify-center items-center rounded-2xl mx-auto 3xl:w-24 2xl:w-20 xl:w-[74px] lg:w-16 3xl:h-6 2xl:h-6 xl:h-6 lg:h-5 px-1 bg-lime-200 border-lime-200 text-lime-500 ">
                                                                                {/* <div>Phiếu báo giá</div> */}
                                                                                {/* {"("}
                                                                            <PopupDetailQuote
                                                                                dataLang={dataLang}
                                                                                className="text-left group-hover:text-green-500"
                                                                                name={e?.quote_code ? e.quote_code : ""}
                                                                                id={e?.quote_id}
                                                                            />
                                                                            {")"} */}

                                                                                <PopupDetailQuote
                                                                                    dataLang={dataLang}
                                                                                    className="text-left "
                                                                                    name={"Phiếu báo giá"}
                                                                                    id={e?.quote_id}
                                                                                />
                                                                            </div>
                                                                        </Zoom>
                                                                    ) : (
                                                                        <div className="border font-medium flex justify-center items-center rounded-2xl mx-auto 3xl:w-24 2xl:w-20 xl:w-[74px] lg:w-16 3xl:h-6 2xl:h-6 xl:h-6 lg:h-5 px-1 bg-red-200 border-red-200 text-red-500">
                                                                            Tạo mới
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px]  text-zinc-600 px-2 col-span-1 text-right">
                                                                    {formatNumber(e.total_amount)}
                                                                </h6>

                                                                <h6 className="px-2 col-span-1 flex items-center justify-center text-center ">
                                                                    <h6 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9px] text-[8px] col-span-1 flex items-center justify-center text-center cursor-pointer">
                                                                        {(e?.status === "approved" && (
                                                                            <div
                                                                                className="3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[7px] 3xl:w-[120px] 3xl:h-8 2xl:w-[90px] 2xl:h-7 xl:w-[82px] xl:h-6 lg:w-[68px] lg:h-5 border-green-500 transition-all duration-300 ease-in-out text-green-500 hover:bg-green-500 hover:text-white border 3xl:px-0.5 py-1 rounded-md  font-normal flex justify-center items-center gap-1"
                                                                                onClick={() =>
                                                                                    handleQueryId({
                                                                                        id: e?.id,
                                                                                        status: true,
                                                                                        idChild: "approved",
                                                                                    })
                                                                                }
                                                                            >
                                                                                Đã Duyệt
                                                                                <TickCircle className="text-right 3xl:w-5 3xl:h-5 2xl:w-4 2xl:h-4  xl:w-3.5 xl:h-3.5 lg:w-3 lg:h-3 " />
                                                                            </div>
                                                                        )) ||
                                                                            (e?.status === "un_approved" && (
                                                                                <div
                                                                                    className="3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[7px] 3xl:w-[120px] 3xl:h-8 2xl:w-[90px] 2xl:h-7 xl:w-[82px] xl:h-6 lg:w-[68px] lg:h-5 hover:bg-red-500 transition-all duration-300 ease-in-out hover:text-white border border-red-500 px-0.5 py-1 rounded-md text-red-500 font-normal flex justify-center items-center gap-1"
                                                                                    onClick={() =>
                                                                                        handleQueryId({
                                                                                            id: e?.id,
                                                                                            status: true,
                                                                                            idChild: "un_approved",
                                                                                        })
                                                                                    }
                                                                                >
                                                                                    Chưa Duyệt
                                                                                    <TickCircle className="text-right 3xl:w-5 3xl:h-5 2xl:w-4 2xl:h-4  xl:w-3.5 xl:h-3.5 lg:w-3 lg:h-3" />
                                                                                </div>
                                                                            ))}
                                                                    </h6>
                                                                </h6>
                                                                <h6 className="col-span-1 ">
                                                                    {(["payment_unpaid"].includes(
                                                                        e?.status_payment
                                                                    ) && (
                                                                        <span className="block font-normal text-sky-500  rounded-xl py-1 px-2 w-full  bg-sky-200 text-center 3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[7px]">
                                                                            {dataLang[e?.status_payment] ||
                                                                                e?.status_payment}
                                                                        </span>
                                                                    )) ||
                                                                        (["payment_partially_paid"].includes(
                                                                            e?.status_payment
                                                                        ) && (
                                                                            <span className="block font-normal text-orange-500 rounded-xl py-1.5 px-2 w-full  bg-orange-200 text-center 3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[7px]">
                                                                                {dataLang[e?.status_payment] ||
                                                                                    e?.status_payment}{" "}
                                                                                {`(${formatNumber(e?.total_payment)})`}
                                                                            </span>
                                                                        )) ||
                                                                        (["payment_paid"].includes(
                                                                            e?.status_payment
                                                                        ) && (
                                                                            <span className="flex items-center justify-center gap-1 font-normal text-lime-500  rounded-xl py-1 px-2 w-full  bg-lime-200 text-center 3xl:text-[13px] 2xl:text-[10px] xl:text-[8px] text-[7px]">
                                                                                <TickCircle
                                                                                    className="bg-lime-500 rounded-full"
                                                                                    color="white"
                                                                                    size={15}
                                                                                />
                                                                                {dataLang[e?.status_payment] ||
                                                                                    e?.status_payment}
                                                                            </span>
                                                                        ))}
                                                                </h6>
                                                                <h6 className="col-span-1 w-fit mx-auto">
                                                                    <div className="cursor-default 3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[8px] text-[#0F4F9E] font-[300] px-1.5 py-0.5 border border-[#0F4F9E] bg-white rounded-[5.5px] uppercase">
                                                                        {e?.branch_name}
                                                                    </div>
                                                                </h6>

                                                                <div className=" col-span-4">
                                                                    <div className="flex items-start py-2 ml-3">
                                                                        {e?.process.map((item, i) => {
                                                                            const isValue = [
                                                                                "production_plan",
                                                                                "produced_at_company",
                                                                                "import_warehouse",
                                                                                "delivery",
                                                                            ].includes(item?.code);

                                                                            const isValueDelivery = [
                                                                                "delivery",
                                                                            ].includes(item?.code);

                                                                            return (
                                                                                <>
                                                                                    <div
                                                                                        className="relative"
                                                                                        key={`process-${i}`}
                                                                                    >
                                                                                        {![
                                                                                            "keep_stock",
                                                                                            "import_outsourcing",
                                                                                        ].includes(item?.code) && (
                                                                                            <>
                                                                                                <div className="flex items-center">
                                                                                                    <div
                                                                                                        className={`${
                                                                                                            item?.active
                                                                                                                ? `h-2 w-2 rounded-full bg-green-500`
                                                                                                                : `h-2 w-2 rounded-full bg-gray-400`
                                                                                                        } `}
                                                                                                    />
                                                                                                    {!isValueDelivery && (
                                                                                                        <div
                                                                                                            className={`${
                                                                                                                item?.active
                                                                                                                    ? `w-full bg-green-500 h-0.5 `
                                                                                                                    : `w-full bg-gray-200 h-0.5 dark:bg-gray-400`
                                                                                                            }`}
                                                                                                        />
                                                                                                    )}
                                                                                                </div>
                                                                                                <div className="mt-2 3xl:w-[120px] xxl:w-[90px] 2xl:w-[90px] xl:w-[70px] lg:w-[50px]">
                                                                                                    <div
                                                                                                        className={`${
                                                                                                            item?.active
                                                                                                                ? "text-green-500"
                                                                                                                : "text-slate-500"
                                                                                                        } block w-full text-center mb-2 3xl:text-[10px] xxl:text-[8px] 2xl:text-[8px] xl:text-[6px] lg:text-[5px] font-semibold leading-none  dark:text-gray-500 absolute 3xl:translate-x-[-38%] 2xl:translate-x-[-40%] xl:translate-x-[-40%] translate-x-[-40%] 3xl:translate-y-[-10%] 2xl:translate-y-[-20%] xl:translate-y-[-20%] translate-y-[-20%]`}
                                                                                                    >
                                                                                                        <div className="flex justify-center items-center w-full gap-1">
                                                                                                            <h6>
                                                                                                                {
                                                                                                                    dataLang[
                                                                                                                        item
                                                                                                                            ?.name
                                                                                                                    ]
                                                                                                                }
                                                                                                            </h6>
                                                                                                            {isValueDelivery && (
                                                                                                                <h6
                                                                                                                    className={`${
                                                                                                                        item?.active &&
                                                                                                                        isValueDelivery
                                                                                                                            ? "text-green-500"
                                                                                                                            : "text-orange-500"
                                                                                                                    } 3xl:text-[8px] xxl:text-[7px] 2xl:text-[7px] xl:text-[6px] lg:text-[4.5px] text-[6px]`}
                                                                                                                >{`(${
                                                                                                                    dataLang[
                                                                                                                        item
                                                                                                                            ?.status
                                                                                                                    ] ||
                                                                                                                    item?.status
                                                                                                                })`}</h6>
                                                                                                            )}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </>
                                                                                        )}
                                                                                        <p className="text-blue-700 cursor-pointer  3xl:text-[9.5px] xxl:text-[9px] 2xl:text-[9px] xl:text-[7.5px] lg:text-[6px] text-[7px]  left-0 3xl:-translate-x-[15%] 2xl:-translate-x-1/4 xl:-translate-x-1/4 lg:-translate-x-1/4 -translate-x-1/4 py-2 font-semibold">
                                                                                            {/* <p className="text-blue-700 cursor-pointer  3xl:text-[9.5px] xxl:text-[9px] 2xl:text-[9px] xl:text-[7.5px] lg:text-[6px] text-[7px]  left-0 3xl:-translate-x-[17%] 2xl:-translate-x-1/3 xl:-translate-x-1/3 lg:-translate-x-1/3 -translate-x-1/4 3xl:translate-y-[10%] xxl:translate-y-1/3 2xl:translate-y-1/3 xl:translate-y-1/2 lg:translate-y-full translate-y-1/2 font-semibold"> */}
                                                                                            {isValue &&
                                                                                                item?.reference &&
                                                                                                item?.reference
                                                                                                    .slice(
                                                                                                        0,
                                                                                                        isExpanded
                                                                                                            ? item
                                                                                                                  ?.reference
                                                                                                                  .length
                                                                                                            : 2
                                                                                                    )
                                                                                                    .map(
                                                                                                        (ci, index) => (
                                                                                                            <div
                                                                                                                className="flex-col flex"
                                                                                                                key={
                                                                                                                    index
                                                                                                                }
                                                                                                            >
                                                                                                                {
                                                                                                                    ci?.code
                                                                                                                }
                                                                                                            </div>
                                                                                                        )
                                                                                                    )}
                                                                                            {item?.reference &&
                                                                                                item?.reference.length >
                                                                                                    2 && (
                                                                                                    <button
                                                                                                        onClick={
                                                                                                            toggleShowAll
                                                                                                        }
                                                                                                    >
                                                                                                        {isExpanded
                                                                                                            ? "Rút gọn"
                                                                                                            : "Xem thêm"}
                                                                                                    </button>
                                                                                                )}
                                                                                        </p>
                                                                                    </div>
                                                                                </>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>

                                                                <div className="col-span-1 flex justify-center">
                                                                    <BtnAction
                                                                        onRefresh={_ServerFetching.bind(this)}
                                                                        dataLang={dataLang}
                                                                        status={e?.status}
                                                                        id={e?.id}
                                                                        type="sales_product"
                                                                        className="bg-slate-100 xl:px-4 px-2 xl:py-1.5 py-1 rounded 2xl:text-base xl:text-xs text-[9px]"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </>
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            <div className=" max-w-[352px] mt-24 mx-auto">
                                                <div className="text-center">
                                                    <div className="bg-[#EBF4FF] rounded-[100%] inline-block ">
                                                        <IconSearch />
                                                    </div>
                                                    <h1 className="text-[#141522] text-base opacity-90 font-medium">
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
                        <div className="grid grid-cols-13 bg-gray-100 items-center">
                            <div className="col-span-3 p-2 text-center">
                                <h3 className="uppercase font-normal 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] text-[9px]">
                                    {dataLang?.total_outside || "total_outside"}
                                </h3>
                            </div>
                            <div className="col-span-2 text-right justify-end pr-4 flex gap-2 flex-wrap ">
                                <h3 className="font-normal 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] text-[9px]">
                                    {formatNumber(total?.total_amount)}
                                </h3>
                            </div>
                            <div className="col-span-1 text-right justify-end p-2 flex gap-2 flex-wrap">
                                <h3 className="font-normal 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] text-[9px]"></h3>
                            </div>
                        </div>
                        {initData.data?.length != 0 && (
                            <div className="flex space-x-5 items-center 3xl:mt-4 2xl:mt-4 xl:mt-4 lg:mt-2 3xl:text-[18px] 2xl:text-[16px] xl:text-[14px] lg:text-[14px]">
                                <h6>
                                    {dataLang?.price_quote_total_outside} {totalItems?.iTotalDisplayRecords} đơn hàng
                                    bán
                                </h6>
                                <Pagination
                                    postsPerPage={limit}
                                    totalPosts={Number(totalItems?.iTotalDisplayRecords)}
                                    paginate={paginate}
                                    currentPage={router.query?.page ? router.query?.page : 1}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <PopupConfim
                dataLang={dataLang}
                type="warning"
                nameModel={"salesOrder"}
                title={TITLE_STATUS}
                subtitle={CONFIRMATION_OF_CHANGES}
                isOpen={isOpen}
                status={status}
                save={toggleStatus}
                cancel={() => handleQueryId({ status: false })}
            />
        </React.Fragment>
    );
};

export default Index;
