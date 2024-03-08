import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import PopupEdit from "/components/UI/popup";
import Loading from "components/UI/loading";
import { _ServerInstance as Axios } from "/services/axios";
import Pagination from "/components/UI/pagination";

import {
    Edit as IconEdit,
    Trash as IconDelete,
    Grid6 as IconExcel,
    SearchNormal1 as IconSearch,
    House2,
    Refresh2,
} from "iconsax-react";
import Swal from "sweetalert2";

import "react-phone-input-2/lib/style.css";
import ReactExport from "react-data-export";
import Select, { components } from "react-select";
import ModalImage from "react-modal-image";
import Link from "next/link";
import moment from "moment";
import { useSelector } from "react-redux";
import useStatusExprired from "@/hooks/useStatusExprired";

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
});

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const Index = (props) => {
    const router = useRouter();
    const dataLang = props.dataLang;
    const id = router.query.slug;
    const [data, sData] = useState([]);
    const [data_ex, sData_ex] = useState([]);
    const [onFetching, sOnFetching] = useState(true);

    const [keySearch, sKeySearch] = useState("");
    const [limit, sLimit] = useState(15);
    const [totalItem, sTotalItem] = useState([]);

    const [title, sTitle] = useState("");
    const [dataMaterialExpiry, sDataMaterialExpiry] = useState({});
    const [dataProductExpiry, sDataProductExpiry] = useState({});
    const [dataProductSerial, sDataProductSerial] = useState({});

    const [location, sListLocation] = useState([]);
    const [idLocation, sIdLocation] = useState(null);
    const [variant, sListVariant] = useState([]);
    const [idVariantMain, sIdVariantMain] = useState(null);
    const [idVariantSub, sIdVariantSub] = useState(null);

    const _ServerFetching = () => {
        Axios(
            "GET",
            `/api_web/api_warehouse/warehouse_detail/${id}?csrf_protection=true`,
            {
                params: {
                    search: keySearch,
                    limit: limit,
                    page: router.query?.page || 1,
                    "filter[location_id]": idLocation?.value ? idLocation?.value : null,
                    "filter[variation_option_id_1]": idVariantMain?.value ? idVariantMain?.value : null,
                    "filter[variation_option_id_2]": idVariantSub?.value ? idVariantSub?.value : null,
                },
            },
            (err, response) => {
                if (!err) {
                    var { rResult, output } = response.data;
                    sData(rResult);
                    sTotalItem(output);
                    sData_ex(rResult);
                }
                sOnFetching(false);
            }
        );
        Axios("GET", "/api_web/api_setting/feature/?csrf_protection=true", {}, (err, response) => {
            if (!err) {
                var data = response.data;
                sDataMaterialExpiry(data.find((x) => x.code == "material_expiry"));
                sDataProductExpiry(data.find((x) => x.code == "product_expiry"));
                sDataProductSerial(data.find((x) => x.code == "product_serial"));
            }
        });
        Axios("GET", `/api_web/api_warehouse/warehouse/${id}?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                var { name } = response.data;
                sTitle(name);
            }
        });
    };

    const _ServerFetching_localtion = () => {
        Axios(
            "GET",
            `/api_web/api_warehouse/location/?csrf_protection=true&filter[warehouse_id]=${id}`,
            {},
            (err, response) => {
                if (!err) {
                    var { rResult } = response.data;
                    sListLocation(rResult.map((e) => ({ label: e.name, value: e.id })));
                }
                sOnFetching(false);
            }
        );
    };
    const _ServerFetching_Variation = () => {
        Axios("GET", `/api_web/Api_variation/variation?csrf_protection=true`, {}, (err, response) => {
            if (!err) {
                const { rResult } = response.data ?? {};
                const options = rResult?.flatMap(({ option }) => option) ?? [];
                sListVariant(
                    options?.map(({ id, name }) => ({
                        label: name,
                        value: id,
                    }))
                );
            }
            sOnFetching(false);
        });
    };

    const onchang_filter = (type, value) => {
        if (type == "location") {
            sIdLocation(value);
        } else if (type == "MainVariation") {
            sIdVariantMain(value);
        } else if (type == "SubVariation") {
            sIdVariantSub(value);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            (onFetching && _ServerFetching()) ||
                (onFetching && _ServerFetching_localtion()) ||
                (onFetching && _ServerFetching_Variation());
        }, 500);
    }, [onFetching]);
    useEffect(() => {
        sOnFetching(true) ||
            (keySearch && sOnFetching(true)) ||
            (idLocation?.length > 0 && sOnFetching(true)) ||
            (idVariantMain?.length > 0 && sOnFetching(true)) ||
            (idVariantSub?.length > 0 && sOnFetching(true));
    }, [limit, router.query?.page, idLocation, idVariantMain, idVariantSub]);

    const paginate = (pageNumber) => {
        router.push({
            query: {
                page: pageNumber,
                slug: router.query.slug,
            },
        });
    };

    const _HandleOnChangeKeySearch = ({ target: { value } }) => {
        sKeySearch(value);
        router.replace({
            query: {
                slug: router.query.slug,
            },
        });
        setTimeout(() => {
            if (!value) {
                sOnFetching(true);
            }
            sOnFetching(true);
        }, 500);
    };

    const newResult = data_ex
        ?.map((item) => {
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
                    value: `${dataProductSerial.is_enable === "1" ? (e?.detail.serial != null ? e?.detail.serial : "") : ""
                        }`,
                },
                {
                    value: `${dataMaterialExpiry.is_enable === "1" ? (e?.detail.lot != null ? e?.detail.lot : "") : ""
                        }`,
                },
                {
                    value: `${
                        // dataProductExpiry.is_enable === "1"
                        //     ? e?.detail.expiration_date != null
                        //         ? e?.detail.expiration_date
                        //         : ""
                        //     : ""
                        dataMaterialExpiry.is_enable === "1"
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

    const formatNumber = (number) => {
        if (!number && number !== 0) return 0;
        const integerPart = Math.floor(number);
        return integerPart.toLocaleString("en");
    };
    const _HandleFresh = () => {
        sOnFetching(true);
    };
    const trangthaiExprired = useStatusExprired();

    console.log('data', data);

    return (
        <React.Fragment>
            <Head>
                <title>{title}</title>
            </Head>
            <div className="px-10 xl:pt-24 pt-[88px] pb-10 space-y-4 overflow-hidden h-screen">
                {trangthaiExprired ? (
                    <div className="p-2"></div>
                ) : (
                    <div className="flex space-x-3 xl:text-[14.5px] text-[12px]">
                        <h6 className="text-[#141522]/40">{dataLang?.warehouses_localtion_ware}</h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.warehouses_detail_title}</h6>
                    </div>
                )}
                <div className="grid grid-cols gap-5 h-[99%] overflow-hidden">
                    <div className="col-span-7 h-[100%] flex flex-col justify-between overflow-hidden">
                        <div className="space-y-3 h-[96%] overflow-hidden">
                            <div className="flex justify-between">
                                <div className="flex items-center gap-2 ">
                                    <House2 size="32" color="#0F4F9E" />
                                    <h2 className="text-2xl text-[#52575E]">{title}</h2>
                                </div>
                                <div className="flex justify-end items-center">
                                    <button
                                        type="button"
                                        // href={"/warehouses/warehouse"}
                                        onClick={() => router.back()}
                                        className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5  bg-slate-100  rounded btn-animation hover:scale-105"
                                    >
                                        {dataLang?.warehouses_detail_back}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2 2xl:h-[95%] h-[92%] overflow-hidden">
                                <div className="xl:space-y-3 space-y-2">
                                    <div className="bg-slate-100 w-full rounded grid grid-cols-6 items-center justify-between xl:p-3 p-2">
                                        <div className="col-span-4 grid grid-cols-5">
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
                                                {/* <h6 className='text-gray-400 xl:text-[14px] text-[12px]'>{dataLang?.client_list_brand}</h6> */}
                                                <Select
                                                    // options={options}
                                                    options={[
                                                        {
                                                            value: "",
                                                            label:
                                                                dataLang?.warehouses_detail_filterWare ||
                                                                "warehouses_detail_filterWare",
                                                            isDisabled: true,
                                                        },
                                                        ...location,
                                                    ]}
                                                    onChange={onchang_filter.bind(this, "location")}
                                                    value={idLocation}
                                                    hideSelectedOptions={false}
                                                    isClearable={true}
                                                    placeholder={
                                                        dataLang?.warehouses_detail_filterWare ||
                                                        "warehouses_detail_filterWare"
                                                    }
                                                    className="rounded-md bg-white  2xl:text-base xl:text-xs text-[10px]  z-20"
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
                                                {/* <h6 className='text-gray-400 xl:text-[14px] text-[12px]'>{dataLang?.client_list_brand}</h6> */}
                                                <Select
                                                    // options={options}
                                                    options={[
                                                        {
                                                            value: "",
                                                            label:
                                                                dataLang?.warehouses_detail_filterMain ||
                                                                "warehouses_detail_filterMain",
                                                            isDisabled: true,
                                                        },
                                                        ...variant,
                                                    ]}
                                                    onChange={onchang_filter.bind(this, "MainVariation")}
                                                    value={idVariantMain}
                                                    hideSelectedOptions={false}
                                                    isClearable={true}
                                                    placeholder={
                                                        dataLang?.warehouses_detail_filterMain ||
                                                        "warehouses_detail_filterMain"
                                                    }
                                                    className="rounded-md bg-white  2xl:text-base xl:text-xs text-[10px]  z-20"
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
                                                {/* <h6 className='text-gray-400 xl:text-[14px] text-[12px]'>{dataLang?.client_list_brand}</h6> */}
                                                <Select
                                                    // options={options}
                                                    options={[
                                                        {
                                                            value: "",
                                                            label:
                                                                dataLang?.warehouses_detail_filterSub ||
                                                                "warehouses_detail_filterSub",
                                                            isDisabled: true,
                                                        },
                                                        ...variant,
                                                    ]}
                                                    onChange={onchang_filter.bind(this, "SubVariation")}
                                                    value={idVariantSub}
                                                    hideSelectedOptions={false}
                                                    isClearable={true}
                                                    placeholder={
                                                        dataLang?.warehouses_detail_filterSub ||
                                                        "warehouses_detail_filterSub"
                                                    }
                                                    className="rounded-md bg-white  2xl:text-base xl:text-xs text-[10px]  z-20"
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
                                        <div className="flex space-x-2 items-center justify-end col-span-2">
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
                                            {data_ex?.length > 0 && (
                                                <ExcelFile
                                                    filename={title}
                                                    title="Ctkh"
                                                    element={
                                                        <button className="xl:px-4 px-3 xl:py-2.5 py-1.5 xl:text-sm text-xs flex items-center space-x-2 bg-[#C7DFFB] rounded hover:scale-105 transition">
                                                            <IconExcel size={18} />
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
                                            <label className="font-[300] text-slate-400">{dataLang?.display}</label>
                                            <select
                                                className="outline-none"
                                                onChange={(e) => sLimit(e.target.value)}
                                                value={limit}
                                            >
                                                <option disabled className="hidden">
                                                    {limit == -1 ? "Tất cả" : limit}
                                                </option>
                                                <option value={15}>15</option>
                                                <option value={20}>20</option>
                                                <option value={40}>40</option>
                                                <option value={60}>60</option>
                                                <option value={-1}>Tất cả</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="min:h-[500px] 2xl:h-[90%] xl:h-[69%] h-[100%] max:h-[800px]  overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                                    <div className={`2xl:w-[100%] pr-2`}>
                                        <div
                                            className={`${dataProductSerial.is_enable == "1"
                                                    ? dataMaterialExpiry.is_enable != dataProductExpiry.is_enable
                                                        ? "grid-cols-12"
                                                        : dataMaterialExpiry.is_enable == "1"
                                                            ? "grid-cols-12"
                                                            : "grid-cols-10"
                                                    : dataMaterialExpiry.is_enable != dataProductExpiry.is_enable
                                                        ? "grid-cols-11"
                                                        : dataMaterialExpiry.is_enable == "1"
                                                            ? "grid-cols-11"
                                                            : "grid-cols-9"
                                                }  grid sticky top-0 bg-white shadow-lg p-2 divide-x  z-10`}
                                        >
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] text-center">
                                                {dataLang?.warehouses_detail_img || "warehouses_detail_img"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] text-center">
                                                {dataLang?.warehouses_detail_type || "warehouses_detail_type"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] text-center">
                                                {dataLang?.warehouses_detail_plu || "warehouses_detail_plu"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] text-center">
                                                {dataLang?.warehouses_detail_productname ||
                                                    "warehouses_detail_productname"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] text-center">
                                                {dataLang?.warehouses_detail_wareLoca || "warehouses_detail_wareLoca"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] text-center">
                                                {dataLang?.warehouses_detail_mainVar || "warehouses_detail_mainVar"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] text-center">
                                                {dataLang?.warehouses_detail_subVar || "warehouses_detail_subVar"}
                                            </h4>
                                            {dataProductSerial.is_enable === "1" && (
                                                <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] text-center">
                                                    {"Serial"}
                                                </h4>
                                            )}
                                            {dataMaterialExpiry.is_enable === "1" ||
                                                dataProductExpiry.is_enable === "1" ? (
                                                <>
                                                    <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] text-center">
                                                        {"Lot"}
                                                    </h4>
                                                    <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] text-center">
                                                        {dataLang?.warehouses_detail_date || "warehouses_detail_date"}
                                                    </h4>
                                                </>
                                            ) : (
                                                ""
                                            )}
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] text-center">
                                                {dataLang?.warehouses_detail_quantity || "warehouses_detail_quantity"}
                                            </h4>
                                            <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600 uppercase  font-[600] text-center">
                                                {dataLang?.warehouses_detail_value || "warehouses_detail_value"}
                                            </h4>
                                        </div>
                                        {onFetching ? (
                                            <Loading className="h-80" color="#0f4f9e" />
                                        ) : data?.length > 0 ? (
                                            <div className=" min:h-[400px] h-[100%] w-full max:h-[600px]  ">
                                                {data?.map((e) => (
                                                    <div
                                                        className={`${dataProductSerial.is_enable == "1"
                                                                ? dataMaterialExpiry.is_enable !=
                                                                    dataProductExpiry.is_enable
                                                                    ? "grid-cols-12"
                                                                    : dataMaterialExpiry.is_enable == "1"
                                                                        ? "grid-cols-12"
                                                                        : "grid-cols-10"
                                                                : dataMaterialExpiry.is_enable !=
                                                                    dataProductExpiry.is_enable
                                                                    ? "grid-cols-11"
                                                                    : dataMaterialExpiry.is_enable == "1"
                                                                        ? "grid-cols-11"
                                                                        : "grid-cols-9"
                                                            }  grid hover:bg-slate-50`}
                                                    >
                                                        <div
                                                            className={`${""}col-span-1 border-l  flex justify-center items-center border-r  border-b`}
                                                        >
                                                            <h6 className="xl:text-base text-xs w-[full]  ">
                                                                {e?.image == null ? (
                                                                    <ModalImage
                                                                        small="/no_image.png"
                                                                        large="/no_image.png"
                                                                        className="w-[40px] h-[40px] rounded object-contain"
                                                                    />
                                                                ) : (
                                                                    <>
                                                                        <ModalImage
                                                                            small={e?.image}
                                                                            large={e?.image}
                                                                            className="w-[40px] h-[40px]  rounded-[100%] object-cover"
                                                                        />
                                                                    </>
                                                                )}
                                                            </h6>
                                                        </div>
                                                        <div className=" col-span-1 border-r  border-b flex  items-center">
                                                            <h6 className=" 3xl:items-center 3xl-text-[16px] 2xl:text-[13px] xl:text-xs text-[8px] py-3  w-fit text-left ">
                                                                <span
                                                                    className={`${e.item_type == "product"
                                                                            ? "text-lime-500  border-lime-500 "
                                                                            : " text-orange-500 border-orange-500"
                                                                        } border rounded py-1 px-1.5 w-fit ml-1 3xl:items-center 3xl-text-[16px] 2xl:text-[13px] xl:text-xs text-[8px]`}
                                                                >
                                                                    {e.item_type ? dataLang[e?.item_type] : ""}
                                                                </span>
                                                            </h6>
                                                        </div>
                                                        <div className=" col-span-1 border-r  border-b flex  items-center">
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600  px-2 py-3  w-[full] text-left ">
                                                                {e.item_code == null ? "-" : e.item_code}
                                                            </h6>
                                                        </div>
                                                        <div className=" col-span-1   border-b flex  items-center">
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600  px-2 py-3  w-[full] text-left ">
                                                                {e.item_name == null ? "-" : e.item_name}
                                                            </h6>
                                                        </div>
                                                        <div
                                                            className={`border-l border-r grid ${dataProductSerial.is_enable == "1"
                                                                    ? dataMaterialExpiry.is_enable !=
                                                                        dataProductExpiry.is_enable
                                                                        ? "col-span-8"
                                                                        : dataMaterialExpiry.is_enable == "1"
                                                                            ? "col-span-8"
                                                                            : "col-span-6"
                                                                    : dataMaterialExpiry.is_enable !=
                                                                        dataProductExpiry.is_enable
                                                                        ? "col-span-7"
                                                                        : dataMaterialExpiry.is_enable == "1"
                                                                            ? "col-span-7"
                                                                            : "col-span-5"
                                                                }`}
                                                        >
                                                            {e?.detail.map((e) => (
                                                                <div
                                                                    className={`grid ${dataProductSerial.is_enable == "1"
                                                                            ? dataMaterialExpiry.is_enable !=
                                                                                dataProductExpiry.is_enable
                                                                                ? "grid-cols-8"
                                                                                : dataMaterialExpiry.is_enable == "1"
                                                                                    ? "grid-cols-8"
                                                                                    : "grid-cols-6"
                                                                            : dataMaterialExpiry.is_enable !=
                                                                                dataProductExpiry.is_enable
                                                                                ? "grid-cols-7"
                                                                                : dataMaterialExpiry.is_enable == "1"
                                                                                    ? "grid-cols-7"
                                                                                    : " grid-cols-5"
                                                                        }`}
                                                                >
                                                                    <div className="col-span-1 border-r border-b">
                                                                        <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600  px-2 py-3  w-[full] text-left ">
                                                                            {" "}
                                                                            {e.location_name == null
                                                                                ? "-"
                                                                                : e.location_name}
                                                                        </h6>
                                                                    </div>
                                                                    <div className=" col-span-1 border-r border-b">
                                                                        <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600  px-2 py-3  w-[full] text-center ">
                                                                            {e.option_name_1 == null
                                                                                ? "-"
                                                                                : e.option_name_1}
                                                                        </h6>
                                                                    </div>
                                                                    <div className=" col-span-1 border-r border-b">
                                                                        <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600  px-2 py-3  w-[full] text-center ">
                                                                            {e.option_name_2 == null
                                                                                ? "-"
                                                                                : e.option_name_2}
                                                                        </h6>
                                                                    </div>
                                                                    {dataProductSerial.is_enable === "1" ? (
                                                                        <div className=" col-span-1 border-r border-b">
                                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600  px-2 py-3  w-[full] text-left ">
                                                                                {e.serial == null || e.serial == ""
                                                                                    ? "-"
                                                                                    : e.serial}
                                                                            </h6>
                                                                        </div>
                                                                    ) : (
                                                                        ""
                                                                    )}
                                                                    {dataMaterialExpiry.is_enable === "1" ||
                                                                        dataProductExpiry.is_enable === "1" ? (
                                                                        <>
                                                                            <div className=" col-span-1 border-r border-b ">
                                                                                <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600  px-2 py-3  w-[full] text-left ">
                                                                                    {e.lot == null || e.lot == ""
                                                                                        ? "-"
                                                                                        : e.lot}
                                                                                </h6>
                                                                            </div>
                                                                            <div className=" col-span-1 border-r border-b ">
                                                                                <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600  px-2 py-3  w-[full] text-center ">
                                                                                    {e.expiration_date
                                                                                        ? moment(
                                                                                            e.expiration_date
                                                                                        ).format("DD/MM/YYYY")
                                                                                        : "-"}
                                                                                </h6>
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        ""
                                                                    )}
                                                                    <div className=" col-span-1 border-r border-b ">
                                                                        <h6 className="xl:text-base text-sm  px-2 py-3  w-[full] text-red-500 font-medium text-center ">
                                                                            {e.quantity
                                                                                ? formatNumber(e?.quantity)
                                                                                : "-"}
                                                                        </h6>
                                                                    </div>
                                                                    <div className=" col-span-1 border-b">
                                                                        <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600  px-2 py-3  w-[full] text-right ">
                                                                            {e.amount ? formatNumber(e?.amount) : "-"}
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
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {data?.length != 0 && (
                            <div className="flex space-x-5 items-center">
                                <h6>
                                    {dataLang?.display} {totalItem?.iTotalDisplayRecords} {dataLang?.among}{" "}
                                    {totalItem?.iTotalRecords} {dataLang?.ingredient}
                                </h6>
                                <Pagination
                                    postsPerPage={limit}
                                    totalPosts={Number(totalItem?.iTotalDisplayRecords)}
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
    const maxToShow = 3;
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
