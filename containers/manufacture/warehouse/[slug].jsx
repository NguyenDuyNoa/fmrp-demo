import apiWarehouse from "@/Api/apiManufacture/warehouse/apiWarehouse/apiWarehouse";
import { TagColorProduct } from "@/components/UI/common/Tag/TagStatus";
import Loading from "@/components/UI/loading/loading";
import MultiValue from "@/components/UI/mutiValue/multiValue";
import NoData from "@/components/UI/noData/nodata";
import Pagination from "@/components/UI/pagination";
import { optionsQuery } from "@/configs/optionsQuery";
import { FORMAT_MOMENT } from "@/constants/formatDate/formatDate";
import { useVariantList } from "@/hooks/common/useItems";
import useFeature from "@/hooks/useConfigFeature";
import { useLimitAndTotalItems } from "@/hooks/useLimitAndTotalItems";
import usePagination from "@/hooks/usePagination";
import useStatusExprired from "@/hooks/useStatusExprired";
import { formatMoment } from "@/utils/helpers/formatMoment";
import { useQuery } from "@tanstack/react-query";
import { House2, Grid6 as IconExcel, SearchNormal1 as IconSearch, Refresh2 } from "iconsax-react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import ReactExport from "react-data-export";
import ModalImage from "react-modal-image";
import "react-phone-input-2/lib/style.css";
import Select from "react-select";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const WarehouseSlug = (props) => {
    const router = useRouter();
    const id = router.query.slug;
    const dataLang = props.dataLang;
    const { paginate } = usePagination();
    const statusExprired = useStatusExprired();
    const [keySearch, sKeySearch] = useState("");
    const [location, sListLocation] = useState([]);
    const [idLocation, sIdLocation] = useState(null);
    const [idVariantSub, sIdVariantSub] = useState(null);
    const [idVariantMain, sIdVariantMain] = useState(null);
    const { limit, updateLimit: sLimit } = useLimitAndTotalItems();
    const { dataMaterialExpiry, dataProductExpiry, dataProductSerial } = useFeature()

    const params = {
        search: keySearch,
        limit: limit,
        page: router.query?.page || 1,
        "filter[location_id]": idLocation?.value ? idLocation?.value : null,
        "filter[variation_option_id_1]": idVariantMain?.value ? idVariantMain?.value : null,
        "filter[variation_option_id_2]": idVariantSub?.value ? idVariantSub?.value : null,
    }

    const { data: listVariant = [] } = useVariantList(params);

    const { data, isFetching, refetch } = useQuery({
        queryKey: ['api_detail_warehouse', { ...params }],
        queryFn: async () => {
            const { rResult, output } = await apiWarehouse.apiWarehouseDetail(id, { params: params })
            const { name } = await apiWarehouse.apiNameWarehouse(id)
            return { rResult, output, name }
        },
        ...optionsQuery
    })


    useQuery({
        queryKey: ['api_location', { ...params }],
        queryFn: async () => {
            const { rResult, } = await apiWarehouse.apiLocationWarehouse(id, { params: params })
            sListLocation(rResult.map((e) => ({ label: e.name, value: e.id })));
            return rResult
        },
        ...optionsQuery
    })


    const onchang_filter = (type, value) => {
        if (type == "location") {
            sIdLocation(value);
        } else if (type == "MainVariation") {
            sIdVariantMain(value);
        } else if (type == "SubVariation") {
            sIdVariantSub(value);
        }
    };


    const _HandleOnChangeKeySearch = ({ target: { value } }) => {
        sKeySearch(value);
        router.replace({
            query: {
                slug: router.query.slug,
            },
        });
    };

    const newResult = data?.rResult?.map((item) => {
        const detail = item.detail || [];
        return detail.map((detailItem) => ({
            ...item,
            detail: detailItem,
        }));
    }).flat();

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

    return (
        <React.Fragment>
            <Head>
                <title>{data?.name}</title>
            </Head>
            <div className="px-10 xl:pt-24 pt-[88px] pb-10 space-y-4 overflow-hidden h-screen">
                {statusExprired ? (
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
                                    <h2 className="text-2xl text-[#52575E]">{data?.name}</h2>
                                </div>
                                <div className="flex items-center justify-end">
                                    <button
                                        type="button"
                                        onClick={() => router.back()}
                                        className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5  bg-slate-100  rounded btn-animation hover:scale-105"
                                    >
                                        {dataLang?.warehouses_detail_back}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2 2xl:h-[95%] h-[92%] overflow-hidden">
                                <div className="space-y-2 xl:space-y-3">
                                    <div className="grid items-center justify-between w-full grid-cols-6 p-2 rounded bg-slate-100 xl:p-3">
                                        <div className="grid grid-cols-5 col-span-4">
                                            <div className="col-span-1">
                                                <form className="relative flex items-center">
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
                                            <div className="col-span-1 ml-1">
                                                <Select
                                                    options={[
                                                        {
                                                            value: "",
                                                            label: dataLang?.warehouses_detail_filterWare || "warehouses_detail_filterWare",
                                                            isDisabled: true,
                                                        },
                                                        ...location,
                                                    ]}
                                                    onChange={onchang_filter.bind(this, "location")}
                                                    value={idLocation}
                                                    hideSelectedOptions={false}
                                                    isClearable={true}
                                                    placeholder={dataLang?.warehouses_detail_filterWare || "warehouses_detail_filterWare"}
                                                    className="rounded-md bg-white  2xl:text-base xl:text-xs text-[10px]  z-20"
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
                                            <div className="col-span-1 ml-1">
                                                <Select
                                                    options={[
                                                        {
                                                            value: "",
                                                            label: dataLang?.warehouses_detail_filterMain || "warehouses_detail_filterMain",
                                                            isDisabled: true,
                                                        },
                                                        ...listVariant,
                                                    ]}
                                                    onChange={onchang_filter.bind(this, "MainVariation")}
                                                    value={idVariantMain}
                                                    hideSelectedOptions={false}
                                                    isClearable={true}
                                                    placeholder={dataLang?.warehouses_detail_filterMain || "warehouses_detail_filterMain"}
                                                    className="rounded-md bg-white  2xl:text-base xl:text-xs text-[10px]  z-20"
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
                                            <div className="col-span-1 ml-1">
                                                <Select
                                                    options={[
                                                        {
                                                            value: "",
                                                            label: dataLang?.warehouses_detail_filterSub || "warehouses_detail_filterSub",
                                                            isDisabled: true,
                                                        },
                                                        ...listVariant,
                                                    ]}
                                                    onChange={onchang_filter.bind(this, "SubVariation")}
                                                    value={idVariantSub}
                                                    hideSelectedOptions={false}
                                                    isClearable={true}
                                                    placeholder={dataLang?.warehouses_detail_filterSub || "warehouses_detail_filterSub"}
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
                                        <div className="flex items-center justify-end col-span-2 space-x-2">
                                            <button
                                                onClick={refetch.bind(this)}
                                                type="button"
                                                className="p-2 transition-all ease-in-out rounded-md bg-green-50 hover:bg-green-200 hover:scale-105 group animate-pulse hover:animate-none"
                                            >
                                                <Refresh2
                                                    className="transition-all ease-in-out group-hover:-rotate-45"
                                                    size="22"
                                                    color="green"
                                                />
                                            </button>
                                            {newResult?.length > 0 && (
                                                <ExcelFile
                                                    filename={data?.name}
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
                                                {dataLang?.warehouses_detail_productname || "warehouses_detail_productname"}
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
                                            {dataMaterialExpiry.is_enable === "1" || dataProductExpiry.is_enable === "1" ? (
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
                                        {(isFetching) ? (
                                            <Loading className="h-80" color="#0f4f9e" />
                                        ) : data?.rResult?.length > 0 ? (
                                            <div className=" min:h-[400px] h-[100%] w-full max:h-[600px]  ">
                                                {data?.rResult?.map((e) => (
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
                                                                        small="/icon/noimagelogo.png"
                                                                        large="/icon/noimagelogo.png"
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
                                                        <div className="flex items-center col-span-1 border-b border-r ">
                                                            <h6 className=" 3xl:items-center 3xl-text-[16px] 2xl:text-[13px] xl:text-xs text-[8px] py-3  w-fit text-left ">
                                                                {/* <span
                                                                    className={`${e.item_type == "product"
                                                                        ? "text-lime-500  border-lime-500 "
                                                                        : " text-orange-500 border-orange-500"
                                                                        } border rounded py-1 px-1.5 w-fit ml-1 3xl:items-center 3xl-text-[16px] 2xl:text-[13px] xl:text-xs text-[8px]`}
                                                                >
                                                                    {e.item_type ? dataLang[e?.item_type] : ""}
                                                                </span> */}
                                                                <TagColorProduct
                                                                    dataKey={e?.item_type === "product" ? 0 : 1}
                                                                    dataLang={dataLang}
                                                                    name={e?.item_type}
                                                                />
                                                            </h6>
                                                        </div>
                                                        <div className="flex items-center col-span-1 border-b border-r ">
                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600  px-2 py-3  w-[full] text-left ">
                                                                {e.item_code == null ? "-" : e.item_code}
                                                            </h6>
                                                        </div>
                                                        <div className="flex items-center col-span-1 border-b ">
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
                                                                    <div className="col-span-1 border-b border-r">
                                                                        <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600  px-2 py-3  w-[full] text-left ">
                                                                            {" "}
                                                                            {e.location_name == null ? "-" : e.location_name}
                                                                        </h6>
                                                                    </div>
                                                                    <div className="col-span-1 border-b border-r ">
                                                                        <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600  px-2 py-3  w-[full] text-center ">
                                                                            {e.option_name_1 == null ? "-" : e.option_name_1}
                                                                        </h6>
                                                                    </div>
                                                                    <div className="col-span-1 border-b border-r ">
                                                                        <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600  px-2 py-3  w-[full] text-center ">
                                                                            {e.option_name_2 == null
                                                                                ? "-"
                                                                                : e.option_name_2}
                                                                        </h6>
                                                                    </div>
                                                                    {dataProductSerial.is_enable === "1" ? (
                                                                        <div className="col-span-1 border-b border-r ">
                                                                            <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600  px-2 py-3  w-[full] text-left ">
                                                                                {e.serial == null || e.serial == ""
                                                                                    ? "-"
                                                                                    : e.serial}
                                                                            </h6>
                                                                        </div>
                                                                    ) : (
                                                                        ""
                                                                    )}
                                                                    {dataMaterialExpiry.is_enable === "1" || dataProductExpiry.is_enable === "1" ? (
                                                                        <>
                                                                            <div className="col-span-1 border-b border-r ">
                                                                                <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600  px-2 py-3  w-[full] text-left ">
                                                                                    {e.lot == null || e.lot == "" ? "-" : e.lot}
                                                                                </h6>
                                                                            </div>
                                                                            <div className="col-span-1 border-b border-r ">
                                                                                <h6 className="3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600  px-2 py-3  w-[full] text-center ">
                                                                                    {e.expiration_date ? formatMoment(e.expiration_date, FORMAT_MOMENT.DATE_SLASH_LONG) : "-"}
                                                                                </h6>
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        ""
                                                                    )}
                                                                    <div className="col-span-1 border-b border-r ">
                                                                        <h6 className="xl:text-base text-sm  px-2 py-3  w-[full] text-red-500 font-medium text-center ">
                                                                            {e.quantity ? formatNumber(e?.quantity) : "-"}
                                                                        </h6>
                                                                    </div>
                                                                    <div className="col-span-1 border-b ">
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
                                        ) : <NoData />}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {data?.rResult?.length != 0 && (
                            <div className="flex items-center space-x-5">
                                <h6>
                                    {dataLang?.display} {data?.output?.iTotalDisplayRecords} {dataLang?.among}{" "}
                                    {data?.output?.iTotalRecords} {dataLang?.ingredient}
                                </h6>
                                <Pagination
                                    postsPerPage={limit}
                                    totalPosts={Number(data?.output?.iTotalDisplayRecords)}
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
export default WarehouseSlug;
