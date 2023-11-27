import Select from "react-select";
import React, { useState } from "react";

import Head from "next/head";
import Link from "next/link";
import moment from "moment/moment";
import { useRouter } from "next/router";
import ReactExport from "react-data-export";
import Datepicker from "react-tailwindcss-datepicker";
import { _ServerInstance as Axios } from "/services/axios";
import { useEffect } from "react";
import { debounce } from "lodash";
import { Grid6 as IconExcel, SearchNormal1 as IconSearch } from "iconsax-react";
import "react-datepicker/dist/react-datepicker.css";
import ModalImage from "react-modal-image";
import PopupDetail from "./(popupDetail)/PopupDetail";
import PopupDetailProduct from "../sales_order/(PopupDetail)/PopupDetailProduct";

import Loading from "@/components/UI/loading";
import BtnAction from "@/components/UI/BtnAction";
import TabFilter from "@/components/UI/TabFilter";
import Pagination from "@/components/UI/pagination";
import ImageErrors from "@/components/UI/imageErrors";
import OnResetData from "@/components/UI/btnResetData/btnReset";
import PopupConfim from "@/components/UI/popupConfim/popupConfim";
import ButtonWarehouse from "@/components/UI/btnWarehouse/btnWarehouse";
import { routerDeliveryReceipt } from "routers/sellingGoods";

