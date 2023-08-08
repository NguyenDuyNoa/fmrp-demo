import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import dynamic from "next/dynamic";

import { _ServerInstance as Axios } from "/services/axios";
import Loading from "components/UI/loading";
import Pagination from "/components/UI/pagination";
import PopupEdit from "/components/UI/popup";

import {
    SearchNormal1 as IconSearch,
    Trash as IconDelete,
    Edit as IconEdit,
    UserEdit as IconUserEdit,
    Grid6 as IconExcel,
    Image as IconImage,
    GalleryEdit as IconEditImg,
    Refresh2,
} from "iconsax-react";
import { NumericFormat } from "react-number-format";
import Select, { components } from "react-select";
import Swal from "sweetalert2";
const ScrollArea = dynamic(() => import("react-scrollbar"), {
    ssr: false,
});
import ReactExport from "react-data-export";
import moment from "moment";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
});

const CustomSelectOption_GroupNVL = ({ value, label, level, code }) => (
    <div className="flex space-x-2 truncate">
        {level == 1 && <span>--</span>}
        {level == 2 && <span>----</span>}
        {level == 3 && <span>------</span>}
        {level == 4 && <span>--------</span>}
        <span className="2xl:max-w-[300px] max-w-[200px] w-fit truncate">
            {label}
        </span>
    </div>
);

