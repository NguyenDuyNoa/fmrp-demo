import vi from "date-fns/locale/vi";
import React, { useState } from "react";
import Select from "react-select";
import PopupDetailQuote from "../priceQuote/(PopupDetail)/PopupDetailQuote";
import PopupDetailProduct from "./(PopupDetail)/PopupDetailProduct";
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
import { IoIosArrowDropright } from "react-icons/io";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import OnResetData from "components/UI/btnResetData/btnReset";
import { motion } from "framer-motion";
import Popup from "reactjs-popup";
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
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [dataExcel, sDataExcel] = useState([]);
    const [onFetching, sOnFetching] = useState(false);
    const [onFetching_filter, sOnFetching_filter] = useState(false);
    const [totalItems, sTotalItems] = useState([]);
    const [keySearch, sKeySearch] = useState("");
    const [limit, sLimit] = useState(15);
    const [total, setTotal] = useState({});
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
        console.log("router.query?.page : ", router.query?.page);
        Axios(
            "GET",
            `/api_web/Api_sale_order/saleOrder/?csrf_protection=true`,
            {
                params: {
                    search: keySearch,
                    limit: limit,
                    page: router.query?.page || 1,
                    // page: keySearch || idQuoteCode != null || idCustomer || valueDate?.startDate != null && valueDate?.endDate ? 1 : router.query?.page || 1,
                    "filter[branch_id]": idBranch != null ? idBranch.value : null,
                    "filter[id]": idQuoteCode != null ? idQuoteCode?.value : null,
                    "filter[status_bar]": tabPage ?? null,
                    "filter[client_id]": idCustomer != null ? idCustomer.value : null,
                    "filter[start_date]": valueDate?.startDate != null ? valueDate?.startDate : null,
                    "filter[end_date]": valueDate?.endDate != null ? valueDate?.endDate : null,
                },
            },
            (err, response) => {
                if (!err && response && response.data) {
                    var { rResult, output, rTotal } = response.data;
                    setLoading(false);
                    setData(
                        rResult.map((e) => ({
                            ...e,
                            show: false,
                            process: e.process.map((ce) => ({ ...ce, id: e?.id })),
                        }))
                    );
                    sTotalItems(output);
                    sDataExcel(rResult);
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
    const _ServerFetching_filter = async () => {
        await Axios("GET", `/api_web/Api_Branch/branch/?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                var { rResult } = response.data;
                sListBr(rResult);
            }
        });
        await Axios("GET", `/api_web/Api_sale_order/saleOrderCombobox?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                var rResult = response.data.result;
                sListQuoteCode(rResult);
            }
        });
        await Axios("GET", "/api_web/api_client/client_option/?csrf_protection=true", {}, (err, response) => {
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

    // useEffect(() => {
    //     router.query.tab && sOnFetching(true) || (keySearch && sOnFetching(true)) || router.query?.tab && sOnFetching_filter(true) || idBranch != null && sOnFetching(true) || idQuoteCode != null && sOnFetching(true) || idCustomer != null && sOnFetching(true) || valueDate.startDate != null && valueDate.endDate != null && sOnFetching(true)
    // }, [limit, router.query?.page, router.query?.tab, idBranch, idQuoteCode, idCustomer, valueDate.endDate, valueDate.startDate]);
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
                (idBranch != null && sOnFetching(true)) ||
                    (valueDate.startDate != null && valueDate.endDate != null && sOnFetching(true)) ||
                    (idCustomer != null && sOnFetching(true)) ||
                    (idQuoteCode != null && sOnFetching(true)) ||
                    (keySearch && sOnFetching(true));
            }, 300);
        } else {
            sOnFetching(true);
        }
    }, [limit, idBranch, idQuoteCode, idCustomer, valueDate.endDate, valueDate.startDate]);

    const listBr_filter = listBr ? listBr?.map((e) => ({ label: e.name, value: e.id })) : [];

    const listCode_filter = listQuoteCode ? listQuoteCode?.map((e) => ({ label: e.code, value: e.id })) : [];

    const typeChange = {
        branch: sIdBranch,
        code: sIdQuoteCode,
        customer: sIdCustomer,
        date: sValueDate,
    };

    const onChangeFilter = async (type, value) => {
        const updateFunction = await typeChange[type];
        if (updateFunction) {
            updateFunction(value);
        }
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
            data: dataExcel?.map((e) => [
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

    // chuyen doi trang thai don bao gia
    const toggleStatus = (id) => {
        const index = data.findIndex((x) => x.id === id);

        Swal.fire({
            title: `${"Thay đổi trạng thái"}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#0F4F9E",
            cancelButtonColor: "#d33",
            confirmButtonText: `${
                data[index].status === "approved" ? dataLang?.aler_not_yet_approved : dataLang?.aler_approved
            }`,
            cancelButtonText: `${dataLang?.aler_cancel}`,
            didOpen: () => {
                const confirmButton = document.querySelector(".swal2-confirm");
                confirmButton.classList.add("w-32");
                const cancelButton = document.querySelector(".swal2-cancel");
                cancelButton.classList.add("w-32");
            },
        }).then((result) => {
            if (result.isConfirmed) {
                let newStatus = "";

                if (data[index].status === "approved") {
                    newStatus = "un_approved";
                } else if (data[index].status === "un_approved") {
                    newStatus = "approved";
                }

                handlePostStatus(id, newStatus);
            }
        });
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
                    var { isSuccess, message } = response.data;

                    if (isSuccess !== false) {
                        Toast.fire({
                            icon: "success",
                            title: `${dataLang?.change_status_when_order || "change_status_when_order"}`,
                        });
                    } else {
                        Toast.fire({
                            icon: "error",
                            title: `${dataLang[message] || message}`,
                        });
                    }
                    _ServerFetching();
                    _ServerFetching_group();
                }
            }
        );
    };

    // toggle show process product
    const handleToggleShowProcessProduct = (id) => {
        const newData = data.map((e) => {
            if (e?.id == id) {
                return { ...e, show: !e.show };
            }
            return e;
        });
        setData([...newData]);
    };
    const [activeProcess, setActiveProcess] = useState({
        item: null,
        process: null,
        parent: null,
        index: null,
    });

    const handleProgressBarClick = (item, idParent, index) => {
        setActiveProcess(() => ({
            item: item,
            process: item.id,
            parent: idParent,
            index: index,
        }));
    };
    console.log(activeProcess.process);
    console.log(activeProcess.parent);
    console.log(data[activeProcess.parent]?.process[activeProcess.process]?.id);
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
                                        href="/sales_export_product/salesOrder/form"
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
                                                            ...listBr_filter,
                                                        ]}
                                                        onChange={onChangeFilter.bind(this, "branch")}
                                                        value={idBranch}
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
                                                        isLoading={listQuoteCode == [] ? true : false}
                                                        options={[
                                                            {
                                                                value: "",
                                                                label:
                                                                    dataLang?.sales_product_select_order ||
                                                                    "sales_product_select_order",
                                                                isDisabled: true,
                                                            },
                                                            ...listCode_filter,
                                                        ]}
                                                        onChange={onChangeFilter.bind(this, "code")}
                                                        value={idQuoteCode}
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
                                                            ...listCustomer,
                                                        ]}
                                                        onChange={onChangeFilter.bind(this, "customer")}
                                                        value={idCustomer}
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
                                                    <div className="font-[300] text-slate-400 3xl:text-xs 2xl:text-xs xl:text-[10px] lg:text-[6px]">
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

                                {/* table */}
                                <div className="min:h-[200px] 3xl:h-[82%] 2xl:h-[82%] xl:h-[72%] lg:h-[82%] max:h-[400px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                    <div className="pr-2 w-[100%] lg:w-[100%] ">
                                        <div className="grid grid-cols-11 items-center sticky top-0 bg-white p-2 z-10">
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[9px] text-[#667085] uppercase col-span-1 font-[600] text-center whitespace-nowrap">
                                                {dataLang?.sales_product_date || "sales_product_date"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[9px] text-[#667085] uppercase col-span-1 font-[600] text-center">
                                                {dataLang?.sales_product_code || "sales_product_code"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[9px] text-[#667085] uppercase col-span-1 font-[600] text-left">
                                                {dataLang?.customer || "customer"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[9px] text-[#667085] uppercase col-span-1 font-[600] text-center">
                                                {dataLang?.sales_product_type_order || "sales_product_type_order"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[9px] text-[#667085] uppercase col-span-1 font-[600] text-center">
                                                {dataLang?.sales_product_total_into_money ||
                                                    "sales_product_total_into_money"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[9px] text-[#667085] uppercase col-span-1 font-[600] text-center">
                                                {/* {dataLang?.status_table || "status_table"} */}
                                                {"Trạng thái ĐH"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[9px] text-[#667085] uppercase col-span-1 font-[600] text-center">
                                                {/* {dataLang?.status_table || "status_table"} */}
                                                {"Trạng thái TT"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[9px] text-[#667085] uppercase col-span-1 font-[600] text-center">
                                                {dataLang?.branch || "branch"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[9px] text-[#667085] uppercase col-span-2 font-[600] text-center">
                                                {dataLang?.sales_product_order_process || "sales_product_order_process"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[9px] text-[#667085] uppercase col-span-1 font-[600] text-center">
                                                {dataLang?.sales_product_action || "sales_product_action"}
                                            </h4>
                                        </div>
                                        {/* {loading ? */}
                                        {loading ? (
                                            <Loading className="h-80" color="#0f4f9e" />
                                        ) : data?.length > 0 ? (
                                            <>
                                                <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px] ">
                                                    {data?.map((e, index) => (
                                                        <>
                                                            <div
                                                                className="relative grid grid-cols-11 items-center py-1.5 px-2 hover:bg-slate-100/40"
                                                                key={e.id.toString()}
                                                            >
                                                                <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] text-[9px] px-2 col-span-1 text-center">
                                                                    {e?.date != null
                                                                        ? moment(e?.date).format("DD/MM/YYYY")
                                                                        : ""}
                                                                </h6>

                                                                <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] text-[9px] px-2 col-span-1 text-center text-[#0F4F9E] hover:font-normal cursor-pointer">
                                                                    <PopupDetailProduct
                                                                        dataLang={dataLang}
                                                                        className="text-left"
                                                                        name={e?.code ? e?.code : ""}
                                                                        id={e?.id}
                                                                    />
                                                                </h6>

                                                                <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] text-[9px] col-span-1 text-left ">
                                                                    {e?.client_name}
                                                                </h6>

                                                                {/* fix */}
                                                                <div className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9px] text-[8px] col-span-1 text-center">
                                                                    {e?.quote_code !== null && e?.quote_id !== "0" ? (
                                                                        <div className="border  rounded-xl mx-auto w-2/3 group  bg-lime-200 border-lime-200 text-lime-500">
                                                                            <div>Phiếu báo giá</div>
                                                                            {"("}
                                                                            <PopupDetailQuote
                                                                                dataLang={dataLang}
                                                                                className="text-left group-hover:text-green-500"
                                                                                name={e?.quote_code ? e.quote_code : ""}
                                                                                id={e?.quote_id}
                                                                            />
                                                                            {")"}
                                                                        </div>
                                                                    ) : (
                                                                        <div className="border flex justify-center items-center rounded-2xl mx-auto 3xl:w-24 2xl:w-20 xl:w-[74px] lg:w-16 3xl:h-6 2xl:h-6 xl:h-6 lg:h-5 px-1 bg-red-200 border-red-200 text-red-500">
                                                                            Tạo mới
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] text-[9px] px-2 col-span-1 text-right">
                                                                    {formatNumber(e.total_amount)}
                                                                </h6>

                                                                <h6 className="px-2 col-span-1 flex items-center justify-center text-center ">
                                                                    <h6 className="3xl:text-[12px] 2xl:text-[10px] xl:text-[9px] text-[8px] col-span-1 flex items-center justify-center text-center cursor-pointer">
                                                                        {(e?.status === "approved" && (
                                                                            <div
                                                                                className="3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[7px] 3xl:w-[120px] transition-all duration-300 ease-in-out 3xl:h-8 2xl:w-[90px] 2xl:h-7 xl:w-[82px] xl:h-6 lg:w-[68px] lg:h-5 border-green-500 text-green-500 hover:bg-green-500 hover:text-white  border 3xl:px-0.5 py-1 rounded-md  font-normal flex justify-center items-center gap-1"
                                                                                onClick={() => toggleStatus(e?.id)}
                                                                            >
                                                                                Đã Duyệt
                                                                                <TickCircle className="text-right 3xl:w-5 3xl:h-5 2xl:w-4 2xl:h-4  xl:w-3.5 xl:h-3.5 lg:w-3 lg:h-3 " />
                                                                            </div>
                                                                        )) ||
                                                                            (e?.status === "un_approved" && (
                                                                                <div
                                                                                    className="3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[7px] 3xl:w-[120px] transition-all duration-300 ease-in-out 3xl:h-8 2xl:w-[90px] 2xl:h-7 xl:w-[82px] xl:h-6 lg:w-[68px] lg:h-5 hover:bg-red-500 hover:text-white  border border-red-500 px-0.5 py-1 rounded-md text-red-500 font-normal flex justify-center items-center gap-1"
                                                                                    onClick={() => toggleStatus(e?.id)}
                                                                                >
                                                                                    Chưa Duyệt
                                                                                    <TickCircle className="text-right 3xl:w-5 3xl:h-5 2xl:w-4 2xl:h-4  xl:w-3.5 xl:h-3.5 lg:w-3 lg:h-3" />
                                                                                </div>
                                                                            ))}
                                                                    </h6>
                                                                </h6>
                                                                <h6 className="col-span-1 w-fit mx-auto">
                                                                    <div className="cursor-default 3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[8px] text-purple-500 font-[500] px-2 py-0.5 border border-purple-300 bg-purple-300 rounded-2xl">
                                                                        {"Chưa thanh toán"}
                                                                    </div>
                                                                </h6>
                                                                <h6 className="col-span-1 w-fit mx-auto">
                                                                    <div className="cursor-default 3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[8px] text-[#086FFC] font-[300] px-1.5 py-0.5 border border-[#086FFC] bg-white rounded-[5.5px] uppercase">
                                                                        {e?.branch_name}
                                                                    </div>
                                                                </h6>
                                                                <div className="col-span-2 mx-auto">
                                                                    <div className="items-center flex mb-2  justify-center ">
                                                                        {e?.process.map((item, i) => {
                                                                            return (
                                                                                <div className="">
                                                                                    <div
                                                                                        className="group"
                                                                                        key={`process-${i}`}
                                                                                        onClick={() =>
                                                                                            handleProgressBarClick(
                                                                                                item,
                                                                                                e?.id,
                                                                                                index
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        {item?.code && (
                                                                                            <div>
                                                                                                <div
                                                                                                    onClick={() =>
                                                                                                        handleProgressBarClick(
                                                                                                            item,
                                                                                                            e?.id,
                                                                                                            index
                                                                                                        )
                                                                                                    }
                                                                                                    className="flex cursor-pointer items-center relative "
                                                                                                >
                                                                                                    {/* <motion.div
                                                                                                        whileHover={{
                                                                                                            scale: 1.8,
                                                                                                        }}
                                                                                                    >
                                                                                                        <div
                                                                                                            className={` ${
                                                                                                                item?.code ==
                                                                                                                    "production_plan" ||
                                                                                                                item?.code ==
                                                                                                                    "produced_at_company" ||
                                                                                                                item?.code ==
                                                                                                                    "import_warehouse" ||
                                                                                                                item?.code ==
                                                                                                                    "delivery"
                                                                                                                    ? `h-[10px] w-[10px] rounded-full bg-green-500 animate-bounce`
                                                                                                                    : `h-[10px] w-[10px] rounded-full bg-gray-400 animate-bounce`
                                                                                                            } `}
                                                                                                        ></div>
                                                                                                    </motion.div> */}
                                                                                                    <Popup
                                                                                                        trigger={
                                                                                                            <div className=" ">
                                                                                                                <motion.div
                                                                                                                    whileHover={{
                                                                                                                        scale: 1.8,
                                                                                                                    }}
                                                                                                                >
                                                                                                                    <div
                                                                                                                        className={` ${
                                                                                                                            item?.code ==
                                                                                                                                "production_plan" ||
                                                                                                                            item?.code ==
                                                                                                                                "produced_at_company" ||
                                                                                                                            item?.code ==
                                                                                                                                "import_warehouse" ||
                                                                                                                            item?.code ==
                                                                                                                                "delivery"
                                                                                                                                ? `h-[10px] w-[10px] rounded-full bg-green-500 animate-bounce`
                                                                                                                                : `h-[10px] w-[10px] rounded-full bg-gray-400 animate-bounce`
                                                                                                                        } `}
                                                                                                                    ></div>
                                                                                                                </motion.div>
                                                                                                            </div>
                                                                                                        }
                                                                                                        position="top center"
                                                                                                        on={[
                                                                                                            "hover",
                                                                                                            "focus",
                                                                                                        ]}
                                                                                                    >
                                                                                                        <div className="flex flex-col transition-all duration-300 ease-linear bg-gray-700 px-2.5 py-0.5 rounded-xl">
                                                                                                            <div
                                                                                                                className={`text-center ${
                                                                                                                    item?.code ==
                                                                                                                        "production_plan" ||
                                                                                                                    item?.code ==
                                                                                                                        "produced_at_company" ||
                                                                                                                    item?.code ==
                                                                                                                        "import_warehouse" ||
                                                                                                                    item?.code ==
                                                                                                                        "delivery"
                                                                                                                        ? "text-green-500"
                                                                                                                        : "text-slate-500"
                                                                                                                } text-[13px]  leading-none px-2.5 py-1.5 font-semibold   text-white`}
                                                                                                            >
                                                                                                                {
                                                                                                                    dataLang[
                                                                                                                        item
                                                                                                                            ?.name
                                                                                                                    ]
                                                                                                                }
                                                                                                            </div>
                                                                                                            {item?.code ===
                                                                                                                "keep_stock" ||
                                                                                                            item?.code ===
                                                                                                                "delivery" ? (
                                                                                                                <p className="text-xs  p-0.5 border border-white text-white rounded-md font-normal">
                                                                                                                    Chưa
                                                                                                                    giữ
                                                                                                                    kho
                                                                                                                </p>
                                                                                                            ) : null}
                                                                                                            {item?.code ==
                                                                                                                "production_plan" ||
                                                                                                            item?.code ==
                                                                                                                "produced_at_company" ||
                                                                                                            item?.code ==
                                                                                                                "import_warehouse" ||
                                                                                                            item?.code ==
                                                                                                                "delivery" ? (
                                                                                                                <p className="text-xs py-1 text-white">
                                                                                                                    KHSX-030623012
                                                                                                                </p>
                                                                                                            ) : null}
                                                                                                        </div>
                                                                                                    </Popup>
                                                                                                    {item?.code !=
                                                                                                    "delivery" ? (
                                                                                                        <div
                                                                                                            className={`w-[35px] ${
                                                                                                                item?.code ==
                                                                                                                    "production_plan" ||
                                                                                                                item?.code ==
                                                                                                                    "produced_at_company" ||
                                                                                                                item?.code ==
                                                                                                                    "import_warehouse" ||
                                                                                                                item?.code ==
                                                                                                                    "delivery"
                                                                                                                    ? ` bg-green-500 h-0.5 `
                                                                                                                    : ` bg-gray-200 h-0.5 `
                                                                                                            }`}
                                                                                                        />
                                                                                                    ) : null}
                                                                                                </div>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                    {/* {activeProcess.process == activeProcess.parent &&
                                                                        index == activeProcess.index && (
                                                                            <div className="w-full mx-auto">
                                                                                <div
                                                                                    className={`text-center ${
                                                                                        activeProcess?.item?.code ==
                                                                                            "production_plan" ||
                                                                                        activeProcess?.item?.code ==
                                                                                            "produced_at_company" ||
                                                                                        activeProcess?.item?.code ==
                                                                                            "import_warehouse" ||
                                                                                        activeProcess?.item?.code ==
                                                                                            "delivery"
                                                                                            ? "text-green-500"
                                                                                            : "text-slate-500"
                                                                                    } text-[11px] font-semibold leading-none  dark:text-gray-500`}
                                                                                >
                                                                                    {
                                                                                        dataLang[
                                                                                            activeProcess?.item?.name
                                                                                        ]
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        )} */}
                                                                </div>
                                                                {/* <h6 className="col-span-1 w-fit mx-auto">
                                                                    {activeProcess.process == activeProcess.parent &&
                                                                    index == activeProcess.index &&
                                                                    (activeProcess?.item?.code === "keep_stock" ||
                                                                        activeProcess?.item?.code === "delivery") ? (
                                                                        <p className=" 3xl:text-[12px] 2xl:text-[12px] xl:text-[10px] lg:text-[9px]  p-0.5 border border-amber-600 text-amber-600 rounded-md font-normal">
                                                                            Chưa giữ kho
                                                                        </p>
                                                                    ) : null}
                                                                    {activeProcess.process == activeProcess.parent &&
                                                                    index == activeProcess.index &&
                                                                    (activeProcess?.item?.code == "production_plan" ||
                                                                        activeProcess?.item?.code ==
                                                                            "produced_at_company" ||
                                                                        activeProcess?.item?.code ==
                                                                            "import_warehouse" ||
                                                                        activeProcess?.item?.code == "delivery") ? (
                                                                        <p className=" 3xl:text-[12px] 2xl:text-[12px] xl:text-[10px] lg:text-[10px]  font-normal">
                                                                            KHSX-030623012
                                                                        </p>
                                                                    ) : null}
                                                                    {activeProcess.process == activeProcess.parent &&
                                                                    index == activeProcess.index &&
                                                                    (activeProcess?.code == "production_plan" ||
                                                                        activeProcess?.code == "produced_at_company" ||
                                                                        activeProcess?.code == "import_warehouse" ||
                                                                        activeProcess?.code == "delivery") ? (
                                                                        <p className="text-indigo-700 3xl:w-[100px] 2xl:w-[100px] xl:w-[100px] w-[100px] text-[9.5px] absolute left-0 3xl:translate-x-[-25%] 2xl:translate-x-[-20%] xl:translate-x-[-25%] translate-x-[-25%] 3xl:translate-y-[100%] 2xl:translate-y-[120%] xl:translate-y-110%] translate-y-[120%] font-semibold">
                                                                            KHSX-030623012
                                                                        </p>
                                                                    ) : null}
                                                                </h6> */}

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
                                                            {/* process product */}
                                                            {e?.show && (
                                                                <div className="items-center flex pl-10 mb-8">
                                                                    {e?.process.map((item, i) => {
                                                                        return (
                                                                            <>
                                                                                <div
                                                                                    className="relative 3xl:mb-8 2xl:mb-7 xl:mb-5 mb-4 3xl:pt-4 2xl:pt-2 xl:pt-2 pt-1"
                                                                                    key={`process-${i}`}
                                                                                >
                                                                                    {item?.code && (
                                                                                        <>
                                                                                            <div className="flex items-center">
                                                                                                <div
                                                                                                    className={`${
                                                                                                        item?.active ===
                                                                                                        false
                                                                                                            ? `h-3 w-3 rounded-full bg-gray-400`
                                                                                                            : `h-3 w-3 rounded-full bg-green-500`
                                                                                                    } `}
                                                                                                />
                                                                                                {item?.code !==
                                                                                                "delivery" ? (
                                                                                                    <div
                                                                                                        className={`${
                                                                                                            item?.active ===
                                                                                                            false
                                                                                                                ? `sm:flex xl:w-40 w-32 bg-gray-200 h-0.5 dark:bg-gray-400`
                                                                                                                : `sm:flex xl:w-40 w-32 bg-gray-200 h-0.5 dark:bg-green-500`
                                                                                                        }`}
                                                                                                    />
                                                                                                ) : null}
                                                                                            </div>
                                                                                            <div className="mt-2 w-24">
                                                                                                <div className="3xl:max-w-[180px] lg:max-w-[150px] mb-2 xl:text-xs text-[10px] font-normal leading-none text-gray-400 dark:text-gray-500 absolute 3xl:translate-x-[-38%] 2xl:translate-x-[-40%] xl:translate-x-[-40%] translate-x-[-40%] 3xl:translate-y-[-10%] 2xl:translate-y-[-20%] xl:translate-y-[-20%] translate-y-[-20%]">
                                                                                                    {
                                                                                                        dataLang[
                                                                                                            item?.name
                                                                                                        ]
                                                                                                    }
                                                                                                </div>
                                                                                            </div>
                                                                                        </>
                                                                                    )}
                                                                                    {item?.code === "keep_stock" ||
                                                                                    item?.code === "delivery" ? (
                                                                                        <p className="3xl:max-w-[180px] 2xl:max-w-[150px] xl:max-w-[130px] max-w-[100px] 3xl:text-[12px] 2xl:text-[12px] xl:text-[10px] lg:text-[9px] absolute left-0 3xl:translate-x-[-40%] 2xl:translate-x-[-45%] xl:translate-x-[-45%] translate-x-[-45%] 3xl:translate-y-[100%] 2xl:translate-y-[120%] xl:translate-y-[110%] translate-y-[120%] p-0.5 border border-amber-600 text-amber-600 rounded-md font-normal">
                                                                                            Chưa giữ kho
                                                                                        </p>
                                                                                    ) : null}
                                                                                    {item?.code == "production_plan" ||
                                                                                    item?.code ==
                                                                                        "produced_at_company" ||
                                                                                    item?.code == "import_warehouse" ||
                                                                                    item?.code == "delivery" ? (
                                                                                        <p className="3xl:w-[200px] 2xl:w-[200px] xl:w-[150px] w-[150px] 3xl:text-[12px] 2xl:text-[12px] xl:text-[10px] lg:text-[10px] absolute left-0 3xl:translate-x-[-25%] 2xl:translate-x-[-20%] xl:translate-x-[-25%] translate-x-[-25%] 3xl:translate-y-[50%] 2xl:translate-y-[60%] xl:translate-y-[60%] translate-y-[60%] font-normal">
                                                                                            KHSX-030623012
                                                                                        </p>
                                                                                    ) : null}
                                                                                </div>
                                                                            </>
                                                                        );
                                                                    })}
                                                                </div>
                                                            )}
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
                        <div className="grid grid-cols-11 bg-gray-100 items-center">
                            <div className="col-span-3 p-2 text-center">
                                <h3 className="uppercase font-normal 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] text-[9px]">
                                    {dataLang?.total_outside || "total_outside"}
                                </h3>
                            </div>
                            {/* <div className="col-span-1 text-right justify-end p-2 flex gap-2 flex-wrap">
                                <h3 className="font-normal 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] text-[9px]"></h3>
                            </div> */}
                            <div className="col-span-2 text-right justify-end pr-4 flex gap-2 flex-wrap ">
                                <h3 className="font-normal 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] text-[9px]">
                                    {formatNumber(total?.total_amount)}
                                </h3>
                            </div>
                            <div className="col-span-1 text-right justify-end p-2 flex gap-2 flex-wrap">
                                <h3 className="font-normal 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] text-[9px]"></h3>
                            </div>
                        </div>
                        {data?.length != 0 && (
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
        </React.Fragment>
    );
};

export default Index;