import useToast from "@/hooks/useToast";
import { useToggle } from "@/hooks/useToggle";
import useStatusExprired from "@/hooks/useStatusExprired";
import { CONFIRMATION_OF_CHANGES, TITLE_STATUS } from "@/constants/changeStatus/changeStatus";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const Index = (props) => {
    const dataLang = props.dataLang;

    const router = useRouter();

    const isShow = useToast();

    const trangthaiExprired = useStatusExprired();

    const [data, setData] = useState([]);

    const [dataExcel, sDataExcel] = useState([]);

    const [onFetching, sOnFetching] = useState(false);

    const [onFetching_filter, sOnFetching_filter] = useState(false);

    const { isOpen, isId, isKeyState, handleQueryId } = useToggle();

    const [totalItems, sTotalItems] = useState([]);

    const [keySearch, sKeySearch] = useState("");

    const [limit, sLimit] = useState(15);

    const [total, setTotal] = useState({});

    const [listBr, sListBr] = useState([]);

    const [listDelivery, sListDelivery] = useState([]);

    const [listCustomer, sListCustomer] = useState([]);

    const [idBranch, sIdBranch] = useState(null);

    const [idDelivery, sIdDelivery] = useState(null);

    const [idCustomer, sIdCustomer] = useState(null);

    const [listTabStatus, sListTabStatus] = useState();

    const [valueDate, sValueDate] = useState({ startDate: null, endDate: null });

    const _HandleSelectTab = (e) => {
        router.push({
            pathname: router.route,
            query: { tab: e },
        });
    };

    useEffect(() => {
        router.push({
            pathname: router.route,
            query: { tab: router.query?.tab ? router.query?.tab : -1 },
        });
    }, []);

    const _ServerFetching = () => {
        const tabPage = router.query?.tab;
        Axios(
            "GET",
            `/api_web/api_delivery/getDeliveries?csrf_protection=true`,
            {
                params: {
                    search: keySearch,
                    limit: limit,
                    page: router.query?.page || 1,
                    status: tabPage ? tabPage : -1,
                    branch_id: idBranch != null ? idBranch.value : null,
                    delivery_id: idDelivery != null ? idDelivery?.value : null,
                    customer_id: idCustomer != null ? idCustomer.value : null,
                    start_date: valueDate?.startDate != null ? valueDate?.startDate : null,
                    end_date: valueDate?.endDate != null ? valueDate?.endDate : null,
                },
            },
            (err, response) => {
                if (!err) {
                    let { rResult, output, rTotal } = response.data.data;
                    setData(rResult);
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
            `/api_web/api_delivery/statusDelivery?csrf_protection=true`,
            {
                params: {
                    limit: 0,
                    search: keySearch,
                    branch_id: idBranch != null ? idBranch.value : null,
                    delivery_id: idDelivery != null ? idDelivery?.value : null,
                    start_date: valueDate?.startDate != null ? valueDate?.startDate : null,
                    end_date: valueDate?.endDate != null ? valueDate?.endDate : null,
                    customer_id: idCustomer != null ? idCustomer.value : null,
                },
            },
            (err, response) => {
                if (!err) {
                    let { data } = response.data;
                    sListTabStatus(data?.status);
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
                sListBr(rResult);
            }
        });

        await Axios("GET", `/api_web/api_delivery/searchDelivery?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                let rResult = response.data.data;
                sListDelivery(rResult?.map((e) => ({ label: e?.reference_no, value: e?.id })));
            }
        });

        await Axios("GET", "/api_web/api_client/client_option/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                let db = response.data.rResult;
                sListCustomer(db?.map((e) => ({ label: e.name, value: e.id })));
            }
        });

        sOnFetching_filter(false);
    };

    let searchTimeout;

    const _HandleSeachApi = (inputValue) => {
        if (inputValue == "") {
            return;
        } else {
            clearTimeout(searchTimeout);

            searchTimeout = setTimeout(() => {
                Axios(
                    "POST",
                    `/api_web/api_delivery/searchDelivery?csrf_protection=true`,
                    {
                        data: {
                            term: inputValue,
                        },
                    },
                    (err, response) => {
                        if (!err) {
                            let result = response?.data;
                            sListCode(
                                result?.map((e) => ({
                                    label: `${e.reference_no}`,
                                    value: e.id,
                                }))
                            );
                        }
                    }
                );
            }, 500);
        }
    };

    useEffect(() => {
        onFetching_filter && _ServerFetching_filter();
    }, [onFetching_filter]);

    useEffect(() => {
        (onFetching && _ServerFetching()) || (onFetching && _ServerFetching_group());
    }, [onFetching]);

    // useEffect(() => {
    //     (router.query.tab && sOnFetching(true)) ||
    //         (keySearch && sOnFetching(true)) ||
    //         (router.query?.tab && sOnFetching_filter(true)) ||
    //         (idBranch != null && sOnFetching(true)) ||
    //         (valueDate.startDate != null && valueDate.endDate != null && sOnFetching(true)) ||
    //         (idCustomer != null && sOnFetching(true)) ||
    //         (idDelivery != null && sOnFetching(true));
    // }, [
    //     limit,
    //     router.query?.page,
    //     router.query?.tab,
    //     idBranch,
    //     valueDate.endDate,
    //     valueDate.startDate,
    //     idCustomer,
    //     idDelivery,
    // ]);

    useEffect(() => {
        (router.query.tab && sOnFetching(true)) || (router.query?.tab && sOnFetching_filter(true));
    }, [limit, router.query?.page, router.query?.tab]);

    useEffect(() => {
        if (
            idBranch != null ||
            (valueDate.startDate != null && valueDate.endDate != null) ||
            idCustomer != null ||
            idDelivery != null
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
                    (idDelivery != null && sOnFetching(true)) ||
                    (keySearch && sOnFetching(true));
            }, 300);
        } else {
            sOnFetching(true);
        }
    }, [limit, idBranch, idDelivery, idCustomer, valueDate.endDate, valueDate.startDate]);

    const listBr_filter = listBr ? listBr?.map((e) => ({ label: e.name, value: e.id })) : [];

    const typeChange = {
        branch: sIdBranch,
        code: sIdDelivery,
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
                    title: `${dataLang?.delivery_receipt_date || "delivery_receipt_date"}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.delivery_receipt_code || "delivery_receipt_code"}`,
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
                    title: `${dataLang?.delivery_receipt_address1 || "delivery_receipt_address1"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.delivery_receipt_OrderNumber || "delivery_receipt_OrderNumber"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.delivery_receipt_intoMoney || "delivery_receipt_intoMoney"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.delivery_receipt_Creator || "delivery_receipt_Creator"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.delivery_receipt_BrowseStorekeepers || "delivery_receipt_BrowseStorekeepers"}`,
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
                { value: `${e?.reference_no ? e?.reference_no : ""}` },
                { value: `${e?.name_client ? e?.name_client : ""}` },
                {
                    value: `${e?.name_address_delivery ? e?.name_address_delivery : ""}`,
                },
                { value: `${e?.reference_no_order ? e?.reference_no_order : ""}` },
                {
                    value: `${e?.grand_total ? formatNumber(e?.grand_total) : 0}`,
                },
                { value: `${e?.created_by_full_name ? e?.created_by_full_name : ""}` },
                {
                    value: `${e?.warehouseman_id === "0" ? "Chưa duyệt kho" : "Đã duyệt kho"}`,
                },
                { value: `${e?.note ? e?.note : ""}` },
                { value: `${e?.name_branch ? e?.name_branch : ""}` },
            ]),
        },
    ];

    const [checkedWare, sCheckedWare] = useState({});
    const [onSending, sOnSending] = useState(false);

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
            setData([...data]);
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
        let data = new FormData();
        data.append("warehouseman_id", checkedWare?.checkedpost != "0" ? checkedWare?.checkedpost : "");
        data.append("id", checkedWare?.id);
        Axios(
            "POST",
            `/api_web/Api_delivery/confirmWarehouse?csrf_protection=true`,
            {
                data: data,
                headers: { "Content-Type": "multipart/form-data" },
            },
            (err, response) => {
                if (!err) {
                    let { isSuccess, message, alert_type } = response?.data;
                    if (isSuccess) {
                        isShow(alert_type, dataLang[message]);
                        setTimeout(() => {
                            sOnFetching(true);
                        }, 300);
                    } else {
                        isShow(alert_type, dataLang[message]);
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

    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.delivery_receipt_list || "delivery_receipt_list"} </title>
            </Head>
            <div className="3xl:pt-[88px] 2xl:pt-[74px] xl:pt-[60px] lg:pt-[60px] 3xl:px-6 3xl:pb-10 2xl:px-4 2xl:pb-8 xl:px-4 xl:pb-10 px-4 lg:pb-10 space-y-1 overflow-hidden h-screen">
                {trangthaiExprired ? (
                    <div className="p-4"></div>
                ) : (
                    <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">
                            {dataLang?.delivery_receipt_list || "delivery_receipt_list"}
                        </h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.delivery_receipt_list || "delivery_receipt_list"}</h6>
                    </div>
                )}

                <div className="grid grid-cols gap-1 h-[100%] overflow-hidden">
                    <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden">
                        <div className="space-y-0.5 h-[96%] overflow-hidden">
                            <div className="flex justify-between  mt-1 mr-2">
                                <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                                    {dataLang?.delivery_receipt_list || "delivery_receipt_list"}
                                </h2>
                                <div className="flex justify-end items-center">
                                    <Link
                                        href={routerDeliveryReceipt.form}
                                        className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E]  via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105"
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
                                                    {e?.name}
                                                </TabFilter>
                                            </div>
                                        );
                                    })}
                            </div>
                            {/* table */}
                            <div className="space-y-2 3xl:h-[92%] 2xl:h-[88%] xl:h-[95%] lg:h-[90%] overflow-hidden">
                                <div className="xl:space-y-3 space-y-2">
                                    <div className="bg-slate-100 w-full rounded-lg grid grid-cols-7 justify-between xl:p-3 p-2">
                                        <div className="col-span-6">
                                            <div className="grid grid-cols-5 gap-2">
                                                <div className="col-span-1">
                                                    <form className="flex items-center relative ">
                                                        <IconSearch className="absolute 3xl:h-[20px] 2xl:h-[20px] xl:h-[19px] lg:h-[18px] 3xl:w-[20px] 2xl:w-[18px] xl:w-[19px] lg:w-[18px] z-10 3xl:left-[4%] 2xl:left-[4%] xl:left-[8%] lg:left-[10%] text-[#cccccc]" />
                                                        <input
                                                            className="3xl:text-[16px] 2xl:text-[16px] xl:text-[13px] lg:text-[12px] 2xl:text-left 2xl:pl-10 xl:pl-0 p-0 2xl:py-1.5  xl:py-2.5 lg:py-[11px] rounded 2xl:text-base text-xs xl:text-center text-center w-full  relative bg-white  outline-[#D0D5DD] focus:outline-[#0F4F9E] "
                                                            type="text"
                                                            onChange={handleOnChangeKeySearch.bind(this)}
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
                                                                    dataLang?.delivery_receipt_code ||
                                                                    "delivery_receipt_code",
                                                                isDisabled: true,
                                                            },
                                                            ...listDelivery,
                                                        ]}
                                                        onInputChange={_HandleSeachApi.bind(this)}
                                                        onChange={onChangeFilter.bind(this, "code")}
                                                        value={idDelivery}
                                                        placeholder={
                                                            dataLang?.delivery_receipt_code || "delivery_receipt_code"
                                                        }
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
                                                            filename={
                                                                dataLang?.delivery_receipt_list ||
                                                                "delivery_receipt_list"
                                                            }
                                                            title="DSPGH"
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
                                        <div className="grid grid-cols-12 items-center sticky top-0 p-2 z-10 rounded-xl shadow-sm bg-white divide-x">
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                                {dataLang?.delivery_receipt_date || "delivery_receipt_date"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                                {dataLang?.delivery_receipt_code || "delivery_receipt_code"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-2 text-center">
                                                {dataLang?.price_quote_customer || "price_quote_table_customer"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                                {dataLang?.delivery_receipt_address1 || "delivery_receipt_address1"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                                {dataLang?.delivery_receipt_OrderNumber ||
                                                    "delivery_receipt_OrderNumber"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                                {dataLang?.price_quote_into_money || "price_quote_into_money"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                                {dataLang?.delivery_receipt_Creator || "delivery_receipt_Creator"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                                {dataLang?.delivery_receipt_BrowseStorekeepers ||
                                                    "delivery_receipt_BrowseStorekeepers"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                                {dataLang?.price_quote_note || "price_quote_note"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                                {dataLang?.price_quote_branch || "price_quote_branch"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center">
                                                {dataLang?.price_quote_operations || "price_quote_operations"}
                                            </h4>
                                        </div>
                                        {onFetching ? (
                                            <Loading className="h-80" color="#0f4f9e" />
                                        ) : data?.length > 0 ? (
                                            <>
                                                <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px] ">
                                                    {data?.map((e) => (
                                                        <div
                                                            className="relative grid grid-cols-12 items-center py-1.5 px-2 hover:bg-slate-100/40"
                                                            key={e.id.toString()}
                                                        >
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-1 text-center">
                                                                {e?.date != null
                                                                    ? moment(e?.date).format("DD/MM/YYYY")
                                                                    : ""}
                                                            </h6>

                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px]  px-2 col-span-1 text-center text-[#0F4F9E] hover:text-blue-500 transition-all ease-linear  cursor-pointer">
                                                                <PopupDetail
                                                                    dataLang={dataLang}
                                                                    className="text-left"
                                                                    name={e?.reference_no}
                                                                    id={e?.id}
                                                                />
                                                            </h6>

                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-2 text-left ">
                                                                {e.name_client}
                                                            </h6>

                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-1 text-left">
                                                                {e.name_address_delivery}
                                                            </h6>
                                                            <PopupDetailProduct
                                                                dataLang={dataLang}
                                                                className="text-left"
                                                                name={
                                                                    <h1 className="col-span-1 3xl:text-[14px] 2xl:text-[12.5px] xl:text-[11px] font-normal text-[9px] text-[#0BAA2E] bg-[#EBFEF2] hover:bg-[#0BAA2E]/90 hover:text-[#EBFEF2] py-0.5 rounded-2xl border-[#0BAA2E]/5 border  cursor-pointer transition-all ease-in-out duration-200 text-center ">
                                                                        {e?.reference_no_order}
                                                                    </h1>
                                                                }
                                                                id={e?.order_id}
                                                            />
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-1 text-right">
                                                                {formatNumber(e.grand_total)}
                                                            </h6>

                                                            <h6 className="col-span-1 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 py-1  rounded-md text-left flex items-center space-x-1">
                                                                <div className="relative">
                                                                    <ModalImage
                                                                        small={
                                                                            e?.created_by_profile_image
                                                                                ? e?.created_by_profile_image
                                                                                : "/user-placeholder.jpg"
                                                                        }
                                                                        large={
                                                                            e?.created_by_profile_image
                                                                                ? e?.created_by_profile_image
                                                                                : "/user-placeholder.jpg"
                                                                        }
                                                                        className="h-6 w-6 rounded-full object-cover "
                                                                    >
                                                                        <div className="">
                                                                            <ImageErrors
                                                                                src={e?.created_by_profile_image}
                                                                                width={25}
                                                                                height={25}
                                                                                defaultSrc="/user-placeholder.jpg"
                                                                                alt="Image"
                                                                                className="object-cover  rounded-[100%] text-left cursor-pointer"
                                                                            />
                                                                        </div>
                                                                    </ModalImage>
                                                                    <span className="h-2 w-2 absolute 3xl:bottom-full 3xl:translate-y-[150%] 3xl:left-1/2  3xl:translate-x-[100%] 2xl:bottom-[80%] 2xl:translate-y-full 2xl:left-1/2 bottom-[50%] left-1/2 translate-x-full translate-y-full">
                                                                        <span className="inline-flex relative rounded-full h-2 w-2 bg-lime-500">
                                                                            <span className="animate-ping  inline-flex h-full w-full rounded-full bg-lime-400 opacity-75 absolute"></span>
                                                                        </span>
                                                                    </span>
                                                                </div>
                                                                <h6 className="capitalize">
                                                                    {e?.created_by_full_name}
                                                                </h6>
                                                            </h6>

                                                            <h6 className=" 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-1">
                                                                <ButtonWarehouse
                                                                    warehouseman_id={e?.warehouseman_id}
                                                                    _HandleChangeInput={_HandleChangeInput}
                                                                    id={e?.id}
                                                                />
                                                            </h6>

                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-1 text-right truncate">
                                                                {e?.note}
                                                            </h6>
                                                            <h6 className="col-span-1 w-fit mx-auto">
                                                                <div className="cursor-default 3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[8px] text-[#0F4F9E] font-[300] px-1.5 py-0.5 border border-[#0F4F9E] bg-white rounded-[5.5px] uppercase">
                                                                    {e?.name_branch}
                                                                </div>
                                                            </h6>

                                                            <div className="col-span-1 flex justify-center">
                                                                <BtnAction
                                                                    onRefresh={_ServerFetching.bind(this)}
                                                                    onRefreshGroup={_ServerFetching_group.bind(this)}
                                                                    dataLang={dataLang}
                                                                    warehouseman_id={e?.warehouseman_id}
                                                                    id={e?.id}
                                                                    type="deliveryReceipt"
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
                            <div className="col-span-5 p-2 text-center">
                                <h3 className="uppercase font-normal 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] text-[9px]">
                                    {dataLang?.total_outside || "total_outside"}
                                </h3>
                            </div>
                            <div className="col-span-2 text-right justify-end pr-4 flex gap-2 flex-wrap ">
                                <h3 className="font-normal 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] text-[9px] px-1">
                                    {formatNumber(total?.grand_total)}
                                </h3>
                            </div>
                            <div className="col-span-1 text-right justify-end p-2 flex gap-2 flex-wrap">
                                <h3 className="font-normal 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] text-[9px]"></h3>
                            </div>
                        </div>
                        {data?.length != 0 && (
                            <div className="flex space-x-5 items-center 3xl:mt-4 2xl:mt-4 xl:mt-4 lg:mt-2 3xl:text-[18px] 2xl:text-[16px] xl:text-[14px] lg:text-[14px]">
                                <h6>
                                    {dataLang?.price_quote_total_outside} {totalItems?.iTotalDisplayRecords}{" "}
                                    {dataLang?.delivery_receipt_edit_notes || "delivery_receipt_edit_notes"}
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
                nameModel={"deliveryReceipt"}
                title={TITLE_STATUS}
                subtitle={CONFIRMATION_OF_CHANGES}
                isOpen={isOpen}
                save={handleSaveStatus}
                cancel={() => handleQueryId({ status: false })}
            />
        </React.Fragment>
    );
};

export default Index;