const Index = (props) => {
    const dataLang = props.dataLang;
    const router = useRouter();
    const dispatch = useDispatch();

    const [data, sData] = useState([]);
    const [onFetching, sOnFetching] = useState(false);
    const [onFetchingUnit, sOnFetchingUnit] = useState(false);

    //Bộ lọc Danh mục
    const [dataCateOption, sDataCateOption] = useState([]);
    const [idCategory, sIdCategory] = useState(null);
    //Bộ lọc Chi nhánh
    const [dataBranchOption, sDataBranchOption] = useState([]);
    const [idBranch, sIdBranch] = useState(null);

    const _HandleFilterOpt = (type, value) => {
        if (type == "category") {
            sIdCategory(value);
        } else if (type == "branch") {
            sIdBranch(value);
        }
    };

    const [totalItems, sTotalItems] = useState({});
    const [keySearch, sKeySearch] = useState("");
    const [limit, sLimit] = useState(15);
    const [dataMaterialExpiry, sDataMaterialExpiry] = useState({});

    const _ServerFetching = () => {
        Axios(
            "GET",
            "/api_web/api_material/material?csrf_protection=true",
            {
                params: {
                    search: keySearch,
                    limit: limit,
                    page: router.query?.page || 1,
                    "filter[category_id]": idCategory?.value
                        ? idCategory?.value
                        : null,
                    "filter[branch_id][]":
                        idBranch?.length > 0
                            ? idBranch.map((e) => e.value)
                            : null,
                },
            },
            (err, response) => {
                if (!err) {
                    var { output, rResult } = response.data;
                    sData(rResult);
                    sTotalItems(output);
                }
                sOnFetching(false);
            }
        );
        Axios(
            "GET",
            "/api_web/api_setting/feature/?csrf_protection=true",
            {},
            (err, response) => {
                if (!err) {
                    var data = response.data;
                    sDataMaterialExpiry(
                        data.find((x) => x.code == "material_expiry")
                    );
                }
            }
        );
    };

    useEffect(() => {
        onFetching && _ServerFetching();
    }, [onFetching]);

    useEffect(() => {
        sOnFetching(true) ||
            (keySearch && sOnFetching(true)) ||
            (idCategory && sOnFetching(true)) ||
            (idBranch?.length > 0 && sOnFetching(true)) ||
            (router.query?.page && sOnFetching(true));
    }, [limit, router.query?.page, idCategory, idBranch]);

    const _ServerFetchingUnit = () => {
        Axios(
            "GET",
            "/api_web/Api_unit/unit/?csrf_protection=true",
            {},
            (err, response) => {
                if (!err) {
                    var { rResult } = response.data;
                    dispatch({
                        type: "unit_NVL/update",
                        payload: rResult.map((e) => ({
                            label: e.unit,
                            value: e.id,
                        })),
                    });
                }
            }
        );
        Axios(
            "GET",
            "/api_web/Api_Branch/branch/?csrf_protection=true",
            {},
            (err, response) => {
                if (!err) {
                    var { rResult } = response.data;
                    sDataBranchOption(
                        rResult.map((e) => ({ label: e.name, value: e.id }))
                    );
                    dispatch({
                        type: "branch/update",
                        payload: rResult.map((e) => ({
                            label: e.name,
                            value: e.id,
                        })),
                    });
                }
            }
        );
        Axios(
            "GET",
            "/api_web/api_material/categoryOption?csrf_protection=true",
            {},
            (err, response) => {
                if (!err) {
                    var { rResult } = response.data;
                    sDataCateOption(
                        rResult.map((x) => ({
                            label: `${x.name + " " + "(" + x.code + ")"}`,
                            value: x.id,
                            level: x.level,
                            code: x.code,
                            parent_id: x.parent_id,
                        }))
                    );
                }
            }
        );
        Axios(
            "GET",
            "/api_web/Api_variation/variation?csrf_protection=true",
            {},
            (err, response) => {
                if (!err) {
                    var { rResult } = response.data;
                    dispatch({
                        type: "variant_NVL/update",
                        payload: rResult.map((e) => ({
                            label: e.name,
                            value: e.id,
                            option: e.option,
                        })),
                    });
                }
            }
        );
        sOnFetchingUnit(false);
    };

    useEffect(() => {
        onFetchingUnit && _ServerFetchingUnit();
    }, [onFetchingUnit]);

    useEffect(() => {
        sOnFetchingUnit(true);
    }, []);

    const paginate = (pageNumber) => {
        router.push({
            pathname: router.route,
            query: { page: pageNumber },
        });
    };

    const _HandleOnChangeKeySearch = ({ target: { value } }) => {
        sKeySearch(value);
        router.replace(router.route);
        setTimeout(() => {
            if (!value) {
                sOnFetching(true);
            }
            sOnFetching(true);
        }, 1500);
    };

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
                    `/api_web/api_material/material/${id}?csrf_protection=true`,
                    {},
                    (err, response) => {
                        if (!err) {
                            var { isSuccess, message } = response.data;
                            if (isSuccess) {
                                Toast.fire({
                                    icon: "success",
                                    title: props.dataLang[message],
                                });
                            } else {
                                Toast.fire({
                                    icon: "error",
                                    title: props.dataLang[message],
                                });
                            }
                        }
                        _ServerFetching();
                    }
                );
            }
        });
    };
    const _HandleFresh = () => {
        sOnFetching(true);
        sOnFetchingUnit(true);
    };
    //Set data cho bộ lọc chi nhánh
    const hiddenOptions = idBranch?.length > 2 ? idBranch?.slice(0, 2) : [];
    const options = dataBranchOption.filter(
        (x) => !hiddenOptions.includes(x.value)
    );

    //excel
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
                    title: `${dataLang?.category_material_group_name}`,
                    width: { wpx: 100 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.category_material_list_code}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.category_material_list_name}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.unit}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.stock}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.minimum_amount}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.note}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.category_material_list_variant}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
                {
                    title: `${dataLang?.client_list_brand}`,
                    width: { wch: 40 },
                    style: {
                        fill: { fgColor: { rgb: "C7DFFB" } },
                        font: { bold: true },
                    },
                },
            ],
            data: data.map((e) => [
                { value: `${e.id}`, style: { numFmt: "0" } },
                { value: `${e.category_name}` },
                { value: `${e.code}` },
                { value: `${e.name}` },
                { value: `${e.unit}` },
                { value: `${e.stock_quantity}` },
                { value: `${e.minimum_quantity}` },
                { value: `${e.note}` },
                { value: `${e.variation?.length}` },
                { value: `${JSON.stringify(e.branch?.map((e) => e.name))}` },
            ]),
        },
    ];

    return (
        <React.Fragment>
            <Head>
                <title>{dataLang?.header_category_material_list}</title>
            </Head>
            <div className="xl:px-10 px-3 xl:pt-24 pt-[88px] pb-3 space-y-2.5 h-screen overflow-hidden flex flex-col justify-between">
                <div className="h-[97%] space-y-3 overflow-hidden">
                    <div className="flex space-x-3 xl:text-[14.5px] text-[12px]">
                        <h6 className="text-[#141522]/40">
                            {dataLang?.list_btn_seting_category}
                        </h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6 className="text-[#141522]/40">
                            {dataLang?.header_category_material}
                        </h6>
                        <span className="text-[#141522]/40">/</span>
                        <h6>{dataLang?.header_category_material_list}</h6>
                    </div>
                    <div className="flex justify-between items-center">
                        <h2 className="xl:text-3xl text-xl font-medium ">
                            {dataLang?.category_material_list_title}
                        </h2>
                        <div className="flex space-x-3 items-center">
                            <Popup_NVL
                                dataMaterialExpiry={dataMaterialExpiry}
                                onRefresh={_ServerFetching.bind(this)}
                                dataLang={dataLang}
                                className="xl:text-sm text-xs xl:px-5 px-3 xl:py-2.5 py-1.5 bg-gradient-to-l from-[#0F4F9E] via-[#0F4F9E] via-[#296dc1] to-[#0F4F9E] text-white rounded btn-animation hover:scale-105 outline-none"
                            />
                        </div>
                    </div>

                    <div className="bg-slate-100 w-full rounded grid grid-cols-7 justify-between xl:p-3 p-2">
                        <div className="col-span-5 grid grid-cols-5 items-center gap-2">
                            <div className="col-span-1">
                                <form className="flex items-center relative">
                                    <IconSearch
                                        size={20}
                                        className="absolute 2xl:left-3 z-10  text-[#cccccc] xl:left-[4%] left-[1%]"
                                    />
                                    <input
                                        className=" relative bg-white  outline-[#D0D5DD] focus:outline-[#0F4F9E]  2xl:text-left 2xl:pl-10 xl:pl-0 p-0 2xl:py-1.5  py-2.5 rounded 2xl:text-base text-xs xl:text-center text-center 2xl:w-full xl:w-full w-[100%]"
                                        type="text"
                                        onChange={_HandleOnChangeKeySearch.bind(
                                            this
                                        )}
                                        placeholder={dataLang?.branch_search}
                                    />
                                </form>
                            </div>
                            <div className="col-span-1">
                                {/* <h6 className='text-gray-400 xl:text-[14px] text-[12px]'>{dataLang?.client_list_brand || "client_list_brand"}</h6> */}
                                <Select
                                    // options={options}
                                    options={[
                                        {
                                            value: "",
                                            label: "Chọn chi nhánh",
                                            isDisabled: true,
                                        },
                                        ...options,
                                    ]}
                                    onChange={_HandleFilterOpt.bind(
                                        this,
                                        "branch"
                                    )}
                                    value={idBranch}
                                    isClearable={true}
                                    isMulti
                                    closeMenuOnSelect={false}
                                    hideSelectedOptions={false}
                                    placeholder={
                                        dataLang?.client_list_brand ||
                                        "client_list_brand"
                                    }
                                    className="rounded-md bg-white  2xl:text-base xl:text-xs text-[10px]  z-20"
                                    isSearchable={true}
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
                                                boxShadow:
                                                    "0 0 0 1.5px #0F4F9E",
                                            }),
                                        }),
                                    }}
                                />
                            </div>
                            <div className="col-span-1">
                                {/* <h6 className='text-gray-400 xl:text-[14px] text-[12px]'>{dataLang?.category_material_group_name || "category_material_group_name"}</h6> */}
                                <Select
                                    // options={dataCateOption}
                                    options={[
                                        {
                                            value: "",
                                            label: "Chọn tên danh mục",
                                            isDisabled: true,
                                        },
                                        ...dataCateOption,
                                    ]}
                                    formatOptionLabel={
                                        CustomSelectOption_GroupNVL
                                    }
                                    onChange={_HandleFilterOpt.bind(
                                        this,
                                        "category"
                                    )}
                                    value={idCategory}
                                    isClearable={true}
                                    placeholder={
                                        dataLang?.category_material_group_name ||
                                        "category_material_group_name"
                                    }
                                    className="rounded-md bg-white  2xl:text-base xl:text-xs text-[10px]  z-20"
                                    isSearchable={true}
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
                                                boxShadow:
                                                    "0 0 0 1.5px #0F4F9E",
                                            }),
                                        }),
                                    }}
                                />
                            </div>
                        </div>
                        <div className="col-span-2 ">
                            <div className="flex space-x-2 items-center justify-end">
                                <button
                                    onClick={_HandleFresh.bind(this)}
                                    type="button"
                                    className="bg-green-50 hover:bg-green-200 hover:scale-105 group p-2 rounded-md transition-all ease-in-out"
                                >
                                    <Refresh2
                                        className="group-hover:-rotate-45 transition-all ease-in-out"
                                        size="22"
                                        color="green"
                                    />
                                </button>
                                {data.length != 0 && (
                                    <div className="flex space-x-6">
                                        <ExcelFile
                                            filename="danh sách nvl"
                                            element={
                                                <button className="xl:px-4 px-3 xl:py-2.5 py-1.5 xl:text-sm text-xs flex items-center space-x-2 bg-[#C7DFFB] rounded hover:scale-105 transition">
                                                    <IconExcel size={18} />
                                                    <span>
                                                        {
                                                            dataLang?.client_list_exportexcel
                                                        }
                                                    </span>
                                                </button>
                                            }
                                        >
                                            <ExcelSheet
                                                dataSet={multiDataSet}
                                                data={multiDataSet}
                                                name="Danh sách Nguyên Vật Liệu"
                                            />
                                        </ExcelFile>
                                        <div className="flex space-x-2 items-center">
                                            <label className="font-[300] text-slate-400">
                                                {dataLang?.display} :
                                            </label>
                                            <select
                                                className="outline-none"
                                                onChange={(e) =>
                                                    sLimit(e.target.value)
                                                }
                                                value={limit}
                                            >
                                                <option
                                                    disabled
                                                    className="hidden"
                                                >
                                                    {limit == -1
                                                        ? "Tất cả"
                                                        : limit}
                                                </option>
                                                <option value={15}>15</option>
                                                <option value={20}>20</option>
                                                <option value={40}>40</option>
                                                <option value={60}>60</option>
                                                <option value={-1}>
                                                    Tất cả
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="min:h-[500px] 2xl:h-[90%] xl:h-[69%] h-[72%] max:h-[800px] overflow-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                        <div className="pr-2">
                            <div className="flex items-center sticky top-0 rounded-xl shadow-sm bg-white divide-x p-2 z-10 ">
                                <h4 className="xl:w-[10%] w-[6%] 2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600  uppercase text-center font-medium">
                                    {dataLang?.image || "image"}
                                </h4>
                                <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600  uppercase xl:w-[11%] w-[12%] font-medium text-center">
                                    {dataLang?.category_material_group_name ||
                                        "category_material_group_name"}
                                </h4>
                                <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600  uppercase xl:w-[13%] w-[14%] truncate font-medium  text-center">
                                    {dataLang?.category_material_list_code ||
                                        "category_material_list_code"}
                                </h4>
                                <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600  uppercase xl:w-[13%] w-[14%] truncate font-medium  text-center">
                                    {dataLang?.category_material_list_name ||
                                        "category_material_list_name"}
                                </h4>
                                <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600  uppercase w-[7%] font-medium text-center">
                                    {dataLang?.unit || "unit"}
                                </h4>
                                <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600  uppercase xl:w-[6%] w-[8%] font-medium text-center">
                                    {dataLang?.stock || "stock"}
                                </h4>
                                <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600  uppercase w-[11%] font-medium  text-center">
                                    {dataLang?.note || "note"}
                                </h4>
                                <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600  uppercase xl:w-[6%] w-[7%] font-medium text-center truncate">
                                    {dataLang?.category_material_list_variant ||
                                        "category_material_list_variant"}
                                </h4>
                                <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600  uppercase w-[15%] font-medium truncate  text-center">
                                    {dataLang?.client_list_brand ||
                                        "client_list_brand"}
                                </h4>
                                <h4 className="2xl:text-[14px] xl:text-[10px] text-[8px] px-2 text-gray-600  uppercase xl:w-[8%] w-[6%] font-medium text-center truncate">
                                    {dataLang?.branch_popup_properties ||
                                        "branch_popup_properties"}
                                </h4>
                            </div>
                            {onFetching ? (
                                <Loading className="h-80" color="#0f4f9e" />
                            ) : (
                                <React.Fragment>
                                    {data.length == 0 && (
                                        <div className=" max-w-[352px] mt-24 mx-auto">
                                            <div className="text-center">
                                                <div className="bg-[#EBF4FF] rounded-[100%] inline-block ">
                                                    <IconSearch />
                                                </div>
                                                <h1 className="textx-[#141522] text-base opacity-90 font-medium">
                                                    {dataLang?.no_data_found ||
                                                        "no_data_found"}
                                                </h1>
                                            </div>
                                        </div>
                                    )}
                                    <div className="divide-y divide-slate-200">
                                        {data.map((e) => (
                                            <div
                                                key={e?.id.toString()}
                                                className="flex items-center p-2 hover:bg-slate-50 relative"
                                            >
                                                <div className="xl:w-[10%] w-[6%] pointer-events-none select-none justify-center flex">
                                                    {e?.images == null ? (
                                                        <img
                                                            src="/no_image.png"
                                                            className="w-full h-12 rounded object-contain"
                                                        />
                                                    ) : (
                                                        <Image
                                                            width={64}
                                                            height={64}
                                                            quality={100}
                                                            src={e?.images}
                                                            alt="thumb type"
                                                            className="w-12 h-12 rounded object-contain"
                                                            loading="lazy"
                                                            crossOrigin="anonymous"
                                                            blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                                        />
                                                    )}
                                                </div>
                                                <h6 className="px-2 py-2.5 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 xl:w-[11%] w-[12%]">
                                                    {e?.category_name}
                                                </h6>
                                                <div className="px-2 py-2.5 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 xl:w-[13%] w-[14%]">
                                                    <Popup_ThongTin
                                                        dataMaterialExpiry={
                                                            dataMaterialExpiry
                                                        }
                                                        id={e?.id}
                                                        dataLang={dataLang}
                                                    >
                                                        <button className=" text-[#0F4F9E] hover:opacity-70 w-fit outline-none">
                                                            {e?.code}
                                                        </button>
                                                    </Popup_ThongTin>
                                                </div>
                                                <h6 className="px-2 py-2.5 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 xl:w-[13%] w-[14%]">
                                                    {e?.name}
                                                </h6>
                                                <h6 className="px-2 py-2.5 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 w-[7%] text-center">
                                                    {e?.unit}
                                                </h6>
                                                <h6 className="px-2 py-2.5 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 xl:w-[6%] w-[8%] text-center">
                                                    {e?.stock_quantity}
                                                </h6>
                                                <h6 className="px-2 py-2.5 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 w-[11%]">
                                                    {e?.note}
                                                </h6>
                                                <h6 className="px-2 py-2.5 3xl:text-base 2xl:text-[12.5px] xl:text-[11px] font-medium text-[9px] text-zinc-600 xl:w-[6%] w-[7%] text-center">
                                                    {e?.variation_count
                                                        ? e?.variation_count
                                                        : "0"}
                                                </h6>
                                                <div className="px-2 py-2.5 w-[15%] flex flex-wrap">
                                                    {e?.branch.map((e) => (
                                                        <h6
                                                            key={e?.id.toString()}
                                                            className="xl:text-[15px] text-xs mr-1 mb-1 xl:py-[1px] xl:px-1.5 px-0.5 text-[#0F4F9E] rounded border border-[#0F4F9E] h-fit font-[300]"
                                                        >
                                                            {e?.name}
                                                        </h6>
                                                    ))}
                                                </div>
                                                <div className="px-2 py-2.5 xl:w-[8%] w-[6%] flex space-x-2 justify-center">
                                                    <Popup_NVL
                                                        dataMaterialExpiry={
                                                            dataMaterialExpiry
                                                        }
                                                        onRefresh={_ServerFetching.bind(
                                                            this
                                                        )}
                                                        dataLang={dataLang}
                                                        id={e?.id}
                                                        className="xl:scale-100 scale-[0.8] outline-none"
                                                    />
                                                    <button
                                                        onClick={_HandleDelete.bind(
                                                            this,
                                                            e?.id
                                                        )}
                                                        className="xl:scale-100 scale-[0.8] outline-none"
                                                    >
                                                        <IconDelete color="red" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </React.Fragment>
                            )}
                        </div>
                    </div>
                </div>
                {data?.length != 0 && (
                    <div className="flex space-x-5 items-center">
                        <h6>
                            Hiển thị {totalItems?.iTotalDisplayRecords} trong số{" "}
                            {totalItems?.iTotalRecords} biến thể
                        </h6>
                        <Pagination
                            postsPerPage={limit}
                            totalPosts={Number(
                                totalItems?.iTotalDisplayRecords
                            )}
                            paginate={paginate}
                            currentPage={router.query?.page || 1}
                        />
                    </div>
                )}
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
    const maxToShow = 2;
    const overflow = getValue()
        .slice(maxToShow)
        .map((x) => x.label);

    return index < maxToShow ? (
        <components.MultiValue {...props} />
    ) : index === maxToShow ? (
        <MoreSelectedBadge items={overflow} />
    ) : null;
};

const Popup_NVL = React.memo((props) => {
    const dataOptUnit = useSelector((state) => state.unit_NVL);
    const dataOptBranch = useSelector((state) => state.branch);
    const dataOptVariant = useSelector((state) => state.variant_NVL);

    const scrollAreaRef = useRef(null);
    const handleMenuOpen = () => {
        const menuPortalTarget = scrollAreaRef.current;
        return { menuPortalTarget };
    };

    const [open, sOpen] = useState(false);
    const _ToggleModal = (e) => sOpen(e);

    const [tab, sTab] = useState(0);
    const _HandleSelectTab = (e) => sTab(e);

    const [onSending, sOnSending] = useState(false);
    ///Fetching Nhóm NVL dựa vào chi nhánh
    const [onFetchingGroup, sOnFetchingGroup] = useState(false);
    ///Fetching lấy dữ liệu khi truyền id vào
    const [onFetching, sOnFetching] = useState(false);

    const [branch, sBranch] = useState([]);
    const branch_id = branch.map((e) => e.value);

    const [dataOptGr, sDataOptGr] = useState([]);
    const [groupId, sGroupId] = useState();
    const [code, sCode] = useState("");
    const [name, sName] = useState("");
    const [minimumAmount, sMinimumAmount] = useState();
    const [price, sPrice] = useState();
    const [expiry, sExpiry] = useState();

    const [unit, sUnit] = useState();
    const [unitChild, sUnitChild] = useState();
    const [unitAmount, sUnitAmount] = useState();
    const [note, sNote] = useState("");

    const [thumb, sThumb] = useState(null);
    const [thumbFile, sThumbFile] = useState(null);
    const [isDeleteThumb, sIsDeleteThumb] = useState(false);

    ///Biến thể
    const [variantMain, sVariantMain] = useState(null);
    const [prevVariantMain, sPrevVariantMain] = useState(null);
    const [variantSub, sVariantSub] = useState(null);
    const [prevVariantSub, sPrevVariantSub] = useState(null);
    const [optVariantMain, sOptVariantMain] = useState([]);
    const [optVariantSub, sOptVariantSub] = useState([]);
    const [optSelectedVariantMain, sOptSelectedVariantMain] = useState([]);
    const [optSelectedVariantSub, sOptSelectedVariantSub] = useState([]);

    const [dataTotalVariant, sDataTotalVariant] = useState([]);
    const [dataVariantSending, sDataVariantSending] = useState([]);
    console.log("variantMain", variantMain);
    useEffect(() => {
        sOptVariantMain(
            dataOptVariant?.find((e) => e.value == variantMain)?.option
        );
        // variantMain && optSelectedVariantMain?.length === 0 && sOptSelectedVariantMain([])
        prevVariantMain === undefined && sOptSelectedVariantMain([]);
        !variantMain && sOptSelectedVariantMain([]);
        if (
            variantMain === variantSub &&
            variantSub != null &&
            variantMain != null
        ) {
            sVariantSub(null);
            Toast.fire({
                icon: "error",
                title: `Biến thể bị trùng`,
            });
        }
    }, [variantMain]);

    useEffect(() => {
        sOptVariantSub(
            dataOptVariant?.find((e) => e.value == variantSub)?.option
        );
        // variantSub && optSelectedVariantSub?.length === 0 && sOptSelectedVariantSub([])
        prevVariantSub === undefined && sOptSelectedVariantSub([]);
        !variantSub && sOptSelectedVariantSub([]);
        if (
            variantSub === variantMain &&
            variantSub != null &&
            variantMain != null
        ) {
            sVariantSub(null);
            Toast.fire({
                icon: "error",
                title: `Biến thể bị trùng`,
            });
        }
    }, [variantSub]);

    const checkEqual = (prevValue, nextValue) =>
        prevValue && nextValue && prevValue === nextValue;

    const _HandleSelectedVariant = (type, event) => {
        if (type == "main") {
            const name = event?.target.value;
            const id = event?.target.id;
            if (event?.target.checked) {
                // Thêm giá trị và id vào mảng khi input được chọn
                const updatedOptions = [
                    ...optSelectedVariantMain,
                    { name, id },
                ];
                sOptSelectedVariantMain(updatedOptions);
            } else {
                // Xóa giá trị và id khỏi mảng khi input được bỏ chọn
                const updatedOptions = optSelectedVariantMain.filter(
                    (option) => option.id !== id
                );
                sOptSelectedVariantMain(updatedOptions);
            }
        } else if (type == "sub") {
            const name = event?.target.value;
            const id = event?.target.id;
            if (event?.target.checked) {
                const updatedOptions = [...optSelectedVariantSub, { name, id }];
                sOptSelectedVariantSub(updatedOptions);
            } else {
                const updatedOptions = optSelectedVariantSub.filter(
                    (option) => option.id !== id
                );
                sOptSelectedVariantSub(updatedOptions);
            }
        }
    };

    const _HandleSelectedAllVariant = (type) => {
        if (type == "main") {
            const uncheckedOptions = optVariantMain.filter(
                (option) =>
                    !optSelectedVariantMain.some(
                        (selectedOpt) => selectedOpt.id === option.id
                    )
            );
            // Thêm tất cả các option chưa được chọn vào mảng optSelectedVariantMain
            const updatedOptions = [
                ...optSelectedVariantMain,
                ...uncheckedOptions,
            ];
            sOptSelectedVariantMain(updatedOptions);
            // Lấy tất cả các option chưa được chọn
        } else if (type == "sub") {
            const uncheckedOptions = optVariantSub.filter(
                (option) =>
                    !optSelectedVariantSub.some(
                        (selectedOpt) => selectedOpt.id === option.id
                    )
            );
            const updatedOptions = [
                ...optSelectedVariantSub,
                ...uncheckedOptions,
            ];
            sOptSelectedVariantSub(updatedOptions);
        }
    };

    const _HandleApplyVariant = () => {
        if (optSelectedVariantMain?.length > 0) {
            sDataTotalVariant([
                ...(optSelectedVariantMain?.length > 0
                    ? optSelectedVariantMain?.map((item1) => ({
                          ...item1,
                          image: null,
                          sku: "",
                          variation_option_2: optSelectedVariantSub?.map(
                              (item2) => ({
                                  ...item2,
                                  sku: "",
                              })
                          ),
                      }))
                    : optSelectedVariantSub?.map((item2) => ({ ...item2 }))),
            ]);
            sDataVariantSending([
                {
                    name: dataOptVariant.find((e) => e.value == variantMain)
                        ?.label,
                    option: optSelectedVariantMain.map((e) => ({ id: e.id })),
                },
                {
                    name: dataOptVariant.find((e) => e.value == variantSub)
                        ?.label,
                    option: optSelectedVariantSub.map((e) => ({ id: e.id })),
                },
            ]);
        } else {
            Toast.fire({
                icon: "error",
                title: `Phải chọn tùy chọn của biến thể chính`,
            });
        }
    };

    const [errGroup, sErrGroup] = useState(false);
    const [errName, sErrName] = useState(false);
    const [errCode, sErrCode] = useState(false);
    const [errUnit, sErrUnit] = useState(false);
    const [errBranch, sErrBranch] = useState(false);

    useEffect(() => {
        open && sTab(0);
        open && sGroupId();
        open && sCode("");
        open && sName("");
        open && sMinimumAmount();
        open && sPrice();
        open && sExpiry();
        open && sUnit();
        open && sUnitChild();
        open && sUnitAmount();
        open && sNote("");
        open && sThumb(null);
        open && sThumbFile(null);
        open && sBranch([]);
        open && props?.id && sOnFetching(true);
        open && sDataTotalVariant([]);
        open && sDataVariantSending([]);
        open && sVariantMain(null);
        open && sVariantSub(null);
        open && sPrevVariantMain(null);
        open && sPrevVariantSub(null);
        open && sErrGroup(false);
        open && sErrName(false);
        open && sErrCode(false);
        open && sErrUnit(false);
        open && sErrBranch(false);
    }, [open]);

    const _HandleChangeInput = (type, value) => {
        if (type == "name") {
            sName(value.target?.value);
        } else if (type == "code") {
            sCode(value.target?.value);
        } else if (type == "price") {
            sPrice(Number(value.value));
        } else if (type == "minimumAmount") {
            sMinimumAmount(Number(value.value));
        } else if (type == "expiry") {
            sExpiry(Number(value.value));
        } else if (type == "unitAmount") {
            sUnitAmount(Number(value.value));
        } else if (type == "note") {
            sNote(value.target?.value);
        } else if (type == "group") {
            sGroupId(value?.value);
        } else if (type == "unit") {
            sUnit(value?.value);
        } else if (type == "unitChild") {
            sUnitChild(value?.value);
        } else if (type == "branch") {
            sBranch(value);
        } else if (type == "variantMain") {
            if (!checkEqual(variantMain, value)) {
                sPrevVariantMain(variantMain?.value);
                sVariantMain(value?.value);
            }
        } else if (type == "variantSub") {
            if (!checkEqual(variantSub, value)) {
                sPrevVariantSub(variantSub?.value);
                sVariantSub(value?.value);
            }
        }
    };

    const _HandleChangeFileThumb = ({ target: { files } }) => {
        var [file] = files;
        if (file) {
            sThumbFile(file);
            sThumb(URL.createObjectURL(file));
        }
        sIsDeleteThumb(false);
    };

    const _DeleteThumb = (e) => {
        e.preventDefault();
        sThumbFile(null);
        sThumb(null);
        document.getElementById("upload").value = null;
        sIsDeleteThumb(true);
    };

    useEffect(() => {
        sThumb(thumb);
    }, [thumb]);

    const _ServerSending = () => {
        var formData = new FormData();

        formData.append("code", code);
        formData.append("name", name);
        formData.append("import_price", price);
        formData.append("minimum_quantity", minimumAmount);
        formData.append("expiry", expiry);
        formData.append("note", note);
        formData.append("category_id", groupId);
        formData.append("unit_id", unit);
        formData.append("unit_convert_id", unitChild);
        formData.append("coefficient", unitAmount);
        formData.append("images", thumbFile);
        formData.append("is_delete_image ", isDeleteThumb);
        branch_id.forEach((id) => formData.append("branch_id[]", id));

        for (let i = 0; i < dataTotalVariant.length; i++) {
            var item = dataTotalVariant[i];

            formData.set(
                `variation_option_value[${i}][variation_option_1_id]`,
                item.id
            );
            formData.set(
                `variation_option_value[${i}][image]`,
                item.image || ""
            );

            if (item.variation_option_2?.length > 0) {
                for (let j = 0; j < item.variation_option_2?.length; j++) {
                    var subItem = item.variation_option_2[j];
                    formData.set(
                        `variation_option_value[${i}][variation_option_2][${j}][id]`,
                        subItem.id
                    );
                    formData.set(
                        `variation_option_value[${i}][variation_option_2][${j}][sku]`,
                        subItem.sku || ""
                    );
                }
            } else {
                formData.set(
                    `variation_option_value[${i}][sku]`,
                    item.sku || ""
                );
            }
        }

        for (let i = 0; i < dataVariantSending.length; i++) {
            for (let j = 0; j < dataVariantSending[i].option.length; j++) {
                formData.append(
                    `variation[${i}][option_id][${j}]`,
                    dataVariantSending[i].option[j].id
                );
            }
        }

        Axios(
            "POST",
            `${
                props?.id
                    ? `/api_web/api_material/material/${props.id}?csrf_protection=true`
                    : "/api_web/api_material/material?csrf_protection=true"
            }`,
            {
                data: formData,
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
                        sOpen(false);
                        props.onRefresh && props.onRefresh();
                        sGroupId();
                        sCode("");
                        sName("");
                        sMinimumAmount();
                        sPrice();
                        sExpiry();
                        sUnit();
                        sUnitChild();
                        sUnitAmount();
                        sNote("");
                        sThumb(null);
                        sThumbFile(null);
                    } else {
                        Toast.fire({
                            icon: "error",
                            title: `${props.dataLang[message]}`,
                        });
                    }
                }
                sOnSending(false);
            }
        );
    };

    useEffect(() => {
        onSending && _ServerSending();
    }, [onSending]);

    const _HandleSubmit = (e) => {
        e.preventDefault();
        if (
            name?.length == 0 ||
            (props.id && code?.length == 0) ||
            groupId == null ||
            unit == null ||
            branch.length == 0
        ) {
            name?.length == 0 && sErrName(true);
            props.id && code?.length == 0 && sErrCode(true);
            groupId == null && sErrGroup(true);
            unit == null && sErrUnit(true);
            branch.length == 0 && sErrBranch(true);
            Toast.fire({
                icon: "error",
                title: `${props.dataLang?.required_field_null}`,
            });
        } else {
            sOnSending(true);
        }
    };

    useEffect(() => {
        sErrName(false);
    }, [name?.length > 0]);

    useEffect(() => {
        sErrCode(false);
    }, [code?.length > 0]);

    useEffect(() => {
        sErrGroup(false);
    }, [groupId != null]);

    useEffect(() => {
        sErrUnit(false);
    }, [unit != null]);

    useEffect(() => {
        sErrBranch(false);
    }, [branch.length > 0]);

    const _ServerFetchingGroup = () => {
        Axios(
            "GET",
            "/api_web/api_material/categoryOption?csrf_protection=true",
            {
                params: {
                    "branch_id[]": branch_id.length > 0 ? branch_id : -1,
                },
            },
            (err, response) => {
                if (!err) {
                    var { rResult } = response.data;
                    sDataOptGr(
                        rResult.map((e) => ({
                            label: e.name + " " + "(" + e.code + ")",
                            value: e.id,
                            level: e.level,
                        }))
                    );
                }
                sOnFetchingGroup(false);
            }
        );
    };

    useEffect(() => {
        onFetchingGroup && _ServerFetchingGroup();
    }, [onFetchingGroup]);

    useEffect(() => {
        setTimeout(() => {
            open && sOnFetchingGroup(true);
        }, 500);
    }, [branch]);

    const _ServerFetching = () => {
        Axios(
            "GET",
            `/api_web/api_material/material/${props?.id}?csrf_protection=true`,
            {},
            (err, response) => {
                if (!err) {
                    var data = response.data;
                    sName(data?.name);
                    sCode(data?.code);
                    sNote(data?.note);
                    sPrice(Number(data?.import_price));
                    sMinimumAmount(Number(data?.minimum_quantity));
                    sGroupId(data?.category_id);
                    sExpiry(Number(data?.expiry));
                    sUnitAmount(Number(data?.coefficient));
                    sThumb(data?.images);
                    sUnit(data?.unit_id);
                    sUnitChild(data?.unit_convert_id);
                    sBranch(
                        data?.branch.map((e) => ({
                            label: e.name,
                            value: e.id,
                        }))
                    );
                    sDataVariantSending(data?.variation);
                    sVariantMain(data?.variation[0]?.id);
                    sVariantSub(data?.variation[1]?.id);
                    sOptSelectedVariantMain(data?.variation[0]?.option);
                    sOptSelectedVariantSub(data?.variation[1]?.option);
                    sDataTotalVariant(data?.variation_option_value);
                }
                sOnFetching(false);
            }
        );
    };

    useEffect(() => {
        setTimeout(() => {
            onFetching && _ServerFetching();
        }, 1500);
    }, [onFetching]);

    const _HandleChangeVariant = (id, type, value) => {
        var index = dataTotalVariant?.findIndex((x) => x.id === id);
        if (type === "image") {
            dataTotalVariant[index].image = value.target?.files[0];
            sDataTotalVariant([...dataTotalVariant]);
        } else if (type === "sku") {
            dataTotalVariant[index].sku = value.target?.value;
            sDataTotalVariant([...dataTotalVariant]);
        }
    };

    // const _HandleChangeSku = (parentId, id, value) => {
    //     var parentIndex = dataTotalVariant?.findIndex(x => x.id === parentId);
    //     var index = dataTotalVariant[parentIndex].variation_option_2.findIndex(x => x.id === id)
    //     dataTotalVariant[parentIndex].variation_option_2[index].sku = value.target?.value;
    //     sDataTotalVariant([...dataTotalVariant])
    // }

    const _HandleDeleteVariant = (parentId, id) => {
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
                const newData = dataTotalVariant
                    .map((item) => {
                        if (item.id === parentId) {
                            item.variation_option_2 =
                                item.variation_option_2.filter(
                                    (opt) => opt.id !== id
                                );
                        }
                        return item;
                    })
                    .filter((item) => item.variation_option_2.length > 0);
                sDataTotalVariant(newData);

                const foundParent = newData.some(
                    (item) => item.id === parentId
                );
                if (foundParent === false) {
                    const newData2 = dataVariantSending.map((item) => {
                        return {
                            ...item,
                            option: item.option.filter(
                                (opt) => opt.id !== parentId
                            ),
                        };
                    });
                    if (newData2[0].option?.length === 0) {
                        sDataVariantSending(
                            newData2.map((item) => ({ name: item.name }))
                        );
                    } else {
                        sDataVariantSending(newData2);
                    }
                } else {
                    const found = dataTotalVariant.some((item) => {
                        return item.variation_option_2.some(
                            (opt) => opt.id === id
                        );
                    });
                    if (found === false) {
                        const newData2 = dataVariantSending.map((item) => {
                            return {
                                ...item,
                                option: item.option.filter(
                                    (opt) => opt.id !== id
                                ),
                            };
                        });
                        sDataVariantSending(newData2);
                    }
                }
            }
        });
    };

    const _HandleDeleteVariantItems = (id) => {
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
                sDataTotalVariant([
                    ...dataTotalVariant.filter((x) => x.id !== id),
                ]);
                const filteredOption = dataVariantSending[0].option.filter(
                    (opt) => opt.id !== id
                );
                const updatedData = [...dataVariantSending];
                updatedData[0] = {
                    ...dataVariantSending[0],
                    option: filteredOption,
                };
                sDataVariantSending(updatedData);
            }
        });
    };

    return (
        <PopupEdit
            title={
                props?.id
                    ? `${props.dataLang?.category_material_list_edit}`
                    : `${props.dataLang?.category_material_list_addnew}`
            }
            button={
                props?.id ? (
                    <IconEdit />
                ) : (
                    `${props.dataLang?.branch_popup_create_new}`
                )
            }
            onClickOpen={_ToggleModal.bind(this, true)}
            open={open}
            onClose={_ToggleModal.bind(this, false)}
            classNameBtn={props.className}
        >
            <div className="py-4 w-[800px] 2xl:space-y-5 space-y-4">
                <div className="flex items-center space-x-4 border-[#E7EAEE] border-opacity-70 border-b-[1px]">
                    <button
                        onClick={_HandleSelectTab.bind(this, 0)}
                        className={`${
                            tab === 0
                                ? "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]"
                                : "hover:text-[#0F4F9E] "
                        } 2xl:text-base text-[15px] px-4 2xl:py-2 py-1 outline-none font-medium`}
                    >
                        {props.dataLang?.information || "information"}
                    </button>
                    <button
                        onClick={_HandleSelectTab.bind(this, 1)}
                        className={`${
                            tab === 1
                                ? "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]"
                                : "hover:text-[#0F4F9E] "
                        } 2xl:text-base text-[15px] px-4 2xl:py-2 py-1 outline-none font-medium`}
                    >
                        {props.dataLang?.category_material_list_variant ||
                            "category_material_list_variant"}
                    </button>
                </div>
                <ScrollArea
                    className="max-h-[600px]"
                    speed={1}
                    smoothScrolling={true}
                    ref={scrollAreaRef}
                >
                    {onFetching ? (
                        <Loading className="h-80" color="#0f4f9e" />
                    ) : (
                        <React.Fragment>
                            {tab === 0 && (
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="2xl:space-y-3 space-y-2">
                                        <div className="2xl:space-y-1">
                                            <label className="text-[#344054] font-normal 2xl:text-base text-[15px]">
                                                {props.dataLang
                                                    ?.client_list_brand ||
                                                    "client_list_brand"}{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <Select
                                                options={dataOptBranch}
                                                formatOptionLabel={
                                                    CustomSelectOption_GroupNVL
                                                }
                                                value={branch}
                                                onChange={_HandleChangeInput.bind(
                                                    this,
                                                    "branch"
                                                )}
                                                isClearable={true}
                                                placeholder={
                                                    props.dataLang
                                                        ?.client_list_brand ||
                                                    "client_list_brand"
                                                }
                                                isMulti
                                                noOptionsMessage={() =>
                                                    `${props.dataLang?.no_data_found}`
                                                }
                                                closeMenuOnSelect={false}
                                                menuPortalTarget={document.body}
                                                onMenuOpen={handleMenuOpen}
                                                className={`${
                                                    errBranch
                                                        ? "border-red-500"
                                                        : "border-transparent"
                                                } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
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
                                                    menuPortal: (base) => ({
                                                        ...base,
                                                        zIndex: 9999,
                                                        position: "absolute",
                                                    }),
                                                }}
                                            />
                                            {errBranch && (
                                                <label className="text-sm text-red-500">
                                                    {props.dataLang
                                                        ?.client_list_bran ||
                                                        "client_list_bran"}
                                                </label>
                                            )}
                                        </div>
                                        <div className="2xl:space-y-1">
                                            <label className="text-[#344054] font-normal 2xl:text-base text-[15px]">
                                                {
                                                    props.dataLang
                                                        ?.header_category_material_group
                                                }{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <Select
                                                options={dataOptGr}
                                                formatOptionLabel={
                                                    CustomSelectOption_GroupNVL
                                                }
                                                value={
                                                    groupId
                                                        ? {
                                                              label: dataOptGr?.find(
                                                                  (x) =>
                                                                      x?.value ==
                                                                      groupId
                                                              )?.label,
                                                              value: groupId,
                                                          }
                                                        : null
                                                }
                                                onChange={_HandleChangeInput.bind(
                                                    this,
                                                    "group"
                                                )}
                                                isClearable={true}
                                                noOptionsMessage={() =>
                                                    `${props.dataLang?.no_data_found}`
                                                }
                                                placeholder={
                                                    props.dataLang
                                                        ?.header_category_material_group
                                                }
                                                menuPortalTarget={document.body}
                                                onMenuOpen={handleMenuOpen}
                                                className={`${
                                                    errGroup
                                                        ? "border-red-500"
                                                        : "border-transparent"
                                                } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
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
                                                    menuPortal: (base) => ({
                                                        ...base,
                                                        zIndex: 9999,
                                                        position: "absolute",
                                                    }),
                                                }}
                                            />
                                            {errGroup && (
                                                <label className="text-sm text-red-500">
                                                    {props.dataLang
                                                        ?.category_material_list_err_group ||
                                                        "category_material_list_err_group"}
                                                </label>
                                            )}
                                        </div>
                                        <div className="2xl:space-y-1">
                                            <label className="text-[#344054] font-normal 2xl:text-base text-[15px]">
                                                {props.dataLang
                                                    ?.category_material_list_code ||
                                                    "category_material_list_code"}{" "}
                                                {props.id && (
                                                    <span className="text-red-500">
                                                        *
                                                    </span>
                                                )}
                                            </label>
                                            <input
                                                value={code}
                                                onChange={_HandleChangeInput.bind(
                                                    this,
                                                    "code"
                                                )}
                                                type="text"
                                                placeholder={
                                                    props.dataLang
                                                        ?.client_popup_sytem
                                                }
                                                className={`${
                                                    errCode
                                                        ? "border-red-500"
                                                        : "focus:border-[#92BFF7] border-[#d0d5dd] "
                                                } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none`}
                                            />
                                            {errCode && (
                                                <label className="text-sm text-red-500">
                                                    {
                                                        props.dataLang
                                                            ?.category_material_list_err_code
                                                    }
                                                </label>
                                            )}
                                        </div>
                                        <div className="2xl:space-y-1">
                                            <label className="text-[#344054] font-normal 2xl:text-base text-[15px]">
                                                {props.dataLang
                                                    ?.category_material_list_name ||
                                                    "category_material_list_name"}{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                value={name}
                                                onChange={_HandleChangeInput.bind(
                                                    this,
                                                    "name"
                                                )}
                                                type="text"
                                                placeholder={
                                                    props.dataLang
                                                        ?.category_material_list_name ||
                                                    "category_material_list_name"
                                                }
                                                className={`${
                                                    errName
                                                        ? "border-red-500"
                                                        : "focus:border-[#92BFF7] border-[#d0d5dd] "
                                                } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none`}
                                            />
                                            {errName && (
                                                <label className="text-sm text-red-500">
                                                    {
                                                        props.dataLang
                                                            ?.category_material_list_err_name
                                                    }
                                                </label>
                                            )}
                                        </div>
                                        <div className="2xl:space-y-1">
                                            <label className="text-[#344054] font-normal 2xl:text-base text-[15px]">
                                                {props.dataLang
                                                    ?.category_material_list_cost_price ||
                                                    "category_material_list_cost_price"}
                                            </label>
                                            <NumericFormat
                                                thousandSeparator=","
                                                value={price}
                                                onValueChange={_HandleChangeInput.bind(
                                                    this,
                                                    "price"
                                                )}
                                                placeholder={
                                                    props.dataLang
                                                        ?.category_material_list_cost_price ||
                                                    "category_material_list_cost_price"
                                                }
                                                className={`focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal p-2 border outline-none`}
                                            />
                                        </div>
                                        <div className="2xl:space-y-1">
                                            <label className="text-[#344054] font-normal 2xl:text-base text-[15px]">
                                                {props.dataLang
                                                    ?.minimum_amount ||
                                                    "minimum_amount"}
                                            </label>
                                            <NumericFormat
                                                thousandSeparator=","
                                                value={minimumAmount}
                                                onValueChange={_HandleChangeInput.bind(
                                                    this,
                                                    "minimumAmount"
                                                )}
                                                placeholder={
                                                    props.dataLang
                                                        ?.minimum_amount ||
                                                    "minimum_amount"
                                                }
                                                className={`focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal p-2 border outline-none`}
                                            />
                                        </div>
                                        {props.dataMaterialExpiry?.is_enable ===
                                        "1" ? (
                                            <div className="2xl:space-y-1">
                                                <label className="text-[#344054] font-normal 2xl:text-base text-[15px]">
                                                    {props.dataLang
                                                        ?.category_material_list_expiry_date ||
                                                        "category_material_list_expiry_date"}
                                                </label>
                                                <div className="relative flex flex-col justify-center items-center">
                                                    <NumericFormat
                                                        thousandSeparator=","
                                                        value={expiry}
                                                        onValueChange={_HandleChangeInput.bind(
                                                            this,
                                                            "expiry"
                                                        )}
                                                        placeholder={
                                                            props.dataLang
                                                                ?.category_material_list_expiry_date ||
                                                            "category_material_list_expiry_date"
                                                        }
                                                        className={`focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal p-2 pr-14 border outline-none`}
                                                    />
                                                    <span className="absolute right-2 text-slate-400 select-none">
                                                        {props.dataLang?.date ||
                                                            "date"}
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                    <div className="2xl:space-y-3 space-y-2">
                                        <div className="2xl:space-y-1">
                                            <label className="text-[#344054] font-normal 2xl:text-base text-[15px]">
                                                {props.dataLang
                                                    ?.category_material_list_purchase_unit ||
                                                    "category_material_list_purchase_unit"}{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <Select
                                                options={dataOptUnit}
                                                value={
                                                    unit
                                                        ? {
                                                              label: dataOptUnit?.find(
                                                                  (x) =>
                                                                      x?.value ==
                                                                      unit
                                                              )?.label,
                                                              value: unit,
                                                          }
                                                        : null
                                                }
                                                onChange={_HandleChangeInput.bind(
                                                    this,
                                                    "unit"
                                                )}
                                                isClearable={true}
                                                placeholder={
                                                    props.dataLang
                                                        ?.category_material_list_purchase_unit ||
                                                    "category_material_list_purchase_unit"
                                                }
                                                noOptionsMessage={() =>
                                                    `${props.dataLang?.no_data_found}`
                                                }
                                                menuPortalTarget={document.body}
                                                onMenuOpen={handleMenuOpen}
                                                className={`${
                                                    errUnit
                                                        ? "border-red-500"
                                                        : "border-transparent"
                                                } placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border`}
                                                isSearchable={true}
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
                                                    menuPortal: (base) => ({
                                                        ...base,
                                                        zIndex: 9999,
                                                        position: "absolute",
                                                    }),
                                                }}
                                            />
                                            {errUnit && (
                                                <label className="text-sm text-red-500">
                                                    {
                                                        props.dataLang
                                                            ?.category_material_list_err_unit
                                                    }
                                                </label>
                                            )}
                                        </div>
                                        <div className="2xl:space-y-0.5">
                                            <h5 className="text-[#344054] font-medium 2xl:text-base text-[15px]">
                                                {props.dataLang
                                                    ?.category_material_list_converting_unit ||
                                                    "category_material_list_converting_unit"}
                                            </h5>
                                            <div className="grid grid-cols-2 gap-5">
                                                <div className="2xl:space-y-1">
                                                    <label className="text-[#344054] font-normal text-sm">
                                                        {props.dataLang?.unit ||
                                                            "unit"}
                                                    </label>
                                                    <Select
                                                        options={dataOptUnit}
                                                        value={
                                                            unitChild
                                                                ? {
                                                                      label: dataOptUnit?.find(
                                                                          (x) =>
                                                                              x?.value ==
                                                                              unitChild
                                                                      )?.label,
                                                                      value: unitChild,
                                                                  }
                                                                : null
                                                        }
                                                        onChange={_HandleChangeInput.bind(
                                                            this,
                                                            "unitChild"
                                                        )}
                                                        isClearable={true}
                                                        placeholder={
                                                            props.dataLang
                                                                ?.unit || "unit"
                                                        }
                                                        noOptionsMessage={() =>
                                                            `${props.dataLang?.no_data_found}`
                                                        }
                                                        menuPortalTarget={
                                                            document.body
                                                        }
                                                        onMenuOpen={
                                                            handleMenuOpen
                                                        }
                                                        className="w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none"
                                                        isSearchable={true}
                                                        theme={(theme) => ({
                                                            ...theme,
                                                            colors: {
                                                                ...theme.colors,
                                                                primary25:
                                                                    "#EBF5FF",
                                                                primary50:
                                                                    "#92BFF7",
                                                                primary:
                                                                    "#0F4F9E",
                                                            },
                                                        })}
                                                        styles={{
                                                            placeholder: (
                                                                base
                                                            ) => ({
                                                                ...base,
                                                                color: "#cbd5e1",
                                                            }),
                                                            menuPortal: (
                                                                base
                                                            ) => ({
                                                                ...base,
                                                                zIndex: 9999,
                                                                position:
                                                                    "absolute",
                                                            }),
                                                        }}
                                                    />
                                                </div>
                                                <div className="2xl:space-y-1">
                                                    <label className="text-[#344054] font-normal text-sm">
                                                        {props.dataLang
                                                            ?.category_material_list_converting_amount ||
                                                            "category_material_list_converting_amount"}
                                                    </label>
                                                    <NumericFormat
                                                        thousandSeparator=","
                                                        value={unitAmount}
                                                        onValueChange={_HandleChangeInput.bind(
                                                            this,
                                                            "unitAmount"
                                                        )}
                                                        placeholder={
                                                            props.dataLang
                                                                ?.amount ||
                                                            "amount"
                                                        }
                                                        className={`focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal px-2 py-1.5 border outline-none`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="2xl:space-y-1">
                                            <label className="text-[#344054] font-normal 2xl:text-base text-[15px]">
                                                {props.dataLang?.avatar ||
                                                    "avatar"}
                                            </label>
                                            <div className="flex justify-center">
                                                <div className="relative h-36 w-36 rounded bg-slate-200">
                                                    {thumb && (
                                                        <Image
                                                            width={120}
                                                            height={120}
                                                            quality={100}
                                                            src={
                                                                typeof thumb ===
                                                                "string"
                                                                    ? thumb
                                                                    : URL.createObjectURL(
                                                                          thumb
                                                                      )
                                                            }
                                                            alt="thumb type"
                                                            className="w-36 h-36 rounded object-contain"
                                                            loading="lazy"
                                                            crossOrigin="anonymous"
                                                            blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                                        />
                                                    )}
                                                    {!thumb && (
                                                        <div className="h-full w-full flex flex-col justify-center items-center">
                                                            <IconImage />
                                                        </div>
                                                    )}
                                                    <div className="absolute bottom-0 -right-12 flex flex-col space-y-2">
                                                        <input
                                                            onChange={_HandleChangeFileThumb.bind(
                                                                this
                                                            )}
                                                            type="file"
                                                            id={`upload`}
                                                            accept="image/png, image/jpeg"
                                                            hidden
                                                        />
                                                        <label
                                                            htmlFor={`upload`}
                                                            title="Sửa hình"
                                                            className="cursor-pointer w-8 h-8 rounded-full bg-slate-100 flex flex-col justify-center items-center"
                                                        >
                                                            <IconEditImg size="17" />
                                                        </label>
                                                        <button
                                                            disabled={
                                                                !thumb
                                                                    ? true
                                                                    : false
                                                            }
                                                            onClick={_DeleteThumb.bind(
                                                                this
                                                            )}
                                                            title="Xóa hình"
                                                            className="w-8 h-8 rounded-full bg-red-500 disabled:opacity-30 flex flex-col justify-center items-center text-white"
                                                        >
                                                            <IconDelete size="17" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="2xl:space-y-1">
                                            <label className="text-[#344054] font-normal 2xl:text-base text-[15px]">
                                                {props.dataLang?.note || "note"}
                                            </label>
                                            <textarea
                                                value={note}
                                                type="text"
                                                placeholder={
                                                    props.dataLang?.note ||
                                                    "note"
                                                }
                                                rows={5}
                                                onChange={_HandleChangeInput.bind(
                                                    this,
                                                    "note"
                                                )}
                                                className="focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal  p-2 border outline-none resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                            {tab === 1 && (
                                <div className="">
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="space-y-3">
                                            <div className="space-y-1">
                                                <label>
                                                    {props.dataLang
                                                        ?.category_material_list_variant_main ||
                                                        "category_material_list_variant_main"}
                                                </label>
                                                <Select
                                                    options={dataOptVariant}
                                                    value={
                                                        variantMain
                                                            ? {
                                                                  label: dataOptVariant.find(
                                                                      (e) =>
                                                                          e.value ==
                                                                          variantMain
                                                                  )?.label,
                                                                  value: variantMain,
                                                              }
                                                            : null
                                                    }
                                                    onChange={_HandleChangeInput.bind(
                                                        this,
                                                        "variantMain"
                                                    )}
                                                    isClearable={true}
                                                    placeholder={
                                                        props.dataLang
                                                            ?.category_material_list_variant_main ||
                                                        "category_material_list_variant_main"
                                                    }
                                                    noOptionsMessage={() =>
                                                        `${props.dataLang?.no_data_found}`
                                                    }
                                                    menuPortalTarget={
                                                        document.body
                                                    }
                                                    onMenuOpen={handleMenuOpen}
                                                    className={` placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
                                                    theme={(theme) => ({
                                                        ...theme,
                                                        colors: {
                                                            ...theme.colors,
                                                            primary25:
                                                                "#EBF5FF",
                                                            primary50:
                                                                "#92BFF7",
                                                            primary: "#0F4F9E",
                                                        },
                                                    })}
                                                    styles={{
                                                        placeholder: (
                                                            base
                                                        ) => ({
                                                            ...base,
                                                            color: "#cbd5e1",
                                                        }),
                                                        menuPortal: (base) => ({
                                                            ...base,
                                                            zIndex: 9999,
                                                            position:
                                                                "absolute",
                                                        }),
                                                    }}
                                                />
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <h5 className="text-slate-400 text-sm">
                                                    {props.dataLang
                                                        ?.branch_popup_variant_option ||
                                                        "branch_popup_variant_option"}
                                                </h5>
                                                {optVariantMain && (
                                                    <button
                                                        onClick={_HandleSelectedAllVariant.bind(
                                                            this,
                                                            "main"
                                                        )}
                                                        className="text-sm font-medium"
                                                    >
                                                        Chọn tất cả
                                                    </button>
                                                )}
                                            </div>
                                            {!optVariantMain && (
                                                <div className="space-y-0.5">
                                                    <div className="w-full h-9 bg-slate-100 animate-[pulse_1s_ease-in-out_infinite] rounded" />
                                                    <div className="w-full h-9 bg-slate-100 animate-[pulse_1.1s_ease-in-out_infinite] rounded" />
                                                    <div className="w-full h-9 bg-slate-100 animate-[pulse_1.2s_ease-in-out_infinite] rounded" />
                                                </div>
                                            )}
                                            <ScrollArea
                                                className="max-h-[115px] w-full "
                                                speed={1}
                                                smoothScrolling={true}
                                            >
                                                <div className="flex flex-col">
                                                    {optVariantMain?.map(
                                                        (e) => (
                                                            // <label key={e?.id.toString()} htmlFor={e.id} className='w-full space-x-2 py-1.5 px-3 bg-slate-50 hover:bg-slate-100 rounded cursor-pointer'>
                                                            //     <input type="checkbox" id={e.id} value={e.name} checked={optSelectedVariantMain.some((selectedOpt) => selectedOpt.id === e.id)} onChange={_HandleSelectedVariant.bind(this, "main")} className="accent-lime-500" />
                                                            //     <span>{e.name}</span>
                                                            // </label>
                                                            <div
                                                                key={e?.id.toString()}
                                                                className="flex items-center "
                                                            >
                                                                <label
                                                                    className="relative flex cursor-pointer items-center rounded-full p-2"
                                                                    htmlFor={
                                                                        e.id
                                                                    }
                                                                    data-ripple-dark="true"
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-indigo-500 checked:bg-indigo-500 checked:before:bg-indigo-500 hover:before:opacity-10"
                                                                        id={
                                                                            e.id
                                                                        }
                                                                        value={
                                                                            e.name
                                                                        }
                                                                        checked={optSelectedVariantMain.some(
                                                                            (
                                                                                selectedOpt
                                                                            ) =>
                                                                                selectedOpt.id ===
                                                                                e.id
                                                                        )}
                                                                        onChange={_HandleSelectedVariant.bind(
                                                                            this,
                                                                            "main"
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
                                                                    htmlFor={
                                                                        e.id
                                                                    }
                                                                    className="text-[#344054] font-normal text-sm "
                                                                >
                                                                    {e.name}
                                                                </label>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </ScrollArea>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="space-y-1">
                                                <label>
                                                    {props.dataLang
                                                        ?.category_material_list_variant_sub ||
                                                        "category_material_list_variant_sub"}
                                                </label>
                                                <Select
                                                    options={dataOptVariant}
                                                    value={
                                                        variantSub
                                                            ? {
                                                                  label: dataOptVariant.find(
                                                                      (e) =>
                                                                          e.value ==
                                                                          variantSub
                                                                  )?.label,
                                                                  value: variantSub,
                                                              }
                                                            : null
                                                    }
                                                    onChange={_HandleChangeInput.bind(
                                                        this,
                                                        "variantSub"
                                                    )}
                                                    isClearable={true}
                                                    placeholder={
                                                        props.dataLang
                                                            ?.category_material_list_variant_sub ||
                                                        "category_material_list_variant_sub"
                                                    }
                                                    noOptionsMessage={() =>
                                                        `${props.dataLang?.no_data_found}`
                                                    }
                                                    menuPortalTarget={
                                                        document.body
                                                    }
                                                    onMenuOpen={handleMenuOpen}
                                                    className={` placeholder:text-slate-300 w-full bg-[#ffffff] rounded text-[#52575E] font-normal outline-none border `}
                                                    theme={(theme) => ({
                                                        ...theme,
                                                        colors: {
                                                            ...theme.colors,
                                                            primary25:
                                                                "#EBF5FF",
                                                            primary50:
                                                                "#92BFF7",
                                                            primary: "#0F4F9E",
                                                        },
                                                    })}
                                                    styles={{
                                                        placeholder: (
                                                            base
                                                        ) => ({
                                                            ...base,
                                                            color: "#cbd5e1",
                                                        }),
                                                        menuPortal: (base) => ({
                                                            ...base,
                                                            zIndex: 9999,
                                                            position:
                                                                "absolute",
                                                        }),
                                                    }}
                                                />
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <h5 className="text-slate-400 text-sm">
                                                    {props.dataLang
                                                        ?.branch_popup_variant_option ||
                                                        "branch_popup_variant_option"}
                                                </h5>
                                                {optVariantSub && (
                                                    <button
                                                        onClick={_HandleSelectedAllVariant.bind(
                                                            this,
                                                            "sub"
                                                        )}
                                                        className="text-sm font-medium"
                                                    >
                                                        Chọn tất cả
                                                    </button>
                                                )}
                                            </div>
                                            {!optVariantSub && (
                                                <div className="space-y-0.5">
                                                    <div className="w-full h-9 bg-slate-100 animate-[pulse_1s_ease-in-out_infinite] rounded" />
                                                    <div className="w-full h-9 bg-slate-100 animate-[pulse_1.1s_ease-in-out_infinite] rounded" />
                                                    <div className="w-full h-9 bg-slate-100 animate-[pulse_1.2s_ease-in-out_infinite] rounded" />
                                                </div>
                                            )}
                                            <ScrollArea
                                                className="max-h-[115px] w-full "
                                                speed={1}
                                                smoothScrolling={true}
                                            >
                                                <div className="flex flex-col space-y-0.5">
                                                    {optVariantSub?.map((e) => (
                                                        // <label key={e?.id.toString()} htmlFor={e.id} className='w-full space-x-2 py-1.5 px-3 bg-slate-50 hover:bg-slate-100 rounded cursor-pointer'>
                                                        //     <input type="checkbox" id={e.id} value={e.name} checked={optSelectedVariantSub.some((selectedOpt) => selectedOpt.id === e.id)} onChange={_HandleSelectedVariant.bind(this, "sub")} className="accent-lime-500" />
                                                        //     <span>{e.name}</span>
                                                        // </label>
                                                        <div
                                                            key={e?.id.toString()}
                                                            className="flex items-center "
                                                        >
                                                            <label
                                                                className="relative flex cursor-pointer items-center rounded-full p-2"
                                                                htmlFor={e.id}
                                                                data-ripple-dark="true"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-indigo-500 checked:bg-indigo-500 checked:before:bg-indigo-500 hover:before:opacity-10"
                                                                    id={e.id}
                                                                    value={
                                                                        e.name
                                                                    }
                                                                    checked={optSelectedVariantSub.some(
                                                                        (
                                                                            selectedOpt
                                                                        ) =>
                                                                            selectedOpt.id ===
                                                                            e.id
                                                                    )}
                                                                    onChange={_HandleSelectedVariant.bind(
                                                                        this,
                                                                        "sub"
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
                                                                className="text-[#344054] font-normal text-sm "
                                                            >
                                                                {e.name}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </ScrollArea>
                                        </div>
                                    </div>
                                    <div className="flex justify-end py-2">
                                        <button
                                            onClick={_HandleApplyVariant.bind(
                                                this
                                            )}
                                            disabled={
                                                optSelectedVariantMain?.length ==
                                                    0 &&
                                                optSelectedVariantSub?.length ==
                                                    0
                                                    ? true
                                                    : false
                                            }
                                            className="disabled:grayscale outline-none px-4 py-2 rounded-lg bg-[#E2F0FE] text-sm font-medium hover:scale-105 disabled:hover:scale-100 disabled:opacity-50 transition"
                                        >
                                            {props.dataLang?.apply || "apply"}
                                        </button>
                                    </div>
                                    {Object.keys(dataTotalVariant).length !==
                                        0 && (
                                        <div className="space-y-1">
                                            <h4 className="text-[#344054] font-medium">
                                                {props.dataLang?.list_variant ||
                                                    "list_variant"}
                                            </h4>
                                            <div
                                                className={`${
                                                    dataTotalVariant[0]
                                                        ?.variation_option_2
                                                        ?.length > 0
                                                        ? "grid-cols-4"
                                                        : "grid-cols-3"
                                                } grid gap-5 p-1`}
                                            >
                                                <h4 className="text-[15px] text-center font-[300] text-slate-400">
                                                    {props.dataLang?.avatar}
                                                </h4>
                                                <h4 className="text-[15px] font-[300] text-slate-400">
                                                    {
                                                        dataVariantSending[0]
                                                            ?.name
                                                    }
                                                </h4>
                                                {dataTotalVariant[0]
                                                    ?.variation_option_2
                                                    ?.length > 0 && (
                                                    <h4 className="text-[15px] font-[300] text-slate-400">
                                                        {
                                                            dataVariantSending[1]
                                                                ?.name
                                                        }
                                                    </h4>
                                                )}
                                                <h4 className="text-[15px] text-center font-[300] text-slate-400">
                                                    {props.dataLang
                                                        ?.branch_popup_properties ||
                                                        "branch_popup_properties"}
                                                </h4>
                                            </div>
                                            <ScrollArea
                                                className="max-h-[250px]"
                                                speed={1}
                                                smoothScrolling={true}
                                            >
                                                <div className="space-y-0.5">
                                                    {dataTotalVariant?.map(
                                                        (e) => (
                                                            <div
                                                                className={`${
                                                                    e
                                                                        ?.variation_option_2
                                                                        ?.length >
                                                                    0
                                                                        ? "grid-cols-4"
                                                                        : "grid-cols-3"
                                                                } grid gap-5 items-center bg-slate-50 hover:bg-slate-100 p-1`}
                                                                key={e?.id.toString()}
                                                            >
                                                                <div className="w-full h-full flex flex-col justify-center items-center">
                                                                    <input
                                                                        onChange={_HandleChangeVariant.bind(
                                                                            this,
                                                                            e?.id,
                                                                            "image"
                                                                        )}
                                                                        type="file"
                                                                        id={`uploadImg+${e?.id}`}
                                                                        accept="image/png, image/jpeg"
                                                                        hidden
                                                                    />
                                                                    <label
                                                                        htmlFor={`uploadImg+${e?.id}`}
                                                                        className="h-14 w-14 flex flex-col justify-center items-center bg-slate-200/50 cursor-pointer rounded"
                                                                    >
                                                                        {e.image ==
                                                                        null ? (
                                                                            <React.Fragment>
                                                                                <div className="h-14 w-14 flex flex-col justify-center items-center bg-slate-200/50 cursor-pointer rounded">
                                                                                    <IconImage />
                                                                                </div>
                                                                            </React.Fragment>
                                                                        ) : (
                                                                            <Image
                                                                                width={
                                                                                    64
                                                                                }
                                                                                height={
                                                                                    64
                                                                                }
                                                                                src={
                                                                                    typeof e.image ===
                                                                                    "string"
                                                                                        ? e.image
                                                                                        : URL.createObjectURL(
                                                                                              e.image
                                                                                          )
                                                                                }
                                                                                className="h-14 w-14 object-contain"
                                                                            />
                                                                        )}
                                                                    </label>
                                                                </div>
                                                                <div className="">
                                                                    {e.name}
                                                                </div>
                                                                {
                                                                    e
                                                                        ?.variation_option_2
                                                                        ?.length >
                                                                    0 ? (
                                                                        <div className="col-span-2 grid grid-cols-2 gap-1 items-center">
                                                                            {e?.variation_option_2?.map(
                                                                                (
                                                                                    ce
                                                                                ) => (
                                                                                    <React.Fragment
                                                                                        key={ce.id?.toString()}
                                                                                    >
                                                                                        <div>
                                                                                            {
                                                                                                ce.name
                                                                                            }
                                                                                        </div>
                                                                                        <div className="flex justify-center">
                                                                                            <button
                                                                                                onClick={_HandleDeleteVariant.bind(
                                                                                                    this,
                                                                                                    e.id,
                                                                                                    ce.id
                                                                                                )}
                                                                                                className="p-1.5 text-red-500 hover:scale-110 transition hover:text-red-600"
                                                                                            >
                                                                                                <IconDelete size="22" />
                                                                                            </button>
                                                                                        </div>
                                                                                        {/* <input value={ce.sku} onChange={_HandleChangeSku.bind(this, e.id, ce.id)} placeholder='Mã SKU' className={`focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full h-fit bg-[#ffffff] rounded text-[#52575E] font-normal p-2 border outline-none`} /> */}
                                                                                    </React.Fragment>
                                                                                )
                                                                            )}
                                                                        </div>
                                                                    ) : (
                                                                        <div className="flex justify-center">
                                                                            <button
                                                                                onClick={_HandleDeleteVariantItems.bind(
                                                                                    this,
                                                                                    e.id
                                                                                )}
                                                                                className="p-1.5 text-red-500 hover:scale-110 transition hover:text-red-600"
                                                                            >
                                                                                <IconDelete size="22" />
                                                                            </button>
                                                                        </div>
                                                                    )
                                                                    // <input value={e?.sku} onChange={_HandleChangeVariant.bind(this, e.id, "sku")} placeholder='Mã SKU' className={`focus:border-[#92BFF7] border-[#d0d5dd] placeholder:text-slate-300 w-full h-fit bg-[#ffffff] rounded text-[#52575E] font-normal p-2 border outline-none`} />
                                                                }
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </ScrollArea>
                                        </div>
                                    )}
                                </div>
                            )}
                        </React.Fragment>
                    )}
                </ScrollArea>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={_ToggleModal.bind(this, false)}
                        className="text-base py-2 px-4 rounded-lg bg-slate-200 hover:opacity-90 hover:scale-105 transition"
                    >
                        {props.dataLang?.branch_popup_exit}
                    </button>
                    <button
                        onClick={_HandleSubmit.bind(this)}
                        className="text-[#FFFFFF] text-base py-2 px-4 rounded-lg bg-[#0F4F9E] hover:opacity-90 hover:scale-105 transition"
                    >
                        {props.dataLang?.branch_popup_save}
                    </button>
                </div>
            </div>
        </PopupEdit>
    );
});

const Popup_ThongTin = React.memo((props) => {
    const [open, sOpen] = useState(false);
    const _ToggleModal = (e) => sOpen(e);

    const [tab, sTab] = useState(0);
    const _HandleSelectTab = (e) => sTab(e);

    const [onFetching, sOnFetching] = useState(false);
    const [list, sList] = useState({});

    const _ServerFetching = () => {
        Axios(
            "GET",
            `/api_web/api_material/material/${props.id}?csrf_protection=true`,
            {},
            (err, response) => {
                if (!err) {
                    sList({ ...response.data });
                }
                sOnFetching(false);
            }
        );
    };

    useEffect(() => {
        onFetching && _ServerFetching();
    }, [onFetching]);

    useEffect(() => {
        open && sTab(0);
        open && sOnFetching(true);
    }, [open]);

    return (
        <PopupEdit
            title={
                props.dataLang?.category_material_list_detail ||
                "category_material_list_detail"
            }
            button={props.children}
            onClickOpen={_ToggleModal.bind(this, true)}
            open={open}
            onClose={_ToggleModal.bind(this, false)}
        >
            <div className="py-4 w-[800px] space-y-5">
                <div className="flex items-center space-x-4 border-[#E7EAEE] border-opacity-70 border-b-[1px]">
                    <button
                        onClick={_HandleSelectTab.bind(this, 0)}
                        className={`${
                            tab === 0
                                ? "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]"
                                : "hover:text-[#0F4F9E] "
                        }  px-4 py-2 outline-none font-medium`}
                    >
                        {props.dataLang?.information || "information"}
                    </button>
                    <button
                        onClick={_HandleSelectTab.bind(this, 1)}
                        className={`${
                            tab === 1
                                ? "text-[#0F4F9E]  border-b-2 border-[#0F4F9E]"
                                : "hover:text-[#0F4F9E] "
                        }  px-4 py-2 outline-none font-medium`}
                    >
                        {props.dataLang?.category_material_list_variant ||
                            "category_material_list_variant"}
                    </button>
                </div>
                {onFetching ? (
                    <Loading className="h-96" color="#0f4f9e" />
                ) : (
                    <React.Fragment>
                        {tab === 0 ? (
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-3 bg-slate-100/40 p-2 rounded-md">
                                    <div className="flex justify-between">
                                        <h5 className="text-slate-400 text-sm w-[40%]">
                                            {props.dataLang
                                                ?.client_list_brand ||
                                                "client_list_brand"}
                                            :
                                        </h5>
                                        <div className="w-[55%] flex flex-col items-end">
                                            {list?.branch?.map((e) => (
                                                <h6
                                                    key={e.id.toString()}
                                                    className="w-fit text-right"
                                                >
                                                    {e.name}
                                                </h6>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <h5 className="text-slate-400 text-sm w-[40%]">
                                            {props.dataLang?.category_titel ||
                                                "category_titel"}
                                            :
                                        </h5>
                                        <h6 className="w-[55%] text-right">
                                            {list?.category_name}
                                        </h6>
                                    </div>
                                    <div className="flex justify-between">
                                        <h5 className="text-slate-400 text-sm w-[40%]">
                                            {props.dataLang
                                                ?.category_material_list_code ||
                                                "category_material_list_code"}
                                            :
                                        </h5>
                                        <h6 className="w-[55%] text-right">
                                            {list?.code}
                                        </h6>
                                    </div>
                                    <div className="flex justify-between">
                                        <h5 className="text-slate-400 text-sm w-[40%]">
                                            {props.dataLang
                                                ?.category_material_list_name ||
                                                "category_material_list_name"}
                                            :
                                        </h5>
                                        <h6 className="w-[55%] text-right">
                                            {list?.name}
                                        </h6>
                                    </div>
                                    <div className="flex justify-between">
                                        <h5 className="text-slate-400 text-sm w-[40%]">
                                            {props.dataLang
                                                ?.category_material_list_cost_price ||
                                                "category_material_list_cost_price"}
                                            :
                                        </h5>
                                        <h6 className="w-[55%] text-right">
                                            {Number(
                                                list?.import_price
                                            ).toLocaleString()}
                                        </h6>
                                    </div>
                                    <div className="flex justify-between">
                                        <h5 className="text-slate-400 text-sm w-[40%]">
                                            {props.dataLang?.minimum_amount ||
                                                "minimum_amount"}
                                            :
                                        </h5>
                                        <h6 className="w-[55%] text-right">
                                            {Number(
                                                list?.minimum_quantity
                                            ).toLocaleString()}
                                        </h6>
                                    </div>
                                    {props.dataMaterialExpiry?.is_enable ===
                                    "1" ? (
                                        <div className="flex justify-between">
                                            <h5 className="text-slate-400 text-sm w-[40%]">
                                                {props.dataLang
                                                    ?.category_material_list_expiry_date ||
                                                    "category_material_list_expiry_date"}
                                                :
                                            </h5>
                                            <h6 className="w-[55%] text-right">
                                                {Number(
                                                    list?.expiry
                                                ).toLocaleString()}{" "}
                                                {props.dataLang?.date || "date"}
                                            </h6>
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                    <div className="flex justify-between">
                                        <h5 className="text-slate-400 text-sm w-[40%]">
                                            {props.dataLang
                                                ?.category_material_list_purchase_unit ||
                                                "category_material_list_purchase_unit"}
                                            :
                                        </h5>
                                        <h6 className="w-[55%] text-right">
                                            {list?.unit}
                                        </h6>
                                    </div>
                                    <h5 className="text-slate-400 text-[15px] font-medium">
                                        {props.dataLang
                                            ?.category_material_list_converting_unit ||
                                            "category_material_list_converting_unit"}
                                    </h5>
                                    <div className="flex justify-between">
                                        <h5 className="text-slate-400 text-sm w-[40%]">
                                            {props.dataLang?.unit || "unit"}:
                                        </h5>
                                        <h6 className="w-[55%] text-right">
                                            {list?.unit_convert}
                                        </h6>
                                    </div>
                                    <div className="flex justify-between">
                                        <h5 className="text-slate-400 text-sm w-[40%]">
                                            {props.dataLang
                                                ?.category_material_list_converting_amount ||
                                                "category_material_list_converting_amount"}
                                            :
                                        </h5>
                                        <h6 className="w-[55%] text-right">
                                            {list?.coefficient}
                                        </h6>
                                    </div>
                                </div>
                                <div className="space-y-3 flex flex-col justify-between">
                                    <div className="flex bg-slate-100/40 p-2 rounded-md">
                                        <h5 className="text-slate-400 text-sm w-[40%]">
                                            {props.dataLang?.avatar || "avatar"}
                                            :
                                        </h5>
                                        {list?.created_by_avatar == null ? (
                                            <img
                                                src="/no_image.png"
                                                className="w-48 h-48 rounded object-contain select-none pointer-events-none"
                                            />
                                        ) : (
                                            <Image
                                                width={200}
                                                height={200}
                                                quality={100}
                                                src={list?.created_by_avatar}
                                                alt="thumb type"
                                                className="w-48 h-48 rounded object-contain select-none pointer-events-none"
                                                loading="lazy"
                                                crossOrigin="anonymous"
                                                blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                            />
                                        )}
                                    </div>
                                    <div className="bg-slate-100/40 p-2 rounded-md space-y-3">
                                        <h4 className="flex space-x-2">
                                            <IconUserEdit size={20} />
                                            <span className="text-[15px] font-medium">
                                                Người lập phiếu
                                            </span>
                                        </h4>
                                        <div className="flex justify-between">
                                            <h5 className="text-slate-400 text-sm w-[30%]">
                                                {props.dataLang?.creator ||
                                                    "creator"}
                                                :
                                            </h5>
                                            <h6 className="w-[65%] text-right">
                                                {list?.created_by}
                                            </h6>
                                        </div>
                                        <div className="flex justify-between">
                                            <h5 className="text-slate-400 text-sm w-[30%]">
                                                {props.dataLang?.date_created ||
                                                    "date_created"}
                                                :
                                            </h5>
                                            <h6 className="w-[65%] text-right">
                                                {moment(
                                                    list?.date_created
                                                ).format("DD/MM/YYYY")}
                                            </h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <React.Fragment>
                                {list?.variation?.length > 0 ? (
                                    <div className="space-y-2 min-h-[384px]">
                                        <div
                                            className={`${
                                                list?.variation[1]
                                                    ? "grid-cols-3"
                                                    : "grid-cols-2"
                                            } grid gap-2 px-2 py-1 `}
                                        >
                                            <h5 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase font-[300] text-center">
                                                Hình đại diện
                                            </h5>
                                            <h5 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase font-[300]">
                                                {list?.variation[0]?.name}
                                            </h5>
                                            {list?.variation[1] && (
                                                <h5 className="xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase font-[300]">
                                                    {list?.variation[1]?.name}
                                                </h5>
                                            )}
                                            {/* <h5 className='xl:text-[14px] text-[12px] px-2 text-[#667085] uppercase font-[300]'>SKU</h5> */}
                                        </div>
                                        <ScrollArea
                                            className="min-h-[400px] max-h-[450px]"
                                            speed={1}
                                            smoothScrolling={true}
                                        >
                                            <div className="divide-y divide-slate-200">
                                                {list?.variation_option_value?.map(
                                                    (e) => (
                                                        <div
                                                            key={e?.id.toString()}
                                                            className={`${
                                                                e
                                                                    ?.variation_option_2
                                                                    ?.length > 0
                                                                    ? "grid-cols-3"
                                                                    : "grid-cols-2"
                                                            } grid gap-2 px-2 py-2.5 hover:bg-slate-50`}
                                                        >
                                                            <div className="flex justify-center self-center">
                                                                {e?.image ==
                                                                null ? (
                                                                    <img
                                                                        src="/no_image.png"
                                                                        className="w-auto h-20 rounded object-contain select-none pointer-events-none"
                                                                    />
                                                                ) : (
                                                                    <Image
                                                                        width={
                                                                            200
                                                                        }
                                                                        height={
                                                                            200
                                                                        }
                                                                        quality={
                                                                            100
                                                                        }
                                                                        src={
                                                                            e?.image
                                                                        }
                                                                        alt="thumb type"
                                                                        className="w-auto h-20 rounded object-contain select-none pointer-events-none"
                                                                        loading="lazy"
                                                                        crossOrigin="anonymous"
                                                                        blurDataURL="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
                                                                    />
                                                                )}
                                                            </div>
                                                            <h6 className="px-2 xl:text-base text-xs self-center">
                                                                {e?.name}
                                                            </h6>
                                                            {e
                                                                ?.variation_option_2
                                                                ?.length >
                                                                0 && (
                                                                <div className="self-center space-y-0.5">
                                                                    {e?.variation_option_2?.map(
                                                                        (
                                                                            ce
                                                                        ) => (
                                                                            <React.Fragment
                                                                                key={ce.id?.toString()}
                                                                            >
                                                                                <h6 className="px-2 xl:text-base text-xs">
                                                                                    {
                                                                                        ce.name
                                                                                    }
                                                                                </h6>
                                                                            </React.Fragment>
                                                                        )
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </ScrollArea>
                                    </div>
                                ) : (
                                    <div className="w-full h-96 flex flex-col justify-center items-center">
                                        <div className="bg-[#EBF4FF] rounded-[100%] inline-block ">
                                            <IconSearch />
                                        </div>
                                        <h1 className="text-[#141522] text-base opacity-90 font-medium">
                                            {props.dataLang?.no_data_found}
                                        </h1>
                                    </div>
                                )}
                            </React.Fragment>
                        )}
                    </React.Fragment>
                )}
            </div>
        </PopupEdit>
    );
});

export default Index;
