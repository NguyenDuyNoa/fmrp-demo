import Head from "next/head";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useState, useRef, useEffect } from "react";
import ModalImage from "react-modal-image";

const ScrollArea = dynamic(() => import("react-scrollbar"), {
    ssr: false,
});

import Swal from "sweetalert2";
import ReactExport from "react-data-export";
import Select, { components } from "react-select";

import {
    Edit as IconEdit,
    Grid6 as IconExcel,
    Trash as IconDelete,
    SearchNormal1 as IconSearch,
    Add as IconAdd,
    House2,
    Refresh2,
} from "iconsax-react";

import { _ServerInstance as Axios } from "/services/axios";

import PopupEdit from "@/components/UI/popup";
import Loading from "@/components/UI/loading";
import Pagination from "@/components/UI/pagination";
import formatNumber from "@/utils/helpers/formatnumber";

import useToast from "@/hooks/useToast";
import { useToggle } from "@/hooks/useToggle";
import useStatusExprired from "@/hooks/useStatusExprired";
import PopupConfim from "@/components/UI/popupConfim/popupConfim";
import { CONFIRM_DELETION, TITLE_DELETE } from "@/constants/delete/deleteTable";
import moment from "moment";

import { debounce } from "lodash";

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

    const isShow = useToast();

    const trangthaiExprired = useStatusExprired();

    const { isOpen, isId, handleQueryId } = useToggle();

    const [limit, sLimit] = useState(60);

    const [totalItem, sTotalItems] = useState([]);

    const [data_ex, sData_ex] = useState([]);

    const initialState = {
        idWarehouse: "",
        dataProductSerial: {},
        dataMaterialExpiry: {},
        dataProductExpiry: {},
        dataWarehouse: [],
        dataWarehouseDetail: [],
        limitItemWarehouseDetail: 10,
        totalItemWarehouseDetail: [],
        dataWarehouseExcel: [],

        keySearchItem: "",

        listBranchWarehouse: [],
        idBranch: null,

        listLocationWarehouse: [],
        idLocationWarehouse: null,
        listVariant: [],
        idVariantMain: null,
        idVariantSub: null,
        isLoading: false,
    }

    const [isState, setIsState] = useState(initialState)
    const queryKeyIsState = (key) => setIsState((prev) => ({ ...prev, ...key }))

    const fetchListBranchWarehouse = () => {
        Axios(
            "GET",
            `/api_web/Api_Branch/branch/?csrf_protection=true`,
            {
                params: {
                    limit: 0,
                },
            },
            (err, response) => {
                if (!err) {
                    var { rResult, output } = response.data;
                    queryKeyIsState({
                        listBranchWarehouse: rResult,
                    })
                }
            }
        );
    };

    const fetchFilterLocationWarehouse = () => {
        Axios(
            "GET",
            `/api_web/api_warehouse/location/?csrf_protection=true&filter[warehouse_id]=${isState.idWarehouse}`,
            {},
            (err, response) => {

                if (!err) {
                    var { rResult } = response.data;
                    queryKeyIsState({
                        listLocationWarehouse: rResult.map((e) => ({ label: e.name, value: e.id })),
                    })
                }
            }
        );
    };

    // fetch list biến thể
    const fetchFilterVariationWarehouse = () => {
        Axios("GET", `/api_web/Api_variation/variation?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                const { rResult } = response.data ?? {};
                const options = rResult?.flatMap(({ option }) => option) ?? [];
                queryKeyIsState({
                    listVariant: options?.map(({ id, name }) => ({
                        label: name,
                        value: id,
                    })),
                })
            }
        });
    };

    const handleOpenSelect = (type) => {
        if (type === 'branch' && isState?.listBranchWarehouse?.length === 0) {
            fetchListBranchWarehouse()
        } else if (type === 'locationWarehouse' && isState?.listLocationWarehouse?.length === 0 && isState.idWarehouse) {
            // fetch list vị trí kho theo từng kho
            fetchFilterLocationWarehouse()
        } else if (type === 'mainVariation' && isState?.listVariant?.length === 0) {
            fetchFilterVariationWarehouse()
        } else if (type === 'subVariation') {

        }
    }

    // fetch danh sách kho
    const fetchDataListWarehouse = () => {
        Axios(
            "GET",
            `/api_web/api_warehouse/warehouse/?csrf_protection=true`,
            {
                params: {
                    limit: limit,
                    page: router.query?.page || 1,
                    "filter[branch_id]": isState?.idBranch?.length > 0 ? isState?.idBranch.map((e) => e.value) : null,
                },
            },
            (err, response) => {
                console.log('checkk err,response');
                queryKeyIsState({
                    isLoading: true
                })
                if (!err) {
                    var { rResult, output } = response.data;
                    if (rResult.length > 0) {
                        queryKeyIsState({
                            idWarehouse: rResult[0].id
                        })
                    } else {
                        queryKeyIsState({
                            idWarehouse: null,
                            dataWarehouseDetail: [],
                        })
                    }
                    queryKeyIsState({
                        dataWarehouse: rResult,
                    })
                    sTotalItems(output);
                    sData_ex(rResult);
                    setTimeout(() => {
                        queryKeyIsState({
                            isLoading: false
                        })
                    }, 500);
                } else {
                    setTimeout(() => {
                        queryKeyIsState({
                            isLoading: false
                        })
                    }, 500);
                }
            }
        );
    }

    useEffect(() => {
        fetchDataListWarehouse()
    }, [isState.idBranch])

    useEffect(() => {
        if (isState.idWarehouse) {
            fetchFilterLocationWarehouse()
        }
    }, [isState.idWarehouse])

    // fetch data ẩn hiện cột trong table
    const fetchDataOnOffCol = () => {
        Axios("GET", "/api_web/api_setting/feature/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                var data = response.data;
                queryKeyIsState({
                    dataMaterialExpiry: data.find((x) => x.code == "material_expiry"),
                    dataProductExpiry: data.find((x) => x.code == "product_expiry"),
                    dataProductSerial: data.find((x) => x.code == "product_serial"),
                })
            }
        });
    }

    // fetch data chi tiết của kho
    const fetchDataWarehouseDetail = async () => {
        Axios(
            "GET",
            `/api_web/api_warehouse/warehouse_detail/${isState.idWarehouse}?csrf_protection=true`,
            {
                params: {
                    search: isState.keySearchItem,
                    limit: isState.limitItemWarehouseDetail,
                    page: router.query?.page || 1,
                    "filter[location_id]": isState.idLocationWarehouse?.value ? isState.idLocationWarehouse?.value : null,
                    "filter[variation_option_id_1]": isState.idVariantMain?.value ? isState.idVariantMain?.value : null,
                    "filter[variation_option_id_2]": isState.idVariantSub?.value ? isState.idVariantSub?.value : null,
                },
            },
            (err, response) => {
                queryKeyIsState({
                    isLoading: true
                })
                if (!err) {
                    var { rResult, output } = response.data;
                    queryKeyIsState({
                        dataWarehouseDetail: rResult,
                        dataWarehouseExcel: rResult,
                        totalItemWarehouseDetail: output,
                    })
                    setTimeout(() => {
                        queryKeyIsState({
                            isLoading: false
                        })
                    }, 500);
                } else {
                    setTimeout(() => {
                        queryKeyIsState({
                            isLoading: false
                        })
                    }, 500);
                }
            }
        );
    }

    useEffect(() => {
        if (isState.idWarehouse) {
            fetchDataWarehouseDetail()
            fetchDataOnOffCol()
        }
    }, [isState.limitItemWarehouseDetail, isState.idWarehouse, isState.idLocationWarehouse, isState.idVariantSub, isState.idVariantMain, isState.keySearchItem, router.query?.page])

    const listBr_filter = isState?.listBranchWarehouse?.map((e) => ({ label: e.name, value: e.id }));

    const onChangeFilter = (type, value) => {
        if (type == "branch") {
            // fetch list chi nhánh kho
            queryKeyIsState({
                idBranch: value,
            })
        } else if (type == "location") {
            queryKeyIsState({
                idLocationWarehouse: value,
            })
        } else if (type == "MainVariation") {
            queryKeyIsState({
                idVariantMain: value,
            })
        } else if (type == "SubVariation") {
            queryKeyIsState({
                idVariantSub: value,
            })
        }
        router.push({
            pathname: router.route,
            query: { page: 1 },
        });
    };

    const hiddenOptions = isState?.idBranch?.length > 3 ? isState?.idBranch?.slice(0, 3) : [];

    const options = listBr_filter ? listBr_filter?.filter((x) => !hiddenOptions.includes(x.value)) : [];

    const paginate = (pageNumber) => {
        router.push({
            pathname: router.route,
            query: { page: pageNumber },
        });
    };

    const _HandleOnChangeKeySearch = debounce(({ target: { value } }) => {
        queryKeyIsState({ keySearchItem: value })
        router.replace(router.route);
    }, 500);

    const handleDelete = () => {
        Axios("DELETE", `/api_web/api_warehouse/warehouse/${isId}?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                var { isSuccess, message } = response?.data;
                if (isSuccess) {
                    isShow("success", dataLang?.aler_success_delete);
                } else {
                    isShow("error", dataLang[message]);
                }
            }
            fetchDataOnOffCol();
        });
        handleQueryId({ status: false });
    };
    //excel
    // const multiDataSet = [
    //     {
    //         columns: [
    //             {
    //                 title: "ID",
    //                 width: { wch: 4 },
    //                 style: {
    //                     fill: { fgColor: { rgb: "C7DFFB" } },
    //                     font: { bold: true },
    //                 },
    //             },
    //             {
    //                 title: `${dataLang?.Warehouse_code || "Warehouse_code"}`,
    //                 width: { wpx: 100 },
    //                 style: {
    //                     fill: { fgColor: { rgb: "C7DFFB" } },
    //                     font: { bold: true },
    //                 },
    //             },
    //             {
    //                 title: `${dataLang?.Warehouse_poppup_name || "Warehouse_poppup_name"}`,
    //                 width: { wpx: 100 },
    //                 style: {
    //                     fill: { fgColor: { rgb: "C7DFFB" } },
    //                     font: { bold: true },
    //                 },
    //             },
    //             {
    //                 title: `${dataLang?.Warehouse_total || "Warehouse_total"}`,
    //                 width: { wch: 40 },
    //                 style: {
    //                     fill: { fgColor: { rgb: "C7DFFB" } },
    //                     font: { bold: true },
    //                 },
    //             },
    //             {
    //                 title: `${dataLang?.Warehouse_inventory || "Warehouse_inventory"}`,
    //                 width: { wch: 40 },
    //                 style: {
    //                     fill: { fgColor: { rgb: "C7DFFB" } },
    //                     font: { bold: true },
    //                 },
    //             },
    //             {
    //                 title: `${dataLang?.Warehouse_poppup_address || "Warehouse_poppup_address"}`,
    //                 width: { wch: 40 },
    //                 style: {
    //                     fill: { fgColor: { rgb: "C7DFFB" } },
    //                     font: { bold: true },
    //                 },
    //             },
    //             {
    //                 title: `${dataLang?.client_popup_note || "client_popup_note"}`,
    //                 width: { wch: 40 },
    //                 style: {
    //                     fill: { fgColor: { rgb: "C7DFFB" } },
    //                     font: { bold: true },
    //                 },
    //             },
    //             {
    //                 title: `${dataLang?.Warehouse_factory || "Warehouse_factory"}`,
    //                 width: { wch: 40 },
    //                 style: {
    //                     fill: { fgColor: { rgb: "C7DFFB" } },
    //                     font: { bold: true },
    //                 },
    //             },
    //         ],
    //         data: data_ex?.map((e) => [
    //             { value: `${e.id}`, style: { numFmt: "0" } },
    //             { value: `${e.code ? e.code : ""}` },
    //             { value: `${e.name ? e.name : ""}` },
    //             { value: `${"Tổng mặt hàng "}` },
    //             { value: `${"Tổng tồn kho"}` },
    //             { value: `${e.address ? e.address : ""}` },
    //             { value: `${e.note ? e.note : ""}` },
    //             { value: `${e.branch ? e.branch?.map((i) => i.name) : ""}` },
    //         ]),
    //     },
    // ];
    const newResult = isState.dataWarehouseExcel?.map((item) => {
        const detail = item.detail || [];
        return detail.map((detailItem) => ({
            ...item,
            detail: detailItem,
        }));
    })
        .flat();

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
                    title: `${dataLang?.warehouses_detail_type || "warehouses_detail_type"}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.warehouses_detail_plu || "warehouses_detail_plu"}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.warehouses_detail_productname || "warehouses_detail_productname"}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.warehouses_detail_wareLoca || "warehouses_detail_wareLoca"}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.warehouses_detail_mainVar || "warehouses_detail_mainVar"}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.warehouses_detail_subVar || "warehouses_detail_subVar"}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${"Serial"}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${"Lot"}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.warehouses_detail_date || "warehouses_detail_date"}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.warehouses_detail_quantity || "warehouses_detail_quantity"}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.warehouses_detail_value || "warehouses_detail_value"}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
            ],
            data: newResult?.map((e) => [
                { value: `${e.item_id}`, style: { numFmt: "0" } },
                { value: `${e.item_type ? dataLang?.product : ""}` },
                { value: `${e.item_code ? e.item_code : ""}` },
                { value: `${e.item_name ? e.item_name : ""}` },
                {
                    value: `${e?.detail.location_name ? e?.detail.location_name : ""}`,
                },
                {
                    value: `${e?.detail.option_name_1 ? e?.detail.option_name_1 : ""}`,
                },
                {
                    value: `${e?.detail.option_name_2 ? e?.detail.option_name_2 : ""}`,
                },
                {
                    value: `${isState?.dataProductSerial.is_enable === "1" ? (e?.detail.serial != null ? e?.detail.serial : "") : ""
                        }`,
                },
                {
                    value: `${isState?.dataMaterialExpiry.is_enable === "1" ? (e?.detail.lot != null ? e?.detail.lot : "") : ""
                        }`,
                },
                {
                    value: `${
                        // dataProductExpiry.is_enable === "1"
                        //     ? e?.detail.expiration_date != null
                        //         ? e?.detail.expiration_date
                        //         : ""
                        //     : ""
                        isState?.dataMaterialExpiry.is_enable === "1"
                            ? e?.detail.expiration_date != null
                                ? e?.detail.expiration_date
                                : ""
                            : ""
                        }`,
                },
                {
                    value: `${e?.detail.quantity != null ? e?.detail.quantity : ""}`,
                },
                {
                    value: `${e?.detail.amount != null ? e?.detail.amount : ""}`,
                },
            ]),
        },
    ];

    const handleClickChooseWarehouse = (item) => {
        queryKeyIsState({ idWarehouse: item.id })
        router.push({
            pathname: router.route,
            query: { page: 1 },
        });
    }

    const handleRefresh = () => {
        fetchDataWarehouseDetail()
        fetchDataOnOffCol()
    };
    console.log("dataWarehouseDetail :", isState.dataWarehouseDetail);

    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.Warehouse_title}</title>
            </Head>
            <div className="px-10 3xl:pt-24 xl:pt-[70px] lg:pt-[64px] pb-10 3xl:space-y-4 space-y-2 overflow-hidden h-screen">
                {trangthaiExprired ? (
                    <div className="p-2"></div>
                ) : (
                    <div className="flex space-x-3 xl:text-[14.5px] text-[12px]">
                        <h6 className="text-[#141522]/40">{dataLang?.Warehouse_title}</h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.Warehouse_title}</h6>
                    </div>
                )}

                <div className="grid grid-cols gap-5 h-[99%] overflow-hidden">
                    <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden">
                        <div className="3xl:space-y-3 space-y-2 h-[96%] overflow-hidden">
                            <div className="flex justify-between">
                                <h2 className="text-2xl text-[#52575E] capitalize">{dataLang?.Warehouse_title}</h2>
                                <div className="flex justify-end items-center">
                                    <Popup_kho
                                        listBr={isState?.listBranchWarehouse}
                                        onRefresh={fetchDataOnOffCol.bind(this)}
                                        dataLang={dataLang}
                                        className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 h-full overflow-hidden">
                                {/* <div className="space-y-2 2xl:h-[95%] h-[93%] overflow-hidden"> */}
                                <div className="3xl:space-y-3 space-y-2">
                                    <div className="bg-slate-100 w-full rounded flex justify-between items-center  xl:p-3 p-2">
                                        <div className="flex gap-2">
                                            <form className="flex items-center relative">
                                                <IconSearch className="3xl:w-[20px] 3xl:h-[20px] w-[18px] h-[18px] absolute left-3 z-10 text-[#cccccc]" />
                                                <input
                                                    className="3xl:text-base text-sm relative bg-white outline-[#D0D5DD] focus:outline-[#0F4F9E] pl-10 pr-5 3xl:py-1.5 xxl:py-2 py-[9px] rounded-md 3xl:w-[400px] xxl:w-[260px] xl:w-[200px] w-[150px]"
                                                    type="text"
                                                    onChange={_HandleOnChangeKeySearch.bind(this)}
                                                    placeholder={dataLang?.branch_search}
                                                />
                                            </form>
                                            <div className="ml-1 3xl:w-[400px] xxl:w-[260px] w-[200px]">
                                                <Select
                                                    options={[
                                                        {
                                                            value: "",
                                                            label: "Chọn chi nhánh",
                                                            isDisabled: true,
                                                        },
                                                        ...options,
                                                    ]}
                                                    onMenuOpen={() => handleOpenSelect('branch')}
                                                    onChange={onChangeFilter.bind(this, "branch")}
                                                    value={isState.idBranch}
                                                    hideSelectedOptions={false}
                                                    isMulti
                                                    isClearable={true}
                                                    placeholder={dataLang?.client_list_filterbrand}
                                                    className="rounded-md bg-white 3xl:text-base xxl:text-sm text-xs z-20"
                                                    isSearchable={true}
                                                    noOptionsMessage={() => "Không có dữ liệu"}
                                                    components={{ MultiValue }}
                                                    closeMenuOnSelect={false}
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
                                            {/* chọn vị trí kho */}
                                            <div className="ml-1 col-span-1">
                                                <Select
                                                    options={[
                                                        {
                                                            value: "",
                                                            label:
                                                                dataLang?.warehouses_detail_filterWare ||
                                                                "warehouses_detail_filterWare",
                                                            isDisabled: true,
                                                        },
                                                        ...isState.listLocationWarehouse,
                                                    ]}
                                                    onMenuOpen={() => handleOpenSelect('locationWarehouse')}
                                                    onChange={onChangeFilter.bind(this, "location")}
                                                    value={isState.idLocationWarehouse}
                                                    hideSelectedOptions={false}
                                                    isClearable={true}
                                                    placeholder={
                                                        dataLang?.warehouses_detail_filterWare ||
                                                        "warehouses_detail_filterWare"
                                                    }
                                                    className="rounded-md bg-white 3xl:text-base xxl:text-sm text-xs z-20"
                                                    isSearchable={true}
                                                    noOptionsMessage={() => "Không có dữ liệu"}
                                                    components={{ MultiValue }}
                                                    // closeMenuOnSelect={false}
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
                                                                dataLang?.warehouses_detail_filterMain ||
                                                                "warehouses_detail_filterMain",
                                                            isDisabled: true,
                                                        },
                                                        ...isState.listVariant,
                                                    ]}
                                                    onMenuOpen={() => handleOpenSelect('mainVariation')}
                                                    onChange={onChangeFilter.bind(this, "MainVariation")}
                                                    value={isState.idVariantMain}
                                                    hideSelectedOptions={false}
                                                    isClearable={true}
                                                    placeholder={
                                                        dataLang?.warehouses_detail_filterMain ||
                                                        "warehouses_detail_filterMain"
                                                    }
                                                    className="rounded-md bg-white 3xl:text-base xxl:text-sm text-xs z-20"
                                                    isSearchable={true}
                                                    noOptionsMessage={() => "Không có dữ liệu"}
                                                    components={{ MultiValue }}
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
                                                                dataLang?.warehouses_detail_filterSub ||
                                                                "warehouses_detail_filterSub",
                                                            isDisabled: true,
                                                        },
                                                        ...isState.listVariant,
                                                    ]}
                                                    onMenuOpen={() => handleOpenSelect('subVariation')}
                                                    onChange={onChangeFilter.bind(this, "SubVariation")}
                                                    value={isState.idVariantSub}
                                                    hideSelectedOptions={false}
                                                    isClearable={true}
                                                    placeholder={
                                                        dataLang?.warehouses_detail_filterSub ||
                                                        "warehouses_detail_filterSub"
                                                    }
                                                    className="rounded-md bg-white 3xl:text-base xxl:text-sm text-xs z-20"
                                                    isSearchable={true}
                                                    noOptionsMessage={() => "Không có dữ liệu"}
                                                    components={{ MultiValue }}
                                                    closeMenuOnSelect={false}
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
                                        </div>
                                        <div className="flex space-x-2 items-center">
                                            <button
                                                onClick={handleRefresh.bind(this)}
                                                type="button"
                                                className="bg-green-50 hover:bg-green-200 hover:scale-105 group p-2 rounded-md transition-all ease-in-out animate-pulse hover:animate-none"
                                            >
                                                <Refresh2
                                                    className="3xl:w-[20px] 3xl:h-[20px] w-[18px] h-[18px] group-hover:-rotate-45 transition-all ease-in-out"
                                                    color="green"
                                                />
                                            </button>

                                            {data_ex?.length > 0 && (
                                                <ExcelFile
                                                    filename="Danh sách kho"
                                                    title="Dsk"
                                                    element={
                                                        <button className="3xl:px-4 px-3 3xl:py-2 py-2 flex items-center xxl:space-x-2 space-x-1 bg-[#C7DFFB] rounded hover:scale-105 transition">
                                                            <IconExcel className='3xl:w-[20px] 3xl:h-[20px] w-[18px] h-[18px]' />
                                                            <span className='xl:text-sm text-xs'>{dataLang?.client_list_exportexcel}</span>
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
                                            <select
                                                className="outline-none 3xl:text-base text-sm"
                                                onChange={(e) => queryKeyIsState({ limitItemWarehouseDetail: e.target.value })}
                                                value={isState.limitItemWarehouseDetail}
                                            >
                                                <option disabled className="hidden">
                                                    {isState.limitItemWarehouseDetail == -1 ? "Tất cả" : isState.limitItemWarehouseDetail}
                                                </option>
                                                <option value={10} className='3xl:text-base text-sm'>10</option>
                                                <option value={20} className='3xl:text-base text-sm'>20</option>
                                                <option value={40} className='3xl:text-base text-sm'>40</option>
                                                <option value={60} className='3xl:text-base text-sm'>60</option>
                                                <option value={-1} className='3xl:text-base text-sm'>Tất cả</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className='grid grid-cols-10'>
                                    <ul className='col-span-2 3xl:max-h-[620px] 3xl:h-[620px] 2xl:max-h-[440px] 2xl:h-[440px] max-h-[440px] h-[440px] rounded-xl w-full list-disc list-inside flex flex-col gap-2 bg-[#F7FAFE] 3xl:px-6 3xl:py-4 xl:px-4 xl:py-2 px-2 py-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100'>
                                        {
                                            isState.dataWarehouse && isState.dataWarehouse.map((item, index) => (
                                                <li
                                                    key={item.id}
                                                    className={` ${isState.idWarehouse === item.id ? "bg-[#3276FA] text-white" : ""} capitalize flex gap-2 px-4 py-2 items-center justify-between w-full rounded-md cursor-pointer hover:bg-[#3276FA] hover:text-white duration-200 ease-in-out transition`}
                                                    onClick={() => handleClickChooseWarehouse(item)}
                                                >
                                                    <div className='flex w-[90%] max-w-[90%] items-center gap-2'>
                                                        <div className='w-[6px] h-[6px] rounded-full bg-[#6C9AC4]' />
                                                        <div className='w-[95%] max-w-[95%] 3xl:text-base xl:text-sm text-xs '>
                                                            {item.name}
                                                        </div>
                                                    </div>
                                                    <div className='w-[10%] max-w-[10%] bg-[#E1ECFC]/80 3xl:text-base xl:text-sm text-xs text-center rounded-md text-black'>
                                                        {item.totalItems}
                                                    </div>
                                                </li>
                                            ))
                                        }
                                    </ul>

                                    <div className="col-span-8 3xl:max-h-[620px] 3xl:h-[620px] 2xl:max-h-[440px] 2xl:h-[440px] max-h-[440px] h-[440px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                        <div className={`2xl:w-[100%] pr-2`}>
                                            {/* header table */}
                                            <div
                                                className={`${isState.dataProductSerial.is_enable == "1"
                                                    ? (isState.dataMaterialExpiry.is_enable != isState.dataProductExpiry.is_enable)
                                                        ? "grid-cols-10"
                                                        : isState.dataMaterialExpiry.is_enable == "1"
                                                            ? "grid-cols-10" : "grid-cols-8"
                                                    : isState.dataMaterialExpiry.is_enable != isState.dataProductExpiry.is_enable
                                                        ? "grid-cols-9" : isState.dataMaterialExpiry.is_enable == "1"
                                                            ? "grid-cols-9" : "grid-cols-7"
                                                    }  grid sticky top-0 bg-white px-2 pt-2 z-10 border-b`}
                                            >
                                                <h4 className="col-span-2 py-2 xl:text-sm lg:text-xs px-2 text-gray-600 uppercase  font-[600] text-start">
                                                    {dataLang?.warehouses_detail_product || "warehouses_detail_product"}
                                                </h4>
                                                <h4 className="col-span-1 py-2 xl:text-sm lg:text-xs px-2 text-gray-600 uppercase  font-[600] text-start">
                                                    {dataLang?.warehouses_detail_wareLoca || "warehouses_detail_wareLoca"}
                                                </h4>
                                                <h4 className="col-span-1 py-2 xl:text-sm lg:text-xs px-2 text-gray-600 uppercase  font-[600] text-start">
                                                    {dataLang?.warehouses_detail_mainVar || "warehouses_detail_mainVar"}
                                                </h4>
                                                <h4 className="col-span-1 py-2 xl:text-sm lg:text-xs px-2 text-gray-600 uppercase  font-[600] text-start">
                                                    {dataLang?.warehouses_detail_subVar || "warehouses_detail_subVar"}
                                                </h4>
                                                {isState.dataProductSerial.is_enable === "1" && (
                                                    <h4 className="col-span-1 py-2 xl:text-sm lg:text-xs px-2 text-gray-600 uppercase  font-[600] text-start">
                                                        {"Serial"}
                                                    </h4>
                                                )}
                                                {isState.dataMaterialExpiry.is_enable === "1" ||
                                                    isState.dataProductExpiry.is_enable === "1" ? (
                                                    <>
                                                        <h4 className="col-span-1 py-2 xl:text-sm lg:text-xs px-2 text-gray-600 uppercase  font-[600] text-start">
                                                            {"Lot"}
                                                        </h4>
                                                        <h4 className="col-span-1 py-2 xl:text-sm lg:text-xs px-2 text-gray-600 uppercase  font-[600] text-start">
                                                            {dataLang?.warehouses_detail_date || "warehouses_detail_date"}
                                                        </h4>
                                                    </>
                                                ) : (
                                                    ""
                                                )}
                                                <h4 className="col-span-1 py-2 xl:text-sm lg:text-xs px-2 text-gray-600 uppercase  font-[600] text-start">
                                                    {dataLang?.warehouses_detail_quantity || "warehouses_detail_quantity"}
                                                </h4>
                                                <h4 className="col-span-1 py-2 xl:text-sm lg:text-xs px-2 text-gray-600 uppercase  font-[600] text-start">
                                                    {dataLang?.warehouses_detail_value || "warehouses_detail_value"}
                                                </h4>
                                            </div>
                                            {/* data table */}
                                            {
                                                isState.isLoading ? (
                                                    <Loading className="3xl:max-h-[560px] 3xl:h-[560px] 2xl:max-h-[400px] 2xl:h-[400px] max-h-[400px] h-[400px]" color="#0f4f9e" />
                                                ) : isState?.dataWarehouseDetail && isState?.dataWarehouseDetail?.length > 0 ? (
                                                    <div className=" min:h-[400px] h-[100%] w-full max:h-[600px]  ">
                                                        {isState?.dataWarehouseDetail && isState?.dataWarehouseDetail?.map((e) => (
                                                            <div
                                                                className={`${isState?.dataProductSerial.is_enable == "1"
                                                                    ? isState?.dataMaterialExpiry.is_enable != isState?.dataProductExpiry.is_enable
                                                                        ? "grid-cols-10"
                                                                        : isState?.dataMaterialExpiry.is_enable == "1" ? "grid-cols-10" : "grid-cols-8"
                                                                    : isState?.dataMaterialExpiry.is_enable != isState?.dataProductExpiry.is_enable
                                                                        ? "grid-cols-9"
                                                                        : isState?.dataMaterialExpiry.is_enable == "1" ? "grid-cols-9" : "grid-cols-7"
                                                                    }  grid hover:bg-slate-50 px-2`}
                                                            >
                                                                <div className={`${""} col-span-2 flex justify-center items-center border-b py-2`}>
                                                                    <h6 className="xl:text-base text-xs w-full  ">
                                                                        {e?.image == null ? (
                                                                            <div className='flex gap-3 px-2 w-full'>
                                                                                <div className='w-[25%] max-w-[25%]'>
                                                                                    <ModalImage
                                                                                        small="/no_image.png"
                                                                                        large="/no_image.png"
                                                                                        className="w-[70px] h-[70px] rounded object-contain"
                                                                                    />
                                                                                </div>
                                                                                <div className='w-[75%] max-w-[75%] flex flex-col gap-2'>
                                                                                    <h6 className="3xl:text-base xl:text-sm lg:text-xs font-medium text-[9px] text-zinc-600 w-[full] text-left ">
                                                                                        {e.item_name == null ? "-" : e.item_name}
                                                                                    </h6>

                                                                                    <h6 className="3xl:text-base xl:text-sm lg:text-xs font-medium text-[9px] text-zinc-600 w-[full] text-left ">
                                                                                        {e.item_code == null ? "-" : e.item_code}
                                                                                    </h6>

                                                                                    <h6 className="w-fit text-left ">
                                                                                        <span
                                                                                            className={`${e.item_type == "product"
                                                                                                ? "text-lime-500  border-lime-500 "
                                                                                                : " text-orange-500 border-orange-500"
                                                                                                } border rounded py-1 px-1.5 w-fit text-[10px]`}
                                                                                        >
                                                                                            {e.item_type ? dataLang[e?.item_type] : ""}
                                                                                        </span>
                                                                                    </h6>
                                                                                </div>
                                                                            </div>
                                                                        ) : (
                                                                            <div className='flex gap-3 px-2 w-full'>
                                                                                <div className='w-[25%] max-w-[25%]'>
                                                                                    <ModalImage
                                                                                        small={e?.image}
                                                                                        large={e?.image}
                                                                                        className="w-[70px] max-w-[70px] h-[70px] rounded-lg object-cover"
                                                                                    />
                                                                                </div>
                                                                                <div className='w-[75%] max-w-[75%] flex flex-col gap-2'>
                                                                                    <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 w-[full] text-left ">
                                                                                        {e.item_name == null ? "-" : e.item_name}
                                                                                    </h6>

                                                                                    <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 w-[full] text-left ">
                                                                                        {e.item_code == null ? "-" : e.item_code}
                                                                                    </h6>

                                                                                    <h6 className="w-fit text-left ">
                                                                                        <span
                                                                                            className={`${e.item_type == "product"
                                                                                                ? "text-lime-500  border-lime-500 "
                                                                                                : " text-orange-500 border-orange-500"
                                                                                                } border rounded py-1 px-1.5 w-fit text-[10px]`}
                                                                                        >
                                                                                            {e.item_type ? dataLang[e?.item_type] : ""}
                                                                                        </span>
                                                                                    </h6>

                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </h6>
                                                                </div>

                                                                <div
                                                                    className={` grid ${isState.dataProductSerial.is_enable == "1"
                                                                        ? isState.dataMaterialExpiry.is_enable != isState.dataProductExpiry.is_enable
                                                                            ? "col-span-8"
                                                                            : isState.dataMaterialExpiry.is_enable == "1" ? "col-span-8" : "col-span-6"
                                                                        : isState.dataMaterialExpiry.is_enable != isState.dataProductExpiry.is_enable
                                                                            ? "col-span-7"
                                                                            : isState.dataMaterialExpiry.is_enable == "1" ? "col-span-7" : "col-span-5"
                                                                        }`}
                                                                >
                                                                    {e?.detail.map((item) => (
                                                                        <div
                                                                            className={`grid ${isState.dataProductSerial.is_enable == "1"
                                                                                ? isState.dataMaterialExpiry.is_enable != isState.dataProductExpiry.is_enable
                                                                                    ? "grid-cols-8"
                                                                                    : isState.dataMaterialExpiry.is_enable == "1"
                                                                                        ? "grid-cols-8" : "grid-cols-6"
                                                                                : isState.dataMaterialExpiry.is_enable != isState.dataProductExpiry.is_enable
                                                                                    ? "grid-cols-7"
                                                                                    : isState.dataMaterialExpiry.is_enable == "1"
                                                                                        ? "grid-cols-7" : " grid-cols-5"
                                                                                }`}
                                                                        >
                                                                            <div className="col-span-1 border-b">
                                                                                <h6 className="3xl:text-base xl:text-sm lg:text-xs font-medium text-[9px] text-zinc-600  px-2 py-3  w-[full] text-left ">
                                                                                    {" "}
                                                                                    {item.location_name == null ? "-" : item.location_name}
                                                                                </h6>
                                                                            </div>
                                                                            <div className=" col-span-1 border-b">
                                                                                <h6 className="3xl:text-base xl:text-sm lg:text-xs font-medium text-[9px] text-zinc-600  px-2 py-3  w-[full] text-center ">
                                                                                    {item.option_name_1 == null ? "-" : item.option_name_1}
                                                                                </h6>
                                                                            </div>
                                                                            <div className=" col-span-1 border-b">
                                                                                <h6 className="3xl:text-base xl:text-sm lg:text-xs font-medium text-[9px] text-zinc-600  px-2 py-3  w-[full] text-center ">
                                                                                    {item.option_name_2 == null ? "-" : item.option_name_2}
                                                                                </h6>
                                                                            </div>
                                                                            {isState.dataProductSerial.is_enable === "1" ? (
                                                                                <div className=" col-span-1 border-b">
                                                                                    <h6 className="3xl:text-base xl:text-sm lg:text-xs font-medium text-[9px] text-zinc-600  px-2 py-3  w-[full] text-left ">
                                                                                        {item.serial == null || item.serial == "" ? "-" : item.serial}
                                                                                    </h6>
                                                                                </div>
                                                                            ) : (
                                                                                ""
                                                                            )}
                                                                            {isState.dataMaterialExpiry.is_enable === "1" || isState.dataProductExpiry.is_enable === "1" ? (
                                                                                <>
                                                                                    <div className=" col-span-1 border-b ">
                                                                                        <h6 className="3xl:text-base xl:text-sm lg:text-xs font-medium text-[9px] text-zinc-600  px-2 py-3  w-[full] text-left ">
                                                                                            {item.lot == null || item.lot == "" ? "-" : item.lot}
                                                                                        </h6>
                                                                                    </div>
                                                                                    <div className=" col-span-1 border-b ">
                                                                                        <h6 className="3xl:text-base xl:text-sm lg:text-xs font-medium text-[9px] text-zinc-600  px-2 py-3  w-[full] text-center ">
                                                                                            {item.expiration_date ? moment(item.expiration_date).format("DD/MM/YYYY") : "-"}
                                                                                        </h6>
                                                                                    </div>
                                                                                </>
                                                                            ) : (
                                                                                ""
                                                                            )}
                                                                            <div className=" col-span-1 border-b ">
                                                                                <h6 className="3xl:text-base xl:text-sm lg:text-xs  px-2 py-3  w-[full] text-red-500 font-medium text-center ">
                                                                                    {item.quantity ? formatNumber(+item?.quantity) : "-"}
                                                                                </h6>
                                                                            </div>
                                                                            <div className=" col-span-1 border-b">
                                                                                <h6 className="3xl:text-base xl:text-sm lg:text-xs font-medium text-[9px] text-zinc-600  px-2 py-3  w-[full] text-right ">
                                                                                    {item.amount ? formatNumber(+item?.amount) : "-"}
                                                                                </h6>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>

                                                            </div>
                                                        ))}
                                                    </div>
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
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {isState?.dataWarehouse && isState?.dataWarehouse?.length != 0 && (
                            <div className="flex space-x-5 items-center justify-end ">
                                <h6 className='3xl:text-base text-sm'>
                                    {dataLang?.display} {isState?.totalItemWarehouseDetail?.iTotalDisplayRecords} {dataLang?.among}{" "}
                                    {isState?.totalItemWarehouseDetail?.iTotalRecords} {dataLang?.ingredient}
                                </h6>
                                <Pagination
                                    postsPerPage={isState.limitItemWarehouseDetail}
                                    totalPosts={Number(isState?.totalItemWarehouseDetail?.iTotalDisplayRecords)}
                                    paginate={paginate}
                                    currentPage={router.query?.page || 1}
                                    className='3xl:text-base text-sm'
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <PopupConfim
                dataLang={dataLang}
                type="warning"
                title={TITLE_DELETE}
                subtitle={CONFIRM_DELETION}
                isOpen={isOpen}
                save={handleDelete}
                cancel={() => handleQueryId({ status: false })}
            />
        </React.Fragment>
    );
};
const Popup_kho = (props) => {
    const [open, sOpen] = useState(false);

    const isShow = useToast();

    const _ToggleModal = (e) => sOpen(e);

    const scrollAreaRef = useRef(null);

    const handleMenuOpen = () => {
        const menuPortalTarget = scrollAreaRef.current;
        return { menuPortalTarget };
    };

    const [onSending, sOnSending] = useState(false);

    const [brandpOpt, sListBrand] = useState([]);

    const [name, sName] = useState("");

    const [code, sCode] = useState("");

    const [address, sAddress] = useState("");

    const [note, sNote] = useState("");

    const [errInputCode, sErrInputCode] = useState(false);

    const [errInputName, sErrInputName] = useState(false);

    const [errInputAddress, sErrInputAddress] = useState(false);

    const [errInputBr, sErrInputBr] = useState(false);

    const [valueBr, sValueBr] = useState([]);

    useEffect(() => {
        sErrInputBr(false);
        sErrInputCode(false);
        sErrInputName(false);
        sErrInputAddress(false);
        sName(props.name ? props.name : "");
        sCode(props.code ? props.code : "");
        sAddress(props.address ? props.address : "");
        sNote(props.note ? props.note : "");
        sListBrand(
            props.listBr
                ? props.listBr && [
                    ...props.listBr?.map((e) => ({
                        label: e.name,
                        value: Number(e.id),
                    })),
                ]
                : []
        );

        sValueBr(
            props.sValueBr
                ? props.listBr && [
                    ...props.sValueBr?.map((e) => ({
                        label: e.name,
                        value: Number(e.id),
                    })),
                ]
                : []
        );
    }, [open]);
    const checkId =
        props?.id &&
        props.sValueBr?.reduce((obj, e) => {
            obj.value = Number(e.id);
            return obj;
        }, {});
    const branch_id = valueBr?.value || checkId?.value;

    const _HandleChangeInput = (type, value) => {
        if (type == "name") {
            sName(value.target?.value);
        } else if (type == "valueBr") {
            sValueBr(value);
        } else if (type == "code") {
            sCode(value.target?.value);
        } else if (type == "address") {
            sAddress(value.target?.value);
        } else if (type == "note") {
            sNote(value.target?.value);
        }
    };

    const _ServerSending = () => {
        const id = props.id;
        var data = new FormData();
        data.append("name", name);
        data.append("code", code);
        data.append("address", address);
        data.append("note", note);
        data.append("branch_id[]", branch_id);
        Axios(
            "POST",
            `${props.id
                ? `/api_web/api_warehouse/warehouse/${id}?csrf_protection=true`
                : "/api_web/api_warehouse/warehouse/?csrf_protection=true"
            }`,
            {
                data: data,
                headers: { "Content-Type": "multipart/form-data" },
            },
            (err, response) => {
                if (!err) {
                    var { isSuccess, message } = response.data;
                    if (isSuccess) {
                        Toast.fire({
                            icon: "success",
                            title: `${props.dataLang[message]}`,
                        });
                        sErrInputCode(false);
                        sErrInputName(false);
                        sErrInputAddress(false);
                        sName("");
                        sCode("");
                        sAddress("");
                        sNote("");
                        sErrInputBr(false);
                        sValueBr([]);
                        props.onRefresh && props.onRefresh();
                        sOpen(false);
                    } else {
                        isShow("error", `${props.dataLang[message]}`);
                    }
                }
                sOnSending(false);
            }
        );
    };
    //da up date
    useEffect(() => {
        onSending && _ServerSending();
    }, [onSending]);

    const _HandleSubmit = (e) => {
        e.preventDefault();
        if (code.length == 0 || branch_id == null || name.length == 0 || address.length == 0) {
            code?.length == 0 && sErrInputCode(true);
            name?.length == 0 && sErrInputName(true);
            address?.length == 0 && sErrInputAddress(true);
            branch_id == null && sErrInputBr(true);
            isShow("error", `${props.dataLang?.required_field_null}`);
        } else {
            sOnSending(true);
        }
    };

    useEffect(() => {
        sErrInputCode(false);
    }, [code.length > 0]);

    useEffect(() => {
        sErrInputName(false);
    }, [name.length > 0]);

    useEffect(() => {
        sErrInputAddress(false);
    }, [address.length > 0]);

    useEffect(() => {
        sErrInputBr(false);
    }, [branch_id != null]);

    return (
        <>
            <PopupEdit
                title={
                    props.id ? `${props.dataLang?.Warehouse_poppup_edit}` : `${props.dataLang?.Warehouse_poppup_add}`
                }
                button={props.id ? <IconEdit /> : `${props.dataLang?.branch_popup_create_new}`}
                onClickOpen={_ToggleModal.bind(this, true)}
                open={open}
                onClose={_ToggleModal.bind(this, false)}
                classNameBtn={props.className}
            >
                <div className="mt-4">
                    <form onSubmit={_HandleSubmit.bind(this)} className="">
                        <ScrollArea
                            ref={scrollAreaRef}
                            className="h-[420px] overflow-hidden"
                            speed={1}
                            smoothScrolling={true}
                        >
                            <div className="w-[30vw] ">
                                <div className="flex flex-wrap justify-between ">
                                    <div className="w-full">
                                        <div>
                                            <label className="text-[#344054] font-normal text-sm mb-1 ">
                                                {props.dataLang?.Warehouse_poppup_code}
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                value={code}
                                                onChange={_HandleChangeInput.bind(this, "code")}
                                                placeholder={props.dataLang?.Warehouse_poppup_code}
                                                name="fname"
                                                type="text"
                                                className={`${errInputCode
                                                    ? "border-red-500"
                                                    : "focus:border-[#92BFF7] border-[#d0d5dd]"
                                                    } placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2`}
                                            />
                                            {errInputCode && (
                                                <label className="mb-4  text-[14px] text-red-500">
                                                    {props.dataLang?.Warehouse_poppup_errcode}
                                                </label>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-[#344054] font-normal text-sm mb-1 ">
                                                {props.dataLang?.Warehouse_poppup_name}
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                value={name}
                                                onChange={_HandleChangeInput.bind(this, "name")}
                                                placeholder={props.dataLang?.Warehouse_poppup_name}
                                                name="fname"
                                                type="text"
                                                className={`${errInputName
                                                    ? "border-red-500"
                                                    : "focus:border-[#92BFF7] border-[#d0d5dd]"
                                                    } placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2`}
                                            />
                                            {errInputName && (
                                                <label className="mb-4  text-[14px] text-red-500">
                                                    {props.dataLang?.Warehouse_poppup_errname}
                                                </label>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-[#344054] font-normal text-sm mb-1 ">
                                                {props.dataLang?.Warehouse_poppup_address}
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                value={address}
                                                onChange={_HandleChangeInput.bind(this, "address")}
                                                placeholder={props.dataLang?.Warehouse_poppup_address}
                                                name="fname"
                                                type="text"
                                                className={`${errInputAddress
                                                    ? "border-red-500"
                                                    : "focus:border-[#92BFF7] border-[#d0d5dd]"
                                                    } placeholder:text-slate-300 w-full bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-1.5 border outline-none mb-2`}
                                            />
                                            {errInputAddress && (
                                                <label className="mb-4  text-[14px] text-red-500">
                                                    {props.dataLang?.Warehouse_poppup_erraddress}
                                                </label>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-[#344054] font-normal text-sm mb-1 ">
                                                {props.dataLang?.client_list_brand}{" "}
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <Select
                                                //  closeMenuOnSelect={false}
                                                placeholder={props.dataLang?.client_list_brand}
                                                options={brandpOpt}
                                                isSearchable={true}
                                                onChange={_HandleChangeInput.bind(this, "valueBr")}
                                                // isMulti
                                                noOptionsMessage={() => "Không có dữ liệu"}
                                                value={valueBr}
                                                maxMenuHeight="200px"
                                                // isClearable={true}
                                                menuPortalTarget={document.body}
                                                onMenuOpen={handleMenuOpen}
                                                styles={{
                                                    placeholder: (base) => ({
                                                        ...base,
                                                        color: "#cbd5e1",
                                                    }),
                                                    menuPortal: (base) => ({
                                                        ...base,
                                                        zIndex: 9999,
                                                        position: "absolute",
                                                    }),
                                                    // control: base => ({
                                                    //   ...base,
                                                    //   border: '1px solid #d0d5dd',
                                                    //   boxShadow: 'none',

                                                    // })  ,
                                                    control: (provided) => ({
                                                        ...provided,
                                                        border: "1px solid #d0d5dd",
                                                        "&:focus": {
                                                            outline: "none",
                                                            border: "none",
                                                        },
                                                    }),
                                                }}
                                                className={`${errInputBr ? "border-red-500" : "border-transparent"
                                                    } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
                                            />
                                            {errInputBr && (
                                                <label className="mb-2  text-[14px] text-red-500">
                                                    {props.dataLang?.client_list_bran}
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                    <label className="text-[#344054] font-normal text-sm mb-1 ">
                                        {props.dataLang?.client_popup_note}
                                    </label>
                                    <textarea
                                        value={note}
                                        placeholder={props.dataLang?.client_popup_note}
                                        onChange={_HandleChangeInput.bind(this, "note")}
                                        name="fname"
                                        type="text"
                                        className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full min-h-[80px] max-h-[150px] bg-[#ffffff] rounded-[5.5px] text-[#52575E] font-normal p-2 border outline-none mb-2"
                                    />
                                </div>
                            </div>
                        </ScrollArea>

                        <div className="text-right mt-5 space-x-2">
                            <button
                                type="button"
                                onClick={_ToggleModal.bind(this, false)}
                                className="button text-[#344054] font-normal text-base py-2 px-4 rounded-[5.5px] border border-solid border-[#D0D5DD]"
                            >
                                {props.dataLang?.branch_popup_exit}
                            </button>
                            <button
                                type="submit"
                                className="button text-[#FFFFFF]  font-normal text-base py-2 px-4 rounded-[5.5px] bg-[#0F4F9E]"
                            >
                                {props.dataLang?.branch_popup_save}
                            </button>
                        </div>
                    </form>
                </div>
            </PopupEdit>
        </>
    );
};
const MoreSelectedBadge = ({ items }) => {
    const style = {
        marginLeft: "auto",
        background: "#d4eefa",
        borderRadius: "4px",
        fontSize: "14px",
        padding: "1px 3px",
        order: 99,
    };

    const title = items.join(", ");
    const length = items.length;
    const label = `+ ${length}`;

    return (
        <div style={style} title={title}>
            {label}
        </div>
    );
};

const MultiValue = ({ index, getValue, ...props }) => {
    const maxToShow = 1;
    const overflow = getValue()
        .slice(maxToShow)
        .map((x) => x.label);

    return index < maxToShow ? (
        <components.MultiValue {...props} />
    ) : index === maxToShow ? (
        <MoreSelectedBadge items={overflow} />
    ) : null;
};
export default Index;
