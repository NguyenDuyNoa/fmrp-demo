import React, { useState } from "react";
import Select from "react-select";
import BtnAction from "../../../components/UI/BtnAction";
import TabFilter from "../../../components/UI/TabFilter";
import Pagination from "/components/UI/pagination";
import Loading from "components/UI/loading";
import Swal from "sweetalert2";
import ReactExport from "react-data-export";
import Head from "next/head";
import Link from "next/link";
import moment from "moment/moment";
import Datepicker from "react-tailwindcss-datepicker";
import { useRouter } from "next/router";
import { _ServerInstance as Axios } from "/services/axios";
import { useEffect } from "react";
import { debounce } from "lodash";
import { Grid6 as IconExcel, SearchNormal1 as IconSearch, TickCircle } from "iconsax-react";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import OnResetData from "components/UI/btnResetData/btnReset";
import ModalImage from "react-modal-image";
import ImageErrors from "components/UI/imageErrors";
import PopupDetail from "./(popupDetail)/PopupDetail";
import ToatstNotifi from "components/UI/alerNotification/alerNotification";
import PopupDetailProduct from "../salesOrder/(PopupDetail)/PopupDetailProduct";
import { routerReturnSales } from "components/UI/router/sellingGoods";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const Index = (props) => {
    const dataLang = props.dataLang;
    const router = useRouter();
    const initsArr = {
        data: [],
        dataExcel: [],
        listBr: [],
        listCode: [],
        listCustomer: [],
        listStatus: [],
    };
    const initsId = {
        idBranch: null,
        idCode: null,
        idCustomer: null,
        valueDate: {
            startDate: null,
            endDate: null,
        },
    };
    const trangthaiExprired = useSelector((state) => state?.trangthaiExprired);
    const [idFillter, sIdFillter] = useState(initsId);
    const [listData, sListData] = useState(initsArr);
    const [onFetching, sOnFetching] = useState(false);
    const [onFetching_filter, sOnFetching_filter] = useState(false);
    const [totalItems, sTotalItems] = useState([]);
    const [keySearch, sKeySearch] = useState("");
    const [limit, sLimit] = useState(15);
    const [total, sTotal] = useState({});

    const _HandleSelectTab = (e) => {
        router.push({
            pathname: router.route,
            query: { tab: e },
        });
    };
    useEffect(() => {
        router.push({
            pathname: router.route,
            query: { tab: router.query?.tab ? router.query?.tab : "-1" },
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
                    start_date: idFillter.valueDate?.startDate != null ? idFillter.valueDate?.startDate : null,
                    end_date: idFillter.valueDate?.endDate != null ? idFillter.valueDate?.endDate : null,
                },
            },
            (err, response) => {
                if (!err) {
                    var { rResult, output, rTotal } = response.data.data;
                    sListData((e) => ({
                        ...e,
                        data: rResult,
                        dataExcel: rResult,
                    }));
                    sTotalItems(output);
                    sTotal(rTotal);
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
                    start_date: idFillter.valueDate?.startDate != null ? idFillter.valueDate?.startDate : null,
                    end_date: idFillter.valueDate?.endDate != null ? idFillter.valueDate?.endDate : null,
                },
            },
            (err, response) => {
                if (!err) {
                    var { data } = response.data;
                    sListData((e) => ({ ...e, listStatus: data?.status }));
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
                sListData((e) => ({ ...e, listBr: rResult.map((e) => ({ label: e.name, value: e.id })) }));
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
                            var result = response?.data;
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

    useEffect(() => {
        (router.query.tab && sOnFetching(true)) || (router.query?.tab && sOnFetching_filter(true));
    }, [limit, router.query?.page, router.query?.tab]);

    useEffect(() => {
        if (
            idFillter.idBranch != null ||
            (idFillter.valueDate.startDate != null && idFillter.valueDate.endDate != null)
        ) {
            router.push({
                pathname: router.route,
                query: {
                    tab: router.query?.tab,
                },
            });
            setTimeout(() => {
                (idFillter.idBranch != null && sOnFetching(true)) ||
                    (idFillter.valueDate.startDate != null &&
                        idFillter.valueDate.endDate != null &&
                        sOnFetching(true)) ||
                    (keySearch && sOnFetching(true));
            }, 300);
        } else {
            sOnFetching(true);
        }
    }, [
        limit,
        idFillter.idBranch,
        idFillter.idDelivery,
        idFillter.idCustomer,
        idFillter.valueDate.endDate,
        idFillter.valueDate.startDate,
    ]);

    const onChangeFilter = (type, value) => {
        sIdFillter((e) => ({ ...e, [type]: value }));
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
            data: listData.dataExcel?.map((e) => [
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
    const [data_export, sData_export] = useState([]);

    const _HandleChangeInput = (id, checkedUn, type, value) => {
        if (type === "browser") {
            Swal.fire({
                title: `${"Thay đổi trạng thái"}`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#296dc1",
                cancelButtonColor: "#d33",
                confirmButtonText: `${dataLang?.aler_yes}`,
                cancelButtonText: `${dataLang?.aler_cancel}`,
            }).then((result) => {
                if (result.isConfirmed) {
                    const checked = value.target.checked;
                    const warehousemanId = value.target.value;
                    const dataChecked = {
                        checked: checked,
                        warehousemanId: warehousemanId,
                        id: id,
                        checkedpost: checkedUn,
                    };
                    sCheckedWare(dataChecked);
                }
                setData([...data]);
            });
        }
    };

    const _ServerSending = () => {
        var data = new FormData();
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
                    var { isSuccess, message, alert_type, data_export } = response.data;
                    if (isSuccess) {
                        ToatstNotifi(alert_type, dataLang[message]);
                        setTimeout(() => {
                            sOnFetching(true);
                        }, 300);
                    } else {
                        ToatstNotifi(alert_type, dataLang[message]);
                    }
                    if (data_export?.length > 0) {
                        sData_export(data_export);
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
                <title>{"Trả lại hàng bán"} </title>
            </Head>
            <div className="3xl:pt-[88px] 2xl:pt-[74px] xl:pt-[60px] lg:pt-[60px] 3xl:px-6 3xl:pb-10 2xl:px-4 2xl:pb-8 xl:px-4 xl:pb-10 px-4 lg:pb-10 space-y-1 overflow-hidden h-screen">
                {trangthaiExprired ? (
                    <div className="p-4"></div>
                ) : (
                    <div className="flex space-x-1 mt-4 3xl:text-sm 2xl:text-[11px] xl:text-[10px] lg:text-[10px]">
                        <h6 className="text-[#141522]/40">{"Bán & Xuất hàng"}</h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{"Trả lại hàng bán"}</h6>
                    </div>
                )}

                <div className="grid grid-cols gap-1 h-[100%] overflow-hidden">
                    <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden">
                        <div className="space-y-0.5 h-[96%] overflow-hidden">
                            <div className="flex justify-between  mt-1 mr-2">
                                <h2 className="3xl:text-2xl 2xl:text-xl xl:text-lg text-base text-[#52575E] capitalize">
                                    {"Trả lại hàng bán"}
                                </h2>
                                <div className="flex justify-end items-center">
                                    <Link
                                        href={routerReturnSales.form}
                                        className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E]  via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105"
                                    >
                                        {dataLang?.btn_new || "btn_new"}
                                    </Link>
                                </div>
                            </div>
                            <div className="flex 2xl:space-x-3 lg:space-x-3 items-center 3xl:h-[8vh] 2xl:h-[7vh] xl:h-[8vh] lg:h-[7vh] justify-start overflow-hidden scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                {listData.listStatus &&
                                    listData.listStatus.map((e) => {
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
                                                            ...listData.listBr,
                                                        ]}
                                                        onChange={onChangeFilter.bind(this, "idBranch")}
                                                        value={idFillter.idBranch}
                                                        placeholder={
                                                            dataLang?.price_quote_select_branch ||
                                                            "price_quote_select_branch"
                                                        }
                                                        hideSelectedOptions={false}
                                                        isClearable={true}
                                                        className="3xl:text-[16px] 2xl:text-[16px] xl:text-[13px] lg:text-[12px] w-full rounded-xl bg-white z-20"
                                                        isSearchable={true}
                                                        noOptionsMessage={() => "Không có dữ liệu"}
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
                                                            ...listData.listCode,
                                                        ]}
                                                        onInputChange={_HandleSeachApi.bind(this)}
                                                        onChange={onChangeFilter.bind(this, "idCode")}
                                                        value={idFillter.idCode}
                                                        placeholder={
                                                            dataLang?.delivery_receipt_code || "delivery_receipt_code"
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
                                                                label:
                                                                    dataLang?.price_quote_select_customer ||
                                                                    "price_quote_select_customer",
                                                                isDisabled: true,
                                                            },
                                                            ...listData.listCustomer,
                                                        ]}
                                                        onChange={onChangeFilter.bind(this, "idCustomer")}
                                                        value={idFillter.idCustomer}
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
                                                        value={idFillter.valueDate}
                                                        i18n={"vi"}
                                                        primaryColor={"blue"}
                                                        onChange={onChangeFilter.bind(this, "valueDate")}
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
                                                    {listData.dataExcel?.length > 0 && (
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
                                        ) : listData.data?.length > 0 ? (
                                            <>
                                                <div className="divide-y divide-slate-200 min:h-[400px] h-[100%] max:h-[800px] ">
                                                    {listData.data?.map((e) => (
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
                                                                <div
                                                                    className={`${
                                                                        e?.warehouseman_id == "0"
                                                                            ? "bg-[#eff6ff]  transition-all bg-gradient-to-l from-[#eff6ff]  via-[#c7d2fe] to-[#dbeafe] btn-animation "
                                                                            : "bg-lime-100  transition-all bg-gradient-to-l from-lime-100  via-[#f7fee7] to-[#d9f99d] btn-animation "
                                                                    } rounded-md cursor-pointer hover:scale-105 ease-in-out transition-all flex items-center`}
                                                                >
                                                                    <label
                                                                        className="relative flex cursor-pointer items-center rounded-full p-2"
                                                                        htmlFor={e.id}
                                                                        data-ripple-dark="true"
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            className={`${
                                                                                e?.warehouseman_id == "0"
                                                                                    ? "checked:border-indigo-500 checked:bg-indigo-500 checked:before:bg-indigo-500"
                                                                                    : "checked:border-lime-500 checked:bg-lime-500 border-lime-500 checked:before:bg-limborder-lime-500"
                                                                            }before:content[''] peer relative 2xl:h-5 2xl:w-5 h-4 w-4 cursor-pointer appearance-none 2xl:rounded-md rounded border-gray-400 border transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity  hover:before:opacity-10`}
                                                                            id={e.id}
                                                                            value={e.warehouseman_id}
                                                                            checked={
                                                                                e.warehouseman_id != "0" ? true : false
                                                                            }
                                                                            onChange={_HandleChangeInput.bind(
                                                                                this,
                                                                                e?.id,
                                                                                e?.warehouseman_id,
                                                                                "browser"
                                                                            )}
                                                                        />
                                                                        <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                className="h-3.5 w-3.5"
                                                                                viewBox="0 0 20 20"
                                                                                fill="currentColor"
                                                                                stroke="currentColor"
                                                                                stroke-width="1"
                                                                            >
                                                                                <path
                                                                                    fill-rule="evenodd"
                                                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                                    clip-rule="evenodd"
                                                                                ></path>
                                                                            </svg>
                                                                        </div>
                                                                    </label>
                                                                    <label
                                                                        htmlFor={e.id}
                                                                        className={`${
                                                                            e?.warehouseman_id == "0"
                                                                                ? "text-[#6366f1]"
                                                                                : "text-lime-500"
                                                                        }  3xl:text-[12px] 2xl:text-[10px] xl:text-[10px] text-[8px] font-medium cursor-pointer`}
                                                                    >
                                                                        {e?.warehouseman_id == "0"
                                                                            ? "Chưa duyệt kho"
                                                                            : "Đã duyệt kho"}
                                                                    </label>
                                                                </div>
                                                            </h6>

                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-1 text-right truncate">
                                                                {e?.note}
                                                            </h6>

                                                            <h6 className="col-span-1 w-fit ">
                                                                <div className="cursor-default 3xl:text-[13px] 2xl:text-[10px] xl:text-[9px] text-[8px] text-[#086FFC] font-[300] px-1.5 py-0.5 border border-[#086FFC] bg-white rounded-[5.5px] uppercase">
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
                        {listData.data?.length != 0 && (
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
        </React.Fragment>
    );
};

export default Index;
