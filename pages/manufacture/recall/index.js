import React, { useRef, useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Link from "next/link";
import ModalImage from "react-modal-image";
import "react-datepicker/dist/react-datepicker.css";

import {
    Grid6 as IconExcel,
    Filter as IconFilter,
    Calendar as IconCalendar,
    SearchNormal1 as IconSearch,
    ArrowDown2 as IconDown,
    TickCircle,
    ArrowCircleDown,
    Refresh2,
} from "iconsax-react";

import { BiEdit } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { VscFilePdf } from "react-icons/vsc";

import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import Datepicker from "react-tailwindcss-datepicker";
import DatePicker, { registerLocale } from "react-datepicker";
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

import Swal from "sweetalert2";

import ReactExport from "react-data-export";
import { useEffect } from "react";
import FilePDF from "../FilePDF";
import ExpandableContent from "components/UI/more";
import Popup_chitiet from "./(popup)/pupup";
import ImageErrors from "components/UI/imageErrors";
import { useSelector } from "react-redux";
// import Popup_status from "./(popup)/popupStatus";
import Popup_status from "../(popupStatus)/popupStatus";
import LinkWarehouse from "../(linkWarehouse)/linkWarehouse";
import TabStatus from "../(filterTab)/filterTab";
import ButtonWarehouse from "components/UI/btnWarehouse/btnWarehouse";
import useStatusExprired from "@/hooks/useStatusExprired";

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
    const [total, sTotal] = useState({});

    const [listBr, sListBr] = useState([]);
    const [lisCode, sListCode] = useState([]);
    const [listSupplier, sListSupplier] = useState([]);

    const [listDs, sListDs] = useState();
    const [dataWarehouse, sDataWarehouse] = useState([]);

    const [idCode, sIdCode] = useState(null);
    const [idRecallWarehouse, sIdRecallWarehouse] = useState(null);
    const [idSupplier, sIdSupplier] = useState(null);
    const [idBranch, sIdBranch] = useState(null);
    const [valueDate, sValueDate] = useState({
        startDate: null,
        endDate: null,
    });
    const trangthaiExprired = useStatusExprired()

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
            `/api_web/Api_material_recall/materialRecall/?csrf_protection=true`,
            {
                params: {
                    search: keySearch,
                    limit: limit,
                    page: router.query?.page || 1,
                    "filter[status_bar]": tabPage ?? null,
                    "filter[id]": idCode != null ? idCode?.value : null,
                    "filter[branch_id]": idBranch != null ? idBranch.value : null,
                    "filter[start_date]": valueDate?.startDate != null ? valueDate?.startDate : null,
                    "filter[end_date]": valueDate?.endDate != null ? valueDate?.endDate : null,
                    "filter[warehouse_id]": idRecallWarehouse != null ? idRecallWarehouse?.value : null,
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
            `/api_web/Api_material_recall/filterBar/?csrf_protection=true`,
            {
                params: {
                    limit: 0,
                    search: keySearch,
                    "filter[id]": idCode != null ? idCode?.value : null,
                    "filter[branch_id]": idBranch != null ? idBranch.value : null,
                    "filter[start_date]": valueDate?.startDate != null ? valueDate?.startDate : null,
                    "filter[end_date]": valueDate?.endDate != null ? valueDate?.endDate : null,
                    "filter[warehouse_id]": idRecallWarehouse != null ? idRecallWarehouse?.value : null,
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
                sListBr(result?.map((e) => ({ label: e.name, value: e.id })));
            }
        });
        Axios(
            "GET",
            "/api_web/Api_material_recall/materialRecallCombobox/?csrf_protection=true",
            {},
            (err, response) => {
                if (!err) {
                    var { isSuccess, result } = response?.data;
                    sListCode(
                        result?.map((e) => ({
                            label: `${e.code}`,
                            value: e.id,
                        }))
                    );
                }
            }
        );
        Axios("GET", "/api_web/Api_warehouse/warehouseCombobox/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                var data = response?.data;
                sDataWarehouse(
                    data?.map((e) => ({
                        label: e?.warehouse_name,
                        value: e?.id,
                    }))
                );
            }
        });
        sOnFetching_filter(false);
    };

    const _HandleSeachApi = (inputValue) => {
        inputValue != "" &&
            Axios(
                "POST",
                `/api_web/Api_material_recall/materialRecallCombobox/?csrf_protection=true`,
                {
                    data: {
                        term: inputValue,
                    },
                },
                (err, response) => {
                    if (!err) {
                        var { isSuccess, result } = response?.data;
                        sListCode(
                            result?.map((e) => ({
                                label: `${e.code}`,
                                value: e.id,
                            }))
                        );
                    }
                }
            );
    };

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
            (idCode != null && sOnFetching(true)) ||
            (idRecallWarehouse != null && sOnFetching(true));
    }, [
        limit,
        router.query?.page,
        router.query?.tab,
        idBranch,
        valueDate.endDate,
        valueDate.startDate,
        idSupplier,
        idCode,
        idRecallWarehouse,
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

    // const listBr_filter = listBr
    //     ? listBr?.map((e) => ({ label: e.name, value: e.id }))
    //     : [];
    // const listCode_filter = lisCode
    //     ? lisCode?.map((e) => ({ label: `${e.code}`, value: e.id }))
    //     : [];

    const onchang_filter = (type, value) => {
        if (type == "branch") {
            sIdBranch(value);
        } else if (type == "date") {
            sValueDate(value);
        } else if (type == "supplier") {
            sIdSupplier(value);
        } else if (type == "code") {
            sIdCode(value);
        } else if (type == "idRecallWarehouse") {
            sIdRecallWarehouse(value);
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
                    title: `${dataLang?.production_warehouse_orderNumber || "production_warehouse_orderNumber"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.production_warehouse_expWarehouse || "production_warehouse_expWarehouse"}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.recall_totalQty || "recall_totalQty"}`,
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
                {
                    title: `${dataLang?.production_warehouse_creator || "production_warehouse_creator"}`,
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
            ],
            data: dataExcel?.map((e) => [
                { value: `${e?.id ? e.id : ""}`, style: { numFmt: "0" } },
                { value: `${e?.date ? e?.date : ""}` },
                { value: `${e?.code ? e?.code : ""}` },
                { value: `${"Số LSX chi tiết"}` },
                { value: `${e?.warehouse_name ? e?.warehouse_name : ""}` },
                {
                    value: `${e?.total_quantity ? formatNumber(e?.total_quantity) : ""}`,
                },
                { value: `${e?.note ? e?.note : ""}` },
                {
                    value: `${e?.staff_create?.full_name ? e?.staff_create?.full_name : ""}`,
                },
                {
                    value: `${e?.warehouseman_id === "0" ? "Chưa duyệt kho" : "Đã duyệt kho"}`,
                },
                { value: `${e?.branch_name ? e?.branch_name : ""}` },
            ]),
        },
    ];

    const [data_export, sData_export] = useState([]);
    const [errOpen, sErrOpen] = useState(false);
    const [checkedWare, sCheckedWare] = useState({});
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
                sData([...data]);
            });
        }
    };
    const _ServerSending = () => {
        var data = new FormData();
        data.append("warehouseman_id", checkedWare?.checkedpost != "0" ? checkedWare?.checkedpost : "");
        data.append("id", checkedWare?.id);
        Axios(
            "POST",
            `/api_web/Api_material_recall/confirmWarehouse/?csrf_protection=true`,
            {
                data: data,
                headers: { "Content-Type": "multipart/form-data" },
            },
            (err, response) => {
                if (!err) {
                    var { isSuccess, message, data_export } = response.data;
                    if (isSuccess) {
                        Toast.fire({
                            icon: "success",
                            title: `${dataLang[message]}`,
                        });
                        setTimeout(() => {
                            sOnFetching(true);
                        }, 300);
                    } else {
                        Toast.fire({
                            icon: "error",
                            title: `${dataLang[message]}`,
                        });
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
                <title>{dataLang?.recall_title || "recall_title"}</title>
            </Head>
            <div className="3xl:pt-[88px] 2xl:pt-[74px] xl:pt-[60px] lg:pt-[60px] 3xl:px-10 3xl:pb-10 2xl:px-10 2xl:pb-8 xl:px-10 xl:pb-10 lg:px-5 lg:pb-10 space-y-1 overflow-hidden h-screen">
                {/* {data_export.length > 0 && <Popup_status className="hidden" data_export={data_export} dataLang={dataLang}/>} */}
                {/* trangthaiExprired */}
                {data_export.length > 0 && (
                    <Popup_status type="recall" className="hidden" data_export={data_export} dataLang={dataLang} />
                )}
                {trangthaiExprired ? (
                    <div className="p-4"></div>
                ) : (
                    <div className={` flex space-x-3  xl:text-[14.5px] text-[12px]`}>
                        <h6 className="text-[#141522]/40">{dataLang?.recall_title || "recall_title"}</h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.recall_title || "recall_title"}</h6>
                    </div>
                )}

                <div className="grid grid-cols gap-1 h-[100%] overflow-hidden ">
                    <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden">
                        <div className="space-y-0.5 h-[96%] overflow-hidden">
                            <div className="flex justify-between mt-1 mr-2">
                                <h2 className="text-2xl text-[#52575E] capitalize">
                                    {dataLang?.recall_title || "recall_title"}
                                </h2>
                                <div className="flex justify-end items-center">
                                    <Link
                                        href="/manufacture/recall/form"
                                        className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E]  via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105"
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
                                            <div className="grid grid-cols-5 items-center">
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
                                                            ...listBr,
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
                                                            ...lisCode,
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
                                                                    dataLang?.productsWarehouse_warehouseImport ||
                                                                    "productsWarehouse_warehouseImport",
                                                                isDisabled: true,
                                                            },
                                                            ...dataWarehouse,
                                                        ]}
                                                        onChange={onchang_filter.bind(this, "idRecallWarehouse")}
                                                        value={idRecallWarehouse}
                                                        placeholder={
                                                            dataLang?.productsWarehouse_warehouseImport ||
                                                            "productsWarehouse_warehouseImport"
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
                                                            filename={"Danh sách thu hồi nguyên vật liệu"}
                                                            title="DSTHNVL"
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
                                {/* <ScrollArea
                                    className="min:h-[200px] 3xl:h-[82%] 2xl:h-[82%] xl:h-[72%] lg:h-[82%] max:h-[400px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100"
                                    speed={1}
                                    smoothScrolling={true}
                                > */}
                                <div className="min:h-[200px] 3xl:h-[82%] 2xl:h-[82%] xl:h-[72%] lg:h-[82%] max:h-[400px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                    <div className="pr-2 w-[100%]">
                                        <div className="grid grid-cols-10 items-center sticky top-0 p-2 z-10 rounded-xl shadow-sm bg-white divide-x">
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center ">
                                                {dataLang?.import_day_vouchers || "import_day_vouchers"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center ">
                                                {dataLang?.import_code_vouchers || "import_code_vouchers"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center ">
                                                {dataLang?.production_warehouse_LSX || "production_warehouse_LSX"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center ">
                                                {dataLang?.productsWarehouse_warehouseImport ||
                                                    "productsWarehouse_warehouseImport"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center ">
                                                {dataLang?.productsWarehouse_total || "productsWarehouse_total"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center ">
                                                {dataLang?.production_warehouse_note || "production_warehouse_note"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center ">
                                                {dataLang?.production_warehouse_creator ||
                                                    "production_warehouse_creator"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center ">
                                                {dataLang?.production_warehouse_browse || "production_warehouse_browse"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center ">
                                                {dataLang?.import_branch || "import_branch"}
                                            </h4>
                                            <h4 className="3xl:text-[14px] 2xl:text-[12px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600]  col-span-1 text-center ">
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
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-1 text-right"></h6>
                                                            <LinkWarehouse
                                                                warehouse_id={e?.warehouse_id}
                                                                warehouse_name={e?.warehouse_name}
                                                            />

                                                            <h6 className="col-span-1 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 py-1  rounded-md text-center flex items-center justify-end space-x-1">
                                                                {formatNumber(e?.total_quantity)}
                                                            </h6>
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-1 text-left truncate">
                                                                {e?.note}
                                                            </h6>
                                                            <h6 className="col-span-1 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 py-1  rounded-md text-left flex items-center space-x-1">
                                                                <div className="relative">
                                                                    <ModalImage
                                                                        small={
                                                                            e?.staff_create?.profile_image
                                                                                ? e?.staff_create?.profile_image
                                                                                : "/user-placeholder.jpg"
                                                                        }
                                                                        large={
                                                                            e?.staff_create?.profile_image
                                                                                ? e?.staff_create?.profile_image
                                                                                : "/user-placeholder.jpg"
                                                                        }
                                                                        className="h-6 w-6 rounded-full object-cover "
                                                                    >
                                                                        <div className="">
                                                                            <ImageErrors
                                                                                src={e?.staff_create?.profile_image}
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
                                                                    {e?.staff_create?.full_name}
                                                                </h6>
                                                            </h6>
                                                            <h6 className=" 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 px-2 col-span-1">
                                                                {/* <div
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
                                                                        }  3xl:text-[14px] 2xl:text-[10px] xl:text-[10px] text-[8px] font-medium cursor-pointer`}
                                                                    >
                                                                        {e?.warehouseman_id == "0"
                                                                            ? "Chưa duyệt kho"
                                                                            : "Đã duyệt kho"}
                                                                    </label>
                                                                </div> */}
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
                                                                <BtnTacVu
                                                                    type="recall"
                                                                    onRefresh={_ServerFetching.bind(this)}
                                                                    onRefreshGroup={_ServerFetching_group.bind(this)}
                                                                    dataLang={dataLang}
                                                                    warehouseman_id={e?.warehouseman_id}
                                                                    status_pay={e?.status_pay}
                                                                    id={e?.id}
                                                                    className="bg-slate-100 hover:scale-105 transition-all ease-linear hover:bg-gray-200 xl:px-4 px-3 xl:py-1.5 py-1 rounded 2xl:text-base xl:text-xs text-[8px]"
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
                                {/* </ScrollArea> */}
                            </div>
                        </div>
                        <div className="grid grid-cols-10 bg-gray-100 items-center">
                            <div className="col-span-4 p-2 text-center">
                                <h3 className="uppercase      font-medium  text-zinc-600 3xl:text-[14px] 2xl:text-[12px] xl:text-[11.5px] text-[9px]">
                                    {dataLang?.productsWarehouse_total || "productsWarehouse_total"}
                                </h3>
                            </div>
                            <div className="col-span-1 text-right justify-end p-2 flex gap-2 flex-wrap">
                                <h3 className="     font-medium  text-zinc-600 3xl:text-[14px] 2xl:text-[12px] xl:text-[11.5px] text-[9px] ">
                                    {formatNumber(total?.total_quantity)}
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
        </React.Fragment>
    );
};

const BtnTacVu = React.memo((props) => {
    const [openTacvu, sOpenTacvu] = useState(false);
    const _ToggleModal = (e) => sOpenTacvu(e);

    const [openDetail, sOpenDetail] = useState(false);
    const router = useRouter();
    const [data, sData] = useState({});

    const [dataPDF, setData] = useState();
    const [dataCompany, setDataCompany] = useState();

    const [dataMaterialExpiry, sDataMaterialExpiry] = useState({});
    const [dataProductExpiry, sDataProductExpiry] = useState({});
    const [dataProductSerial, sDataProductSerial] = useState({});

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
                    `/api_web/Api_material_recall/materialRecall/${id}?csrf_protection=true`,
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
                                props.onRefreshGroup && props.onRefreshGroup();
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
        if (props?.warehouseman_id != "0") {
            Toast.fire({
                icon: "error",
                title: `${props?.warehouseman_id != "0" && props.dataLang?.warehouse_confirmed_cant_edit}`,
            });
        } else {
            router.push(`/manufacture/recall/form?id=${props.id}`);
        }
    };

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
                `/api_web/Api_material_recall/materialRecall/${props?.id}?csrf_protection=true`,
                {},
                (err, response) => {
                    if (!err) {
                        var db = response.data;
                        setData(db);
                    }
                }
            );
        }
        Axios("GET", "/api_web/api_setting/feature/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                var data = response.data;
                sDataMaterialExpiry(data.find((x) => x.code == "material_expiry"));
                sDataProductExpiry(data.find((x) => x.code == "product_expiry"));
                sDataProductSerial(data.find((x) => x.code == "product_serial"));
            }
        });
    };
    useEffect(() => {
        openTacvu && fetchDataSettingsCompany();
    }, [openTacvu]);

    return (
        <div>
            <Popup
                trigger={
                    <button className={`flex space-x-1 items-center ` + props.className}>
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
            >
                <div className="w-auto rounded">
                    <div className="bg-white rounded-t flex flex-col overflow-hidden">
                        <button
                            onClick={handleClick}
                            className="group transition-all ease-in-out flex items-center gap-2  2xl:text-sm xl:text-sm text-[8px] hover:bg-slate-50 text-left cursor-pointer px-5 rounded py-2.5 w-full"
                        >
                            <BiEdit
                                size={20}
                                className="group-hover:text-sky-500 group-hover:scale-110 group-hover:shadow-md "
                            />
                            <p className="group-hover:text-sky-500">
                                {props.dataLang?.purchase_order_table_edit || "purchase_order_table_edit"}
                            </p>
                        </button>
                        <FilePDF
                            props={props}
                            openAction={openTacvu}
                            setOpenAction={sOpenTacvu}
                            dataCompany={dataCompany}
                            dataProductExpiry={dataProductExpiry}
                            dataProductSerial={dataProductSerial}
                            dataMaterialExpiry={dataMaterialExpiry}
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
                                {props.dataLang?.purchase_order_table_delete || "purchase_order_table_delete"}
                            </p>
                        </button>
                    </div>
                </div>
            </Popup>
        </div>
    );
});

export default Index;
